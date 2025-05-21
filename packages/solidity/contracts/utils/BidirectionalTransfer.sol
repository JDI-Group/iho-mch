// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BidirectionalTransfer
 * @dev Contract that facilitates transfers of ETH and ERC20 tokens between addresses
 * Provides utility functions for handling both native ETH and ERC20 token transfers
 * with appropriate error handling for debugging purposes
 */
contract BidirectionalTransfer {
  // Custom errors for better debugging and gas efficiency
  error TransferFailed(address token, address from, address to, uint256 amount);
  error TransferUnauthorized(address sender, address from);
  error TransferInsufficient(uint256 provided, uint256 required);
  error InvalidTokenAddress(address token);
  error ZeroAddressNotAllowed(string parameter);

  /**
   * @dev Structure representing a token and amount pair
   * @param token The token address (address(0) for ETH)
   * @param amount The amount to transfer
   */
  struct Coin {
    address token;
    uint256 amount;
  }

  /**
   * @dev Fallback function to receive ETH
   */
  receive() external payable {}

  /**
   * @dev Transfers ERC20 tokens between addresses
   * @param from Source address
   * @param to Destination address
   * @param token ERC20 token address
   * @param amount Amount to transfer
   *
   * Uses low-level call to handle various ERC20 implementations
   * Propagates revert reasons from the token contract
   */
  function erc20Transfer(address from, address to, address token, uint256 amount) internal {
    if (token == address(0))
      revert InvalidTokenAddress(token);
    
    bytes memory data;
    if (from == address(this)) {
      // Transfer from this contract (requires approval)
      bytes4 method = bytes4(keccak256("transfer(address,uint256)"));
      data = abi.encodeWithSelector(method, to, amount);
    } else {
      // Transfer from another address (requires approval)
      bytes4 method = bytes4(keccak256("transferFrom(address,address,uint256)"));
      data = abi.encodeWithSelector(method, from, to, amount);
    }
    
    (bool sent, bytes memory result) = token.call(data);
    if (!sent) {
      revert TransferFailed(token, from, to, amount);
    }
    
    // Check return data to handle tokens that don't revert but return false
    if (result.length > 0) {
      // solhint-disable-next-line no-inline-assembly
      assembly {
        // Load the first word from result (boolean success value)
        let success := mload(add(result, 32))
        if iszero(success) {
          // Revert with the original error message if available
          revert(add(result, 32), mload(result))
        }
      }
    }
  }
  
  /**
   * @dev Transfers ETH between addresses
   * @param from Source address
   * @param to Destination address
   * @param amount Amount to transfer in wei
   *
   * Handles both transfers from this contract and from msg.sender
   */
  function etherTransfer(address from, address to, uint256 amount) internal {

    // Skip zero amount transfers
    if (amount == 0) 
      return;
    
    if (from == address(this)) {
      // Transfer ETH from this contract
      (bool sent, ) = to.call{ value: amount }("");
      if (!sent)
        revert TransferFailed(address(0), from, to, amount);
    } else {
      // Transfer ETH from sender
      if (from != msg.sender)
        revert TransferUnauthorized(msg.sender, from);
      if (msg.value < amount)
        revert TransferInsufficient(msg.value, amount);
      
      // Forward ETH to destination
      (bool sent, ) = to.call{ value: amount }("");
      if (!sent)
        revert TransferFailed(address(0), from, to, amount);
    }
  }

  /**
   * @dev Generic transfer function that handles both ETH and ERC20 transfers
   * @param from Source address
   * @param to Destination address
   * @param token Token address (address(0) for ETH)
   * @param amount Amount to transfer
   */
  function transfer(address from, address to, address token, uint256 amount) internal {
    if (token != address(0))
      erc20Transfer(from, to, token, amount);
    else
      etherTransfer(from, to, amount);
  }

  /**
   * @dev Batch transfer multiple coins (ETH or ERC20) between addresses
   * @param from Source address
   * @param to Destination address
   * @param coins Array of Coin structs to transfer
   */
  function transfers(address from, address to, Coin[] memory coins) internal {    
    for (uint256 i = 0; i < coins.length; i++) {
      Coin memory coin = coins[i];
      transfer(from, to, coin.token, coin.amount);
    }
  }
}