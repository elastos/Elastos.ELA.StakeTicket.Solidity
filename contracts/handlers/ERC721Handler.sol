// The Licensed Work is (c) 2022 Sygma
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;

import "./HandlerHelpers.sol";
import "../ERC721Safe.sol";
import "@openzeppelin/contracts/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol";


/**
    @title Handles ERC721 deposits and deposit executions.
    @author ChainSafe Systems.
    @notice This contract is intended to be used with the Bridge contract.
 */
contract ERC721Handler is HandlerHelpers, ERC721Safe {
    using ERC165Checker for address;

    bytes4 private constant _INTERFACE_ERC721_METADATA = 0x5b5e139f;

    /**
        @param bridgeAddress Contract address of previously deployed Bridge.
     */
    constructor(
        address bridgeAddress
    ) HandlerHelpers(bridgeAddress) {
    }


    /**
        @notice Used to manually release ERC721 tokens from ERC721Safe.
        @param data Consists of {tokenAddress}, {recipient}, and {tokenID} all padded to 32 bytes.
        @notice Data passed into the function should be constructed as follows:
        tokenAddress                           address     bytes  0 - 32
        recipient                              address     bytes  32 - 64
        tokenID                                uint        bytes  64 - 96
     */
    function withdraw(bytes memory data) external override onlyBridge {
        address tokenAddress;
        address recipient;
        uint tokenID;

        (tokenAddress, recipient, tokenID) = abi.decode(data, (address, address, uint));

        releaseERC721(tokenAddress, address(this), recipient, tokenID);
    }
}
