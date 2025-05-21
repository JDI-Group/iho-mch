// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IIHOFuel
 * @dev Interface for the IHOFuel contract
 *
 * This interface defines the deposit function used by other contracts
 * to interact with the IHOFuel contract for token deposits.
 */
interface IIHOFuel {
  /**
   * @dev Deposits tokens into the fuel contract
   * @param owner The address that will own the deposited tokens
   * @param token The token address (address(0) for ETH)
   * @param amount The amount to deposit
   */
  function deposit(address owner, address token, uint256 amount) external payable;
}