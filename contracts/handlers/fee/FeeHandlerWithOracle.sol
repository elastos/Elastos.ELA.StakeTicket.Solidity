// The Licensed Work is (c) 2022 Sygma
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";

import "../../interfaces/IFeeHandler.sol";
import "../../interfaces/IERCHandler.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../utils/AccessControl.sol";

/**
    @title Handles deposit fees based on Effective rates provided by Fee oracle.
    @author ChainSafe Systems.
    @notice This contract is intended to be used with the Bridge contract.
 */
contract FeeHandlerWithOracle is IFeeHandler, AccessControl {
    address public immutable _bridgeAddress;
    address public immutable _feeHandlerRouterAddress;

    address public _oracleAddress;

    uint32 public _gasUsed;
    uint16 public _feePercent; // multiplied by 100 to avoid precision loss

    struct OracleMessageType {
        // Base Effective Rate - effective rate between base currencies of source and dest networks (eg. MATIC/ETH)
        uint256 ber;
        // Token Effective Rate - rate between base currency of destination network and token that is being trasferred (eg. MATIC/USDT)
        uint256 ter;
        uint256 dstGasPrice;
        uint256 expiresAt;
        uint8 fromDomainID;
        uint8 toDomainID;
        bytes32 resourceID;
    }

    struct FeeDataType {
        bytes message;
        bytes sig;
        uint256 amount;
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "sender doesn't have admin role");
        _;
    }

    modifier onlyBridgeOrRouter() {
        _onlyBridgeOrRouter();
        _;
    }

    function _onlyBridgeOrRouter() private view {
        require(
            msg.sender == _bridgeAddress || msg.sender == _feeHandlerRouterAddress,
            "sender must be bridge or fee router contract"
        );
    }

    /**
        @param bridgeAddress Contract address of previously deployed Bridge.
        @param feeHandlerRouterAddress Contract address of previously deployed FeeHandlerRouter.
     */
    constructor(address bridgeAddress, address feeHandlerRouterAddress) public {
        _bridgeAddress = bridgeAddress;
        _feeHandlerRouterAddress = feeHandlerRouterAddress;

    }

    // Admin functions

    /**
        @notice Removes admin role from {_msgSender()} and grants it to {newAdmin}.
        @notice Only callable by an address that currently has the admin role.
        @param newAdmin Address that admin role will be granted to.
     */
    function renounceAdmin(address newAdmin) external {
        address sender = _msgSender();
        require(sender != newAdmin, 'Cannot renounce oneself');
        grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        renounceRole(DEFAULT_ADMIN_ROLE, sender);
    }

    /**
        @notice Sets the fee oracle address for signature verification.
        @param oracleAddress Fee oracle address.
     */
    function setFeeOracle(address oracleAddress) external onlyAdmin {
        _oracleAddress = oracleAddress;
    }

    /**
        @notice Sets the fee properties.
        @param gasUsed Gas used for transfer.
        @param feePercent Added to fee amount. total fee = fee_from_oracle.amount * feePercent / 1e4
     */
    function setFeeProperties(uint32 gasUsed, uint16 feePercent) external onlyAdmin {
        _gasUsed = gasUsed;
        _feePercent = feePercent;
    }


    function verifySig(bytes32 message, bytes memory signature, address signerAddress) internal view {
        address signerAddressRecovered = ECDSA.recover(message, signature);
        require(signerAddressRecovered == signerAddress, 'Invalid signature');
    }
}
