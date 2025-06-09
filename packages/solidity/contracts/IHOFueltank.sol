// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

/**
 * @title IHOFuel
 * @dev Contract for managing token deposits and withdrawals with time-lock functionality
 *
 * This contract allows users to deposit tokens (ETH or ERC20) and later withdraw them
 * after a specified lock period. It provides functionality for depositing, cancelling,
 * and claiming tokens with appropriate time constraints.
 */
contract IHOFueltank is
  BidirectionalTransfer,
  UUPSUpgradeable,
  OwnableUpgradeable {

  /// @notice Custom errors for better debugging and gas efficiency
  error InsufficientBalance(address owner, address token, uint256 requested, uint256 available);
  error InvalidAmount(uint256 amount);
  error InvalidIndex(uint256 index);
  error LocktimeNotExpired(uint256 current, uint256 required);

  /**
   * @dev Structure representing a locked token
   * @param token The token address (address(0) for ETH)
   * @param amount The locked amount
   */
  struct LockedCoin {
    address token;
    uint256 amount;
  }

  /**
   * @dev Structure representing a token in the process of being unlocked
   * @param index The index in the unlock array
   * @param token The token address (address(0) for ETH)
   * @param amount The amount to unlock
   * @param timestamp The timestamp when the token can be claimed
   */
  struct UnlockCoin {
    uint256 index;
    address token;
    uint256 amount;
    uint256 timestamp;
  }

  /// @notice The lock period in seconds (default: 30 days)
  uint256 public locktime;

  /// @notice Mapping of user address to token address to locked coin details
  mapping(address => mapping(address => LockedCoin)) private LockedCoins;
  
  /// @notice Mapping of user address to array of coins in the unlocking process
  mapping(address => UnlockCoin[]) private UnlockCoins;
  
  /// @notice Emitted when tokens are deposited
  event Deposited(address indexed sender, address indexed token, uint256 amount);
  
  /// @notice Emitted when a withdrawal is initiated (enters unlock period)
  event Cancelled(address indexed sender, uint256 index, address indexed token, uint256 amount, uint256 unlocktime);
  
  /// @notice Emitted when tokens are claimed after the unlock period
  event Claimed(address indexed sender, uint256 index, address indexed token, uint256 amount);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  
  /**
   * @dev Authorizes an upgrade to a new implementation
   * @param newImplementation The address of the new implementation
   */
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  /**
   * @dev Initializes the contract
   * Sets the initial owner and default lock time (30 days)
   */
  function initialize() public initializer {
    __Ownable_init(msg.sender);
    __UUPSUpgradeable_init();
    locktime = 30 * 86400; // 30 days in seconds
  }

  /**
   * @dev Deposits tokens into the contract
   * @param owner The address that will own the deposited tokens
   * @param token The token address (address(0) for ETH)
   * @param amount The amount to deposit
   */
  function deposit(address owner, address token, uint256 amount) public payable {
    if (amount == 0) revert InvalidAmount(amount);
    
    LockedCoins[owner][token].amount += amount;
    transfer(msg.sender, address(this), token, amount);
    emit Deposited(owner, token, amount);
  }

  /**
   * @dev Initiates the withdrawal process by starting the unlock period
   * @param token The token address to withdraw
   * @param amount The amount to withdraw
   */
  function cancel(address token, uint256 amount) public {
    if (amount == 0) revert InvalidAmount(amount);
    
    uint256 available = LockedCoins[msg.sender][token].amount;
    if (amount > available) revert InsufficientBalance(msg.sender, token, amount, available);
    
    uint index = UnlockCoins[msg.sender].length;
    uint unlocktime = block.timestamp + locktime;
    UnlockCoin memory coin = UnlockCoin(index, token, amount, unlocktime);
    UnlockCoins[msg.sender].push(coin);
    LockedCoins[msg.sender][token].amount -= amount;
    
    emit Cancelled(msg.sender, index, token, amount, unlocktime);
  }

  /**
   * @dev Claims tokens after the unlock period has passed
   * @param index The index of the unlock coin to claim
   */
  function claim(uint256 index) public {
    if (index >= UnlockCoins[msg.sender].length)
      revert InvalidIndex(index);

    UnlockCoin memory coin = UnlockCoins[msg.sender][index];
    if (coin.amount == 0)
      revert InvalidIndex(index);
    if (block.timestamp < coin.timestamp)
      revert LocktimeNotExpired(block.timestamp, coin.timestamp);

    transfer(address(this), msg.sender, coin.token, coin.amount);

    delete UnlockCoins[msg.sender][index];
    emit Claimed(msg.sender, index, coin.token, coin.amount);
  }

  /**
   * @dev Returns the balance of a specific token for an owner
   * @param owner The address of the token owner
   * @param token The token address
   * @return The amount of tokens owned
   */
  function balanceOf(address owner, address token) public view returns (uint256) {
    return LockedCoins[owner][token].amount;
  }

  /**
   * @dev Returns all coins in the unlocking process for an owner
   * @param owner The address of the token owner
   * @return Array of UnlockCoin structures
   */
  function getUnlockCoins(address owner) public view returns (UnlockCoin[] memory) {
    return UnlockCoins[owner];
  }

  /**
   * @dev Sets a new lock time period
   * @param _locktime The new lock time in seconds
   */
  function setLocktime(uint256 _locktime) public onlyOwner {
    locktime = _locktime;
  }
}