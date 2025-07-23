// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";
import "./erc6551/interfaces/IERC6551Registry.sol";
import "./IHOMiningStruct.sol";

/**
 * @title IHOMining
 * @dev Contract for managing device registration and reward distribution
 *
 * This contract implements a system where devices can be registered and associated with
 * ERC6551 token-bound accounts. These accounts can receive rewards through verified claims.
 * The contract leverages ERC721 for device ownership and ERC6551 for account management.
 */

/// @notice Error thrown when device is already registered
error DeviceRegistered();
/// @notice Error thrown when device is not registered
error DeviceUnregistered();
/// @notice Error thrown when claim ID has already been used
error ClaimAlreadyUsed();
/// @notice Error thrown when MAC address format is invalid
error InvalidMacFormat();

contract IHOMining is
  VerifiableUpgradeable,
  BidirectionalTransfer,
  UUPSUpgradeable,
  OwnableUpgradeable,
  ERC721Upgradeable {
  
  /// @notice The ERC6551 registry contract for creating token-bound accounts
  IERC6551Registry erc6551Registry;
  
  
  /// @notice The implementation address for ERC6551 accounts
  address public erc6551AccountImplementation;

  /// @notice The next token ID to be minted
  uint256 private _tokenId;
  
  /// @notice The total number of tokens minted
  uint128 public totalSupply;


  /// @notice Mapping from device identifier to token information
  mapping(string mac => Token) private DeviceMapToken;

  /// @notice Mapping from account address to token information
  mapping(address account => Token) private AccountMapToken;

  mapping(uint256 order => Token) private OrderMapToken;

  /// @notice Mapping from token address and ID to device identifier
  mapping(address token => mapping(uint256 tokenId => Device)) private TokenMapDevice;
  
  /// @notice Mapping to track used claim IDs
  mapping(string => bool) private ClaimedIDs;

  /**
   * @notice Emitted when a device is registered
   * @param owner The owner of the device
   * @param token The token contract address
   * @param tokenId The token ID
   * @param name The device name
   * @param mac The device MAC address
   * @param account The ERC6551 account address
   * @param blockHeight The block height at registration
   * @param timestamp The timestamp of registration
   */
  event Registered(
    address indexed owner,
    address indexed token,
    uint256 indexed tokenId,
    address account,
    uint128 product,
    uint128 order,
    string name,
    string mac,
    int256 blockHeight,
    uint256 timestamp
  );

  /**
   * @notice Emitted when rewards are claimed
   * @param owner The owner receiving the rewards
   * @param token The token contract address
   * @param tokenId The token ID
   * @param account The ERC6551 account address
   * @param name The device name
   * @param mac The device MAC address
   * @param rewards The array of rewards (tokens and amounts)
   * @param memo Additional information about the claim
   * @param blockHeight The block height at claim
   * @param timestamp The timestamp of claim
   */
  event Claimed(
    address indexed owner,
    address indexed token,
    uint256 indexed tokenId,
    address account,
    Coin[] rewards,
    string name,
    string mac,
    string memo,
    int256 blockHeight,
    uint256 timestamp
  );

  event ClaimTrigger(
    address indexed trigger,
    Reward[] rewards,
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
   * @param _registryAddress The address of the ERC6551Registry contract
   * @param _erc6551AccountImplementation The implementation address for ERC6551 accounts
   * @param _verifier The address of the verifier for signatures
   */
  function initialize(
    address _registryAddress,
    address _erc6551AccountImplementation,
    address _verifier
  ) public initializer {
    erc6551Registry = IERC6551Registry(_registryAddress);
    erc6551AccountImplementation = _erc6551AccountImplementation;
    __ERC721_init("IHOMining", "IHOM");
    __Ownable_init(msg.sender);
    __Verifie_init(_verifier);
    __UUPSUpgradeable_init();
  }

  /**
   * @dev Registers a new device
   * @param name The device name
   * @param mac The device MAC address
   * @param signature Verification signature from authorized verifier
   *
   * Creates a new ERC721 token and associates it with an ERC6551 account
   */
  function register(string memory name, string memory mac, uint128 product, uint128 order, bytes memory signature) public {
    if (bytes(mac).length < 6)
      revert InvalidMacFormat();

    if (DeviceMapToken[mac].tokenContract != address(0) || OrderMapToken[order].tokenContract != address(0))
      revert DeviceRegistered();

    verify(keccak256(abi.encodePacked(msg.sender, name, mac, product, order)), signature);

    uint256 _tokenID = _mint(msg.sender);
    address _account = _mintAccount(address(this), _tokenID);

    Token memory token = Token(address(this), _tokenID);
    Device memory device = Device(product, name, mac);
    TokenMapDevice[address(this)][_tokenID] = device;
    AccountMapToken[_account] = token;
    DeviceMapToken[mac] = token;
    OrderMapToken[order] = token;

    emit Registered(
      msg.sender,
      address(this),
      _tokenID,
      _account,
      product,
      order,
      name,
      mac,
      int(block.number),
      uint256(block.timestamp)
    );
  }

  /**
   * @dev Claims rewards for a registered device
   * @param id Unique identifier for this claim
   * @param account The device MAC address
   * @param rewards Array of rewards (tokens and amounts)
   * @param signature Verification signature from authorized verifier
   * @param memo Additional information about the claim
   */
  function claim(string memory id, address  account, Coin[] memory rewards, bytes memory signature, string memory memo) public payable {
    Token memory token = AccountMapToken[account];
  
    if (token.tokenContract == address(0))
      revert DeviceUnregistered();
    if (ClaimedIDs[id])
      revert ClaimAlreadyUsed();
  
    if (msg.sender != owner()) {
      bytes32 rewardsHash = keccak256(abi.encode(rewards));
      bytes32 claimHash = keccak256(abi.encodePacked(id, account, rewardsHash));
      verify(claimHash, signature);
    }

    // Mark claim as used
    ClaimedIDs[id] = true;

    _gifts(account, rewards);

    Device memory device = TokenMapDevice[token.tokenContract][token.tokenId];

    emit Claimed(
      IERC721(token.tokenContract).ownerOf(token.tokenId),
      token.tokenContract,
      token.tokenId,
      account,
      rewards,
      device.name,
      device.mac,
      memo,
      int(block.number),
      uint256(block.timestamp)
    );
  }

  /**
   * @dev Claims rewards for multiple devices in a single transaction
   * @param rewards Array of Reward structures containing claim details
   */
  function claims(Reward[] memory rewards) public payable onlyOwner {
    for (uint256 i = 0; i < rewards.length; i++) {
      claim(
        rewards[i].id,
        rewards[i].account,
        rewards[i].rewards,
        new bytes(0),
        rewards[i].memo
      );
    }
    emit ClaimTrigger(
      msg.sender,
      rewards,
      int(block.number),
      uint256(block.timestamp)
    );
  }

  /**
   * @dev Gets the token information for a device
   * @param mac The device MAC address
   * @return Token structure with token address and ID
   */
  function tokenOfDevice(string memory mac) public view returns (Token memory) {
    return DeviceMapToken[mac];
  }

  /**
   * @dev Gets the token information for an account
   * @param account The account address
   * @return Token structure with token address and ID
   */
  function tokenOf(address account) public view returns (Token memory) {
    return AccountMapToken[account];
  }

  /**
   * @dev Gets the device identifier for a token
   * @param token The token contract address
   * @param tokenId The token ID
   * @return The device identifier
   */
  function deviceOfToken(address token, uint256 tokenId) public view returns (Device memory) {
    return TokenMapDevice[token][tokenId];
  }
  /**
   * @dev Gets the device identifier for a account
   * @param account The account address
   * @return The device identifier
   */
  function deviceOf(address account) public view returns (Device memory) {
    Token memory token = AccountMapToken[account];
    return deviceOfToken(token.tokenContract, token.tokenId);
  }

  /**
   * @dev Gets the ERC6551 account address for a device
   * @param mac The device MAC address
   * @return The account address (or address(0) if device not registered)
   */
  function accountOfDevice(string memory mac) public view returns (address) {
    Token memory token = DeviceMapToken[mac];
    if (token.tokenContract == address(0))
      return address(0);
    return accountOf(token.tokenContract, token.tokenId);
  }

  /**
   * @dev Gets the ERC6551 account address for a token
   * @param token The token contract address
   * @param tokenId The token ID
   * @return The account address
   */
  function accountOf(address token, uint256 tokenId) public view returns (address) {
    return erc6551Registry.account(
      erc6551AccountImplementation,
      block.chainid,
      token,
      tokenId,
      0
    );
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

  function withdraw(address token, uint256 amount) external onlyOwner {
    transfer(address(this), msg.sender, token, amount);
  }

  /**
   * @dev Internal function to create an ERC6551 account for a token
   * @param token The token contract address
   * @param tokenId The token ID
   * @return _account The created account address
   */
  function _mintAccount(address token, uint256 tokenId) private returns (address _account) {
    _account = erc6551Registry.createAccount(
      erc6551AccountImplementation,
      block.chainid,
      token,
      tokenId,
      0,
      ""
    );
  }
}