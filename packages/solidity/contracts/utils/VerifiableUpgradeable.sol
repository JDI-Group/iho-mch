// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title VerifiableUpgradeable
 * @dev Base upgradeable contract that provides signature verification functionality
 *
 * This contract allows verification of messages signed by a designated verifier.
 * Primarily used for off-chain signature verification, such as validating authorization in claim operations.
 */
abstract contract VerifiableUpgradeable is Initializable {
  /// @notice The verifier address responsible for signing messages
  address public verifier;

  /// @notice Error thrown when signature verification fails
  /// @param recover The address recovered from the signature
  /// @param verifier The expected verifier address
  error InvalidSignature(address recover, address verifier);

  /**
   * @dev Recovers the signer's address from a signature
   * @param message The hashed message
   * @param signature The signature data (65 bytes)
   * @return The signer's address
   */
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

  /**
   * @dev Verifies a message signature
   * @param message The original message (not hashed)
   * @param signature The signature data
   *
   * Note: This function hashes the message with keccak256 before verifying the signature.
   * When signing on the client side, the same message should be hashed before signing.
   */
  function verify(bytes memory message, bytes memory signature) internal view virtual {
    address recoveredAddress = recover(keccak256(message), signature);
    if (recoveredAddress != verifier) {
      revert InvalidSignature(recoveredAddress, verifier);
    }
  }

  /**
   * @dev Transfers verifier authority
   * @param newVerifier The new verifier address
   *
   * Only the current verifier can call this function
   */
  function transferVerifier(address newVerifier) public virtual {
    require(msg.sender == verifier, "Not Verifier Account");
    verifier = newVerifier;
  }

  /**
   * @dev Initialization function
   * @param initialVerifier The initial verifier address
   */
  function __Verifie_init(address initialVerifier) internal onlyInitializing {
    verifier = initialVerifier;
  }
}