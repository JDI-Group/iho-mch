// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./utils/BidirectionalTransfer.sol";

/**
 * @dev Structure mapping a device to its token information
 * @param token The token contract address
 * @param tokenId The token ID
 */
struct Token {
  address tokenContract;
  uint256 tokenId;
}

/**
 * @dev Structure representing a reward with token address and amount
 * @param token The token contract address
 * @param amount The amount of the token
 */
struct Reward {
  string id;
  address account;
  BidirectionalTransfer.Coin[] rewards;
  string memo;
}

/**
 * @dev Structure representing a coin with token address and amount
 * @param token The token contract address
 * @param amount The amount of the token
 */
struct Device {
  uint128 product;
  string name;
  string mac;
}