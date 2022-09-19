// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";

import "../interfaces/CallbackInterface.sol";

contract Caller {

   function callTest(address callbackContract,bytes memory data) external returns (bool) {
      
      //bytes memory data = "0x1234";
      bool success  = false;

      (success,) = address(CallbackInterface(callbackContract)).call(
         abi.encodeWithSignature("callbackResult2(bytes)",data)
      );

      console.log("call result is ",success);
      require(success,"callback Interface failed");

      return true;

   }

}