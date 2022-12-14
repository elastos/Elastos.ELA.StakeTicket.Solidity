// The Licensed Work is (c) 2022 Sygma
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;

/**
    @title Interface for Bridge contract.
    @author ChainSafe Systems.
 */
interface IStakeTicket {
    /**
        @notice Exposing getter for {_domainID} instead of forcing the use of call.
        @return uint8 The {_domainID} that is currently set for the Bridge contract.
     */
    function _domainID() external returns (uint8);

    /**
        @notice Exposing getter for {_resourceIDToHandlerAddress}.
        @param resourceID ResourceID to be used when making deposits.
        @return address The {handlerAddress} that is currently set for the resourceID.
     */
    function _resourceIDToHandlerAddress(bytes32 resourceID) external view returns (address);
}