// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";

contract StorageTest {

   // string
    bytes public data;

    function setData(bytes memory _data) public {
       data = _data;
    }

}
