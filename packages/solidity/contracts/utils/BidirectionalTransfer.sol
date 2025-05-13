// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BidirectionalTransfer {
  error TransferFailed();
  error TransferUnauthorized();
  error TransferInsufficient();

  struct Coin {
    address token;
    uint256 amount;
  }

  receive() external payable {}

  function erc20Transfer(address from, address to, address token, uint256 amount) internal {
    bytes memory data;
    if (from == address(this)) {
      bytes4 method = bytes4(keccak256("transfer(address,uint256)"));
      data = abi.encodeWithSelector(method, to, amount);
    } else {
      bytes4 method = bytes4(keccak256("transferFrom(address,address,uint256)"));
      data = abi.encodeWithSelector(method, from, to, amount);
    }
    (bool sent,) = token.call(data);
    if (!sent)
     revert TransferFailed();
  }
  
  function etherTransfer(address from, address to, uint256 amount) internal {
    if (from == address(this)) {
      (bool sent, ) = to.call{ value: amount }("");
      if (!sent)
        revert TransferFailed();
    } else {
      if (from != msg.sender)
        revert TransferUnauthorized();
      if (msg.value != amount)
        revert TransferFailed();
    }
  }

  function transfer(address from, address to, address token, uint256 amount) internal {
    if (token != address(0))
      erc20Transfer(from, to, token, amount);
    else
      etherTransfer(from, to, amount);
  }

  function transfers(address from, address to, Coin[] memory coins) internal {
    for (uint256 i = 0; i < coins.length; i++) {
      Coin memory coin = coins[i];
      transfer(from, to, coin.token, coin.amount);
    }
  }
}