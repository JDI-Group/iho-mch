// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

contract IHOMarket is VerifiableUpgradeable, BidirectionalTransfer, UUPSUpgradeable, OwnableUpgradeable {
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  mapping(uint256 => Project) public projects;
  mapping(uint256 => mapping(uint256 => Stake)) public stakes;

  function initialize(address owner_, address verifier_) public initializer {
    __Ownable_init(owner_);
    __Verifie_init(verifier_);
    __UUPSUpgradeable_init();
  }

  struct Project {
    uint256 target;
    uint256 quantity;
    bool confirmed;
  }

  struct Stake {
    Coin[] coins;
    uint expire;
    uint timestamp;
    bool claimed;
  }

  event StakeConfirmed(
    address indexed from,
    uint256 indexed pid,
    uint256 indexed oid,
    Stake stake,
    int256 blockHeight,
    uint256 timestamp
  );

  event ProjectCreated(
    uint256 indexed pid,
    uint256 target,
    uint256 quantity,
    int256 blockHeight,
    uint256 timestamp
  );

  event ProjectConfirmed(
    uint256 indexed pid,
    int256 blockHeight,
    uint256 timestamp
  );

  function release(uint256 pid, uint256 target, uint256 quantity) external onlyOwner {
    require(projects[pid].target == 0, "Project already exists");
    require(target > 0, "Target must be greater than 0");

    projects[pid].target = target;
    projects[pid].quantity = quantity;
    projects[pid].confirmed = false;
    emit ProjectCreated(pid, target, quantity, int(block.number), block.timestamp);
  }

  function stake(
    uint256 pid,
    uint256 oid,
    Coin[] memory coins,
    uint256 expire,
    string memory memo,
    bytes memory signature
  ) external payable {
    bytes32 coinsHash = keccak256(abi.encode(coins));
    verify(abi.encodePacked(pid, oid, coinsHash, expire, memo), signature);

    require(projects[pid].target != 0, "Project not found");
    require(!projects[pid].confirmed, "Project already confirmed");
    require(stakes[pid][oid].timestamp == 0, "Stake already exists");

    uint256 expireTime = block.timestamp + expire;


    projects[pid].quantity += 1;


    for (uint256 i = 0; i < coins.length; i++) {
      stakes[pid][oid].coins.push(coins[i]);
    }
    stakes[pid][oid].expire = expireTime;
    stakes[pid][oid].timestamp = block.timestamp;
    stakes[pid][oid].claimed = false;

    emit StakeConfirmed(msg.sender, pid, oid, stakes[pid][oid], int(block.number), block.timestamp);

    if (!projects[pid].confirmed && projects[pid].quantity >= projects[pid].target) {
      projects[pid].confirmed = true;
      emit ProjectConfirmed(pid, int(block.number), block.timestamp);
    }

    transfers(msg.sender, address(this), coins);
  }

  function getStake(uint256 pid, uint256 oid) external view returns (Stake memory) {
    return stakes[pid][oid];
  }

  function getProject(uint256 pid) external view returns (Project memory) {
    return projects[pid];
  }

  function claim(uint256 pid, uint256 oid) external {
    require(stakes[pid][oid].expire < block.timestamp, "Stake not expired");
    require(!stakes[pid][oid].claimed, "Stake already claimed");

    stakes[pid][oid].claimed = true;

    transfers(address(this), msg.sender, stakes[pid][oid].coins);
  }

  function withdraw(address token , uint256 amount) external onlyOwner {
    transfer(address(this), msg.sender, token, amount);
  }
}
