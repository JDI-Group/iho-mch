// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

contract IHOFuel is 
  BidirectionalTransfer,
  UUPSUpgradeable,
  OwnableUpgradeable {

  struct LockedCoin {
    address token;
    uint256 amount;
  }

  struct UnlockCoin {
    uint256 index;
    address token;
    uint256 amount;
    uint256 timestamp;
  }

  mapping(address => mapping(address => LockedCoin)) private LockedCoins;
  mapping(address => UnlockCoin[]) private UnlockCoins;
  
  event Deposited(address indexed sender, address indexed token, uint256 amount);
  event Cancelled(address indexed sender, uint256 index, address indexed token, uint256 amount, uint256 unlocktime);
  event Claimed(address indexed sender, uint256 index, address indexed token, uint256 amount);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}
  uint256 locktime;

  function initialize(address _owner) public initializer {
    __Ownable_init(_owner);
    __UUPSUpgradeable_init();
    locktime = 30 * 86400;
  }

  function deposit(address token, uint256 amount) public payable {
    require(amount > 0, "Amount must be greater than 0");
    LockedCoins[msg.sender][token].amount += amount;
    transfer(msg.sender, address(this), token, amount);
    emit Deposited(msg.sender, token, amount);
  }

  function cancel(address token, uint256 amount) public {
    uint index = UnlockCoins[msg.sender].length;
    uint unlocktime = block.timestamp + locktime;
    UnlockCoin memory coin = UnlockCoin(index, token, amount, unlocktime);
    UnlockCoins[msg.sender].push(coin);
    LockedCoins[msg.sender][token].amount -= amount;
    emit Cancelled(msg.sender, index, token, amount, unlocktime);
  }

  function claim(uint256 index) public {
    UnlockCoin memory coin = UnlockCoins[msg.sender][index];
    require(block.timestamp >= coin.timestamp, "Locktime not expired");
    require(coin.amount > 0, "No amount to claim");
    transfer(address(this), msg.sender, coin.token, coin.amount);

    delete UnlockCoins[msg.sender][index];
    emit Claimed(msg.sender, index, coin.token, coin.amount);
  }

  function balanceOf(address owner, address token) public view returns (uint256) {
    return LockedCoins[owner][token].amount;
  }

  function getUnlockCoins(address owner) public view returns (UnlockCoin[] memory) {
    return UnlockCoins[owner];
  }

  function setLocktime(uint256 _locktime) public onlyOwner {
    locktime = _locktime;
  }

  function getLocktime() public view returns (uint256) {
    return locktime;
  }
}