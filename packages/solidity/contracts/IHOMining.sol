// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

contract IHOMining is 
  VerifiableUpgradeable,
  BidirectionalTransfer,
  UUPSUpgradeable,
  OwnableUpgradeable,
  ERC721Upgradeable {
  
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  struct DeviceMapping {
    uint256 timestamp;
    int256 height;
    string device;
  }

  struct TokenMapping {
    address token;
    uint256 tokenId;
  }

  struct Reward {
    address token;
    uint256 amount;
  }

  uint256 private _tokenId;
  uint128 public totalSupply;
  mapping(string => TokenMapping) private DeviceMapToken;
  mapping(address => mapping(uint256 => DeviceMapping)) private TokenMapDevice;
  mapping(address => mapping(uint256 => uint256)) private TokenMapPool;
  mapping(string => bool) private ReceivedIDs;

  event Registered(
    address indexed token,
    uint256 indexed tokenId,
    address indexed sender,
    string device,
    int256 blockHeight,
    uint256 timestamp
  );
  event Received(
    address indexed token,
    uint256 indexed tokenId,
    string uid,
    string device,
    address to,
    uint256 amount,
    string memo,
    int256 blockHeight,
    uint256 timestamp
  );
  event Claimed(
    address indexed token,
    uint256 indexed tokenId,
    string device,
    address to,
    uint256 amount,
    int256 blockHeight,
    uint256 timestamp
  );

  error DeviceEmpty();
  error DeviceRegistered();
  error DeviceUnregistered();
  error ReceiveInvalid();

  function initialize(address _owner, address _verifier) public initializer {
    __ERC721_init("IHOMining", "IHOM");
    __Verifie_init(_verifier);
    __Ownable_init(_owner);
    __UUPSUpgradeable_init();
  }

  function mint(address signer) private returns (uint256) {
    uint256 tokenId = _tokenId;
    _safeMint(signer, tokenId);
    totalSupply += 1;
    _tokenId += 1;
    return tokenId;
  }

  function register(string memory device) public {
    if (bytes(device).length == 0)
      revert DeviceEmpty();
    if (DeviceMapToken[device].token != address(0))
      revert DeviceRegistered();

    uint256 tokenId = mint(msg.sender);

    TokenMapDevice[address(this)][tokenId] = DeviceMapping(block.timestamp, int(block.number), device);
    DeviceMapToken[device] = TokenMapping(address(this), tokenId);

    emit Registered(
      address(this),
      tokenId,
      msg.sender,
      device,
      int(block.number),
      block.timestamp
    );
  }

  function rewardReceive(
    string memory id,
    string memory device,
    uint256 amount,
    bytes memory signature,
    string memory memo
  ) public {
    TokenMapping memory tm = DeviceMapToken[device];

    if (bytes(device).length == 0)
      revert DeviceEmpty();
    if (tm.token == address(0))
      revert DeviceUnregistered();

    address owner = IERC721(tm.token).ownerOf(tm.tokenId);

    if (owner != msg.sender)
      revert ERC721IncorrectOwner(msg.sender, tm.tokenId, owner);
    if (ReceivedIDs[id])
      revert ReceiveInvalid();
    verify(abi.encodePacked(id, msg.sender, device, amount), signature);
    
    ReceivedIDs[id] = true;

    TokenMapPool[tm.token][tm.tokenId] += amount;

    emit Received(
      tm.token,
      tm.tokenId, 
      id,
      device,
      msg.sender, 
      amount,
      memo,
      int(block.number),
      block.timestamp
    );
  }

  function rewardClaim(string memory device, uint256 amount, bytes memory signature) public {
    TokenMapping memory tm = DeviceMapToken[device];

    if (bytes(device).length == 0)
      revert DeviceEmpty();
    if (tm.token == address(0))
      revert DeviceUnregistered();
    address owner = IERC721(tm.token).ownerOf(tm.tokenId);
    if (owner != msg.sender)
      revert ERC721IncorrectOwner(msg.sender, tm.tokenId, owner);

    verify(abi.encodePacked(msg.sender, device, amount), signature);
    transfer(address(this), msg.sender, address(0), amount);

    TokenMapPool[tm.token][tm.tokenId] -= amount;

    emit Claimed(
      tm.token,
      tm.tokenId, 
      device,
      msg.sender, 
      amount,
      int(block.number),
      block.timestamp
    );
  }

  function getTokenInDevice(string memory device) public view returns (TokenMapping memory) {
    return DeviceMapToken[device];
  }

  function getDeviceInToken(address token, uint256 tokenId) public view returns (DeviceMapping memory) {
    return TokenMapDevice[token][tokenId];
  }

  function getPoolInToken(address token, uint256 tokenId) public view returns (uint256) {
    return TokenMapPool[token][tokenId];
  }

  function getPoolInDevice(string memory device) public view returns (uint256) {
    TokenMapping memory tm = DeviceMapToken[device];
    return TokenMapPool[tm.token][tm.tokenId];
  }
}