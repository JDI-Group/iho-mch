// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract VerifiableUpgradeable is Initializable {
  address internal verifier;

  error InvalidSignature();

  function recover(bytes32 message, bytes memory signature) internal pure returns (address) {
    require(signature.length == 65, "invalid signature length");
    bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
    bytes32 r;
    bytes32 s;
    uint8 v;
    assembly {
      r := mload(add(signature, 0x20))
      s := mload(add(signature, 0x40))
      v := byte(0, mload(add(signature, 0x60)))
    }
    
    return ecrecover(digest, v, r, s);
  }

  function verify(bytes memory message, bytes memory signature) internal view virtual {
    if (recover(keccak256(message), signature) != verifier) {
      revert InvalidSignature();
    }
  }

  function getVerifier() public view returns (address) {
    return verifier;
  }

  function setVerifier(address newVerifier) public virtual {
    require(msg.sender == verifier, "Not Verifier Account");
    verifier = newVerifier;
  }

  function __Verifie_init(address initialVerifier) internal onlyInitializing {
    verifier = initialVerifier;
  }
}