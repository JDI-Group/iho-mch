// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";
import "./interfaces/IIHOFuel.sol";
import "./erc6551/interfaces/IERC6551Registry.sol";

/**
 * @title IHOMining
 * @dev Contract for managing device registration and reward distribution
 *
 * This contract implements a system where devices can be registered and associated with
 * ERC6551 token-bound accounts. These accounts can receive rewards through verified claims.
 * The contract leverages ERC721 for device ownership and ERC6551 for account management.
 */

/// @notice Error thrown when device identifier is empty
error DeviceEmpty();
/// @notice Error thrown when device is already registered
error DeviceRegistered();
/// @notice Error thrown when device is not registered
error DeviceUnregistered();
/// @notice Error thrown when receive operation is invalid
error ReceiveInvalid();
/// @notice Error thrown when claim ID has already been used
error ClaimAlreadyUsed(string claimId);
/// @notice Error thrown when rewards array is empty
error EmptyRewards();

contract IHOMining is
  VerifiableUpgradeable,
  BidirectionalTransfer,
  UUPSUpgradeable,
  OwnableUpgradeable,
  ERC721Upgradeable {
  
  /// @notice The ERC6551 registry contract for creating token-bound accounts
  IERC6551Registry erc6551Registry;
  
  /// @notice The address of the IHOFuel contract for token deposits
  address public fuel;
  
  /// @notice The implementation address for ERC6551 accounts
  address public erc6551AccountImplementation;
  
  /**
   * @dev Sets the fuel contract address
   * @param _fuel The new fuel contract address
   */
  function setFuel(address _fuel) public onlyOwner {
    fuel = _fuel;
  }

  /// @notice The next token ID to be minted
  uint256 private _tokenId;
  
  /// @notice The total number of tokens minted
  uint128 public totalSupply;

  /**
   * @dev Structure mapping a device to its token information
   * @param token The token contract address
   * @param tokenId The token ID
   */
  struct TokenMapping {
    address token;
    uint256 tokenId;
  }

  struct Reward {
    string claimId;
    string device;
    Coin[] rewards;
    bool fuelling;
    string memo;
  }

  /// @notice Mapping from device identifier to token information
  mapping(string device => TokenMapping) private DeviceMapToken;
  
  /// @notice Mapping from token address and ID to device identifier
  mapping(address token => mapping(uint256 tokenId => string device)) private TokenMapDevice;
  
  /// @notice Mapping to track used claim IDs
  mapping(string => bool) private ClaimedIDs;

  /**
   * @notice Emitted when a device is registered
   * @param owner The owner of the device
   * @param token The token contract address
   * @param tokenId The token ID
   * @param account The ERC6551 account address
   * @param device The device identifier
   * @param blockHeight The block height at registration
   * @param timestamp The timestamp of registration
   */
  event Registered(
    address indexed owner,
    address indexed token,
    uint256 indexed tokenId,
    address account,
    string device,
    int256 blockHeight,
    uint256 timestamp
  );

  /**
   * @notice Emitted when rewards are claimed
   * @param owner The owner receiving the rewards
   * @param token The token contract address
   * @param tokenId The token ID
   * @param account The ERC6551 account address
   * @param device The device identifier
   * @param rewards The array of rewards (tokens and amounts)
   * @param blockHeight The block height at claim
   * @param timestamp The timestamp of claim
   */
  event Claimed(
    address indexed owner,
    address indexed token,
    uint256 indexed tokenId,
    address account,
    string device,
    Coin[] rewards,
    string memo,
    int256 blockHeight,
    uint256 timestamp
  );

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  
  /**
   * @dev Authorizes an upgrade to a new implementation
   * @param newImplementation The address of the new implementation
   */
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  /**
   * @dev Initializes the contract
   * @param _fuelAddress The address of the IHOFuel contract
   * @param _registryAddress The address of the ERC6551Registry contract
   * @param _erc6551AccountImplementation The implementation address for ERC6551 accounts
   * @param _verifier The address of the verifier for signatures
   */
  function initialize(
    address _fuelAddress,
    address _registryAddress,
    address _erc6551AccountImplementation,
    address _verifier
  ) public initializer {
    fuel = _fuelAddress;
    erc6551Registry = IERC6551Registry(_registryAddress);
    erc6551AccountImplementation = _erc6551AccountImplementation;

    __ERC721_init("IHOMining", "IHOM");
    __Ownable_init(msg.sender);
    __Verifie_init(_verifier);
    __UUPSUpgradeable_init();
  }

  /**
   * @dev Registers a new device
   * @param device The device identifier
   *
   * Creates a new ERC721 token and associates it with an ERC6551 account
   */
  function register(string memory device, bytes memory signature) public {
    if (bytes(device).length == 0)
      revert DeviceEmpty();
    if (DeviceMapToken[device].token != address(0))
      revert DeviceRegistered();

    verify(abi.encodePacked(msg.sender, device), signature);

    uint256 _tokenID = _mint(msg.sender);
    address _account = _mintAccount(address(this), _tokenID);

    TokenMapDevice[address(this)][_tokenID] = device;
    DeviceMapToken[device] = TokenMapping(address(this), _tokenID);

    emit Registered(
      msg.sender,
      address(this),
      _tokenID,
      _account,
      device,
      int(block.number),
      block.timestamp
    );
  }

  /**
   * @dev Claims rewards for a registered device
   * @param claimId Unique identifier for this claim
   * @param device The device identifier
   * @param rewards Array of rewards (tokens and amounts)
   * @param signature Verification signature from authorized verifier
   * @param fuelling Whether to deposit rewards to fuel contract or directly to account
   */
  function claim(
    string memory claimId,
    string memory device,
    Coin[] memory rewards,
    bytes memory signature,
    bool fuelling,
    string memory memo
  ) public payable {
    TokenMapping memory tm = DeviceMapToken[device];
  
    if (bytes(device).length == 0)
      revert DeviceEmpty();
    if (tm.token == address(0))
      revert DeviceUnregistered();
    if (ClaimedIDs[claimId])
      revert ClaimAlreadyUsed(claimId);
    if (rewards.length == 0)
      revert EmptyRewards();
  
    if (msg.sender != owner()) {
      bytes32 rewardsHash = keccak256(abi.encode(rewards));
      verify(abi.encodePacked(claimId, device, rewardsHash), signature);
    }
    
    // Mark claim as used
    ClaimedIDs[claimId] = true;
    
    address deviceAccount = accountOf(device);
    
    if (fuelling)
      _fills(deviceAccount, rewards);
    else
      _gifts(deviceAccount, rewards);
      
    emit Claimed(
      IERC721(tm.token).ownerOf(tm.tokenId),
      tm.token,
      tm.tokenId,
      deviceAccount,
      device,
      rewards,
      memo,
      int(block.number),
      block.timestamp
    );
  }

  function claims(Reward[] memory rewards) public payable onlyOwner {
    for (uint256 i = 0; i < rewards.length; i++) {
      claim(
        rewards[i].claimId,
        rewards[i].device,
        rewards[i].rewards,
        new bytes(0),
        rewards[i].fuelling,
        rewards[i].memo
      );
    }
  }

  /**
   * @dev Gets the token information for a device
   * @param device The device identifier
   * @return TokenMapping structure with token address and ID
   */
  function tokenOf(string memory device) public view returns (TokenMapping memory) {
    return DeviceMapToken[device];
  }

  /**
   * @dev Gets the device identifier for a token
   * @param token The token contract address
   * @param tokenId The token ID
   * @return The device identifier
   */
  function deviceOf(address token, uint256 tokenId) public view returns (string memory) {
    return TokenMapDevice[token][tokenId];
  }

  /**
   * @dev Gets the ERC6551 account address for a device
   * @param device The device identifier
   * @return The account address (or address(0) if device not registered)
   */
  function accountOf(string memory device) public view returns (address) {
    TokenMapping memory tm = DeviceMapToken[device];
    if (tm.token == address(0))
      return address(0);
    return erc6551Registry.account(
      erc6551AccountImplementation,
      block.chainid,
      tm.token,
      tm.tokenId,
      0
    );
  }

  /**
   * @dev Gets the ERC6551 account address for a token
   * @param token The token contract address
   * @param tokenId The token ID
   * @return The account address
   */
  function accountOfToken(address token, uint256 tokenId) public view returns (address) {
    return erc6551Registry.account(
      erc6551AccountImplementation,
      block.chainid,
      token,
      tokenId,
      0
    );
  }

  /**
   * @dev Internal function to deposit rewards to the fuel contract
   * @param owner The recipient address
   * @param coins Array of rewards (tokens and amounts)
   */
  function _fills(address owner, Coin[] memory coins) internal {
    for (uint256 i = 0; i < coins.length; i++)
      if (coins[i].token == address(0))
        IIHOFuel(fuel).deposit{ value: coins[i].amount }(owner, coins[i].token, coins[i].amount);
      else
        IIHOFuel(fuel).deposit(owner, coins[i].token, coins[i].amount);
  }
  
  /**
   * @dev Internal function to transfer rewards directly to the recipient
   * @param owner The recipient address
   * @param coins Array of rewards (tokens and amounts)
   */
  function _gifts(address owner, Coin[] memory coins) internal {
    transfers(address(this), owner, coins);
  }

  /**
   * @dev Internal function to mint a new token
   * @param owner The token owner
   * @return The minted token ID
   */
  function _mint(address owner) private returns (uint256) {
    uint256 tokenId = _tokenId;
    _safeMint(owner, tokenId);
    totalSupply += 1;
    _tokenId += 1;
    return tokenId;
  }

  /**
   * @dev Internal function to create an ERC6551 account for a token
   * @param token The token contract address
   * @param tokenId The token ID
   * @return _account The created account address
   */
  function _mintAccount(address token, uint256 tokenId) private returns (address _account) {
    bytes memory data = abi.encodeWithSignature(
      "initialize(address[])",
      new address[](0)
    );
    _account = erc6551Registry.createAccount(
      erc6551AccountImplementation,
      block.chainid,
      token,
      tokenId,
      0,
      data
    );
  }
}