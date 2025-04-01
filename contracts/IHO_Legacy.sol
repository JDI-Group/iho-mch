// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./utils/VerifiableUpgradeable.sol";
import "./utils/BidirectionalTransfer.sol";

contract IHO_Legacy is VerifiableUpgradeable, BidirectionalTransfer, UUPSUpgradeable, OwnableUpgradeable {
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() { _disableInitializers(); }
  function _authorizeUpgrade(address) internal override onlyOwner {}

  function initialize(address owner_, address verifier_) public initializer {
    __Ownable_init(owner_);
    __Verifie_init(verifier_);
    __UUPSUpgradeable_init();
  }

  struct Price {
    address token;
    uint256 amount;
  }

  event Confirmed(
    address indexed from,
    uint256 indexed pid,
    uint256 indexed oid,
    Price[] prices,
    uint256 expire,
    string memo
  );

  function create(
    uint256 pid,
    uint256 oid,
    Price[] memory prices,
    uint256 expire,
    string memory memo,
    bytes memory signature
  ) external payable {
    bytes32 pricesHash = keccak256(abi.encode(prices));
    verify(abi.encodePacked(pid, oid, pricesHash, expire, memo), signature);
    for (uint256 i = 0; i < prices.length; i++) {
      if (prices[i].amount > 0)
        transfer(
          msg.sender,
          address(this),
          prices[i].token, 
          prices[i].amount
        );
    }
    emit Confirmed(msg.sender, pid, oid, prices, expire, memo);
  }

  function withdraw(address token , uint256 amount) public onlyOwner {
    transfer(address(this), msg.sender, token, amount);
  }
}
