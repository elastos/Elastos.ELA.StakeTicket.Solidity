// The Licensed Work is (c) 2022 Sygma
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "../../interfaces/IFeeHandler.sol";
import "../../utils/AccessControl.sol";

/**
    @title Handles deposit fees.
    @author ChainSafe Systems.
    @notice This contract is intended to be used with the Bridge contract.
 */
contract BasicFeeHandler is IFeeHandler, AccessControl {
    address public immutable _bridgeAddress;
    address public immutable _feeHandlerRouterAddress;

    uint256 public _fee;

    event FeeChanged(
        uint256 newFee
    );

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
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

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
        @notice Sets new value of the fee.
        @notice Only callable by admin.
        @param newFee Value {_fee} will be updated to.
     */
    function changeFee(uint256 newFee) external onlyAdmin {
        require(_fee != newFee, "Current fee is equal to new fee");
        _fee = newFee;
        emit FeeChanged(newFee);
    }

    /**
        @notice Transfers eth in the contract to the specified addresses. The parameters addrs and amounts are mapped 1-1.
        This means that the address at index 0 for addrs will receive the amount (in WEI) from amounts at index 0.
        @param addrs Array of addresses to transfer {amounts} to.
        @param amounts Array of amonuts to transfer to {addrs}.
     */
    function transferFee(address payable[] calldata addrs, uint[] calldata amounts) external onlyAdmin {
        require(addrs.length == amounts.length, "addrs[], amounts[]: diff length");
        for (uint256 i = 0; i < addrs.length; i++) {
            (bool success,) = addrs[i].call{value: amounts[i]}("");
            require(success, "Fee ether transfer failed");
            emit FeeDistributed(address(0), addrs[i], amounts[i]);
        }
    }


}
