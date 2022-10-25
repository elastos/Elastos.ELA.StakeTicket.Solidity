// The Licensed Work is (c) 2022 Sygma
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "../interfaces/IFeeHandler.sol";
import "../utils/AccessControl.sol";

/**
    @title Handles FeeHandler routing for resources.
    @author ChainSafe Systems.
    @notice This contract is intended to be used with the Bridge contract.
 */
contract FeeHandlerRouter is IFeeHandler, AccessControl {
    address public immutable _bridgeAddress;

    // destination domainID => resourceID => feeHandlerAddress
    mapping (uint8 => mapping(bytes32 => IFeeHandler)) public _domainResourceIDToFeeHandlerAddress;

    event FeeChanged(
        uint256 newFee
    );

    modifier onlyBridge() {
        _onlyBridge();
        _;
    }

    function _onlyBridge() private view {
        require(msg.sender == _bridgeAddress, "sender must be bridge contract");
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyAdmin() private view {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "sender doesn't have admin role");
    }

    /**
        @param bridgeAddress Contract address of previously deployed Bridge.
     */
    constructor(address bridgeAddress) public {
        _bridgeAddress = bridgeAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    /**
        @notice Maps the {handlerAddress} to {resourceID} to {destinantionDomainID} in {_domainResourceIDToFeeHandlerAddress}.
        @param destinationDomainID ID of chain FeeHandler contracts will be called.
        @param resourceID ResourceID for which the corresponding FeeHandler will collect/calcualte fee.
        @param handlerAddress Address of FeeHandler which will be called for specified resourceID.
     */
    function adminSetResourceHandler(uint8 destinationDomainID, bytes32 resourceID, IFeeHandler handlerAddress) external onlyAdmin {
        _domainResourceIDToFeeHandlerAddress[destinationDomainID][resourceID] = handlerAddress;
    }

}
