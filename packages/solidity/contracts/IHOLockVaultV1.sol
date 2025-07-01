// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

/**
 * @title IHOMarket
 * @dev Contract for managing project funding through staking mechanisms
 *
 * This contract implements a system where projects can be created with funding targets.
 * Users can stake tokens to support projects, and when a project reaches its target,
 * it becomes confirmed. Stakes have expiration times, after which they can be claimed
 * back if desired.
 */

/// @notice Error thrown when project already exists
error ProjectAlreadyExists(uint256 pid);
/// @notice Error thrown when project does not exist
error ProjectNotFound(uint256 pid);
/// @notice Error thrown when project is already confirmed
error ProjectAlreadyConfirmed(uint256 pid);
/// @notice Error thrown when stake already exists
error StakeAlreadyExists(uint256 pid, uint256 oid);
/// @notice Error thrown when stake has not expired
error StakeNotExpired(uint256 pid, uint256 oid);
/// @notice Error thrown when stake has already been claimed
error StakeAlreadyClaimed(uint256 pid, uint256 oid);
/// @notice Error thrown when stake has finished
error StakeFinished();
/// @notice Error thrown when target amount is invalid
error InvalidTargetAmount();


contract IHOLockVaultV1 is VerifiableUpgradeable, BidirectionalTransfer, UUPSUpgradeable, OwnableUpgradeable {
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  
  /**
   * @dev Authorizes an upgrade to a new implementation
   * @param newImplementation The address of the new implementation
   */
  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  /// @notice Mapping from project ID to project information
  mapping(uint256 => Project) public projects;
  
  /// @notice Mapping from project ID and order ID to stake information
  mapping(uint256 => mapping(uint256 => Stake)) public stakes;

  /// @notice all projects completed
  bool public finished;

  /**
   * @dev Initializes the contract
   * @param verifier_ The address of the verifier for signatures
   */
  function initialize(address verifier_) public initializer {
    __Ownable_init(msg.sender);
    __Verifie_init(verifier_);
    __UUPSUpgradeable_init();
  }

  /**
   * @dev Structure representing a project with funding target
   * @param target The target number of stakes needed for confirmation
   * @param quantity The current number of stakes
   * @param confirmed Whether the project has reached its target
   */
  struct Project {
    uint256 target;
    uint256 quantity;
    bool confirmed;
  }

  /**
   * @dev Structure representing a stake in a project
   * @param coins Array of tokens and amounts staked
   * @param expire Timestamp when the stake expires
   * @param timestamp Timestamp when the stake was created
   * @param claimed Whether the stake has been claimed back
   */
  struct Stake {
    Coin[] coins;
    uint expire;
    uint timestamp;
    bool claimed;
  }

  /**
   * @notice Emitted when a stake is confirmed
   * @param from The address that created the stake
   * @param pid The project ID
   * @param oid The order ID within the project
   * @param stake The stake information
   * @param blockHeight The block height at confirmation
   * @param timestamp The timestamp of confirmation
   */
  event StakeConfirmed(
    address indexed from,
    uint256 indexed pid,
    uint256 indexed oid,
    Stake stake,
    int256 blockHeight,
    uint256 timestamp
  );

  /**
   * @notice Emitted when a project is created
   * @param pid The project ID
   * @param target The target number of stakes
   * @param quantity The initial number of stakes
   * @param blockHeight The block height at creation
   * @param timestamp The timestamp of creation
   */
  event ProjectCreated(
    uint256 indexed pid,
    uint256 target,
    uint256 quantity,
    int256 blockHeight,
    uint256 timestamp
  );

    /**
   * @notice Emitted when a project is confirmed
   * @param pid The project ID
   * @param blockHeight The block height at confirmation
   * @param timestamp The timestamp of confirmation
   */
  event ProjectConfirm(
    uint256 indexed pid,
    int256 blockHeight,
    uint256 timestamp
  );


  /**
   * @dev Creates a new project
   * @param pid The project ID
   * @param target The target number of stakes needed for confirmation
   * @param quantity The initial number of stakes
   *
   * Only the contract owner can create projects
   */
  function release(uint256 pid, uint256 target, uint256 quantity) external onlyOwner {
    if (projects[pid].target != 0)
      revert ProjectAlreadyExists(pid);
    if (target == 0)
      revert InvalidTargetAmount();

    projects[pid].target = target;
    projects[pid].quantity = quantity;
    projects[pid].confirmed = false;
    emit ProjectCreated(pid, target, quantity, int(block.number), block.timestamp);
  }

  /**
   * @dev Stakes tokens in a project
   * @param pid The project ID
   * @param oid The order ID within the project
   * @param coins Array of tokens and amounts to stake
   * @param expire Duration in seconds until the stake expires
   * @param memo Additional information about the stake
   * @param signature Verification signature from authorized verifier
   *
   * Verifies the signature, transfers tokens from sender to contract,
   * and updates project status if target is reached
   */
  function stake(
    uint256 pid,
    uint256 oid,
    Coin[] memory coins,
    uint256 expire,
    string memory memo,
    bytes memory signature
  ) external payable {
    if (finished) revert StakeFinished();

    bytes32 coinsHash = keccak256(abi.encode(coins));
    bytes32 stakeHash = keccak256(
      abi.encodePacked(pid, oid, coinsHash, expire, memo)
    );
    verify(stakeHash, signature);

    if (projects[pid].target == 0)
      revert ProjectNotFound(pid);
    if (projects[pid].confirmed)
      revert ProjectAlreadyConfirmed(pid);
    if (stakes[pid][oid].timestamp != 0)
      revert StakeAlreadyExists(pid, oid);

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
      emit ProjectConfirm(pid, int(block.number), block.timestamp);
    }

    transfers(msg.sender, address(this), coins);
  }

  /**
   * @dev Claims back a stake after it has expired
   * @param pid The project ID
   * @param oid The order ID within the project
   *
   * Transfers the staked tokens back to the caller
   */
  function claim(uint256 pid, uint256 oid) external {
    if (stakes[pid][oid].expire >= block.timestamp)
      revert StakeNotExpired(pid, oid);
    if (stakes[pid][oid].claimed)
      revert StakeAlreadyClaimed(pid, oid);

    stakes[pid][oid].claimed = true;

    transfers(address(this), msg.sender, stakes[pid][oid].coins);
  }

  /**
   * @dev Gets the stake information for a specific project and order
   * @param pid The project ID
   * @param oid The order ID within the project
   * @return The stake information
   */
  function getStake(uint256 pid, uint256 oid) external view returns (Stake memory) {
    return stakes[pid][oid];
  }

  /**
   * @dev Gets the project information
   * @param pid The project ID
   * @return The project information
   */
  function getProject(uint256 pid) external view returns (Project memory) {
    return projects[pid];
  }

  function setProject(uint256 pid, uint256 target, uint256 quantity) external onlyOwner {
    projects[pid].target = target;
    projects[pid].quantity = quantity;
    projects[pid].confirmed = false;
  }

  function confirm(uint256 pid) external onlyOwner {
    if (!projects[pid].confirmed) {
      projects[pid].confirmed = true;
      emit ProjectConfirm(pid, int(block.number), block.timestamp);
    }
  }

  function withdraw(address token, uint256 amount) external onlyOwner {
    transfer(address(this), msg.sender, token, amount);
  }

  function finish() external onlyOwner {
    finished = true;
  }
}
