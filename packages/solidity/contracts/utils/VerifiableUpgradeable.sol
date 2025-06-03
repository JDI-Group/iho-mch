// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
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
   * @dev Verifies a message signature
   * @param hash The hash of the message to verify
   * @param signature The signature data
   *
   * Note: This function checks if the signature corresponds to the expected verifier address.
   * If the recovered address does not match the verifier, it reverts with InvalidSignature error.
   */
  function verify(bytes32 hash, bytes memory signature) internal view virtual {
    bytes32 keccak256SignedMessage = MessageHashUtils.toEthSignedMessageHash(hash);
    address recoveredAddress = ECDSA.recover(keccak256SignedMessage, signature);
    if (verifier != recoveredAddress) {
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