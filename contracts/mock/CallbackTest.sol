// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";
import "../interfaces/CallbackInterface.sol";
import "../DataConsumer.sol";

contract CallbackTest is CallbackInterface{

   uint256 constant public ARBITER_NUM = 12;
   mapping( string => bytes32[ARBITER_NUM]) private didRequestsMap;
   
   event KeyRquestId(
      string key,
      bytes32[ARBITER_NUM] requestId
   );

   event CallbackResult(
      bytes32 requestId,
      bytes data
   );

   // string
   bytes public data;
   function callbackResult(bytes32 _requestId,bytes memory _data) override external{
      
      // data = _data;
      emit CallbackResult(_requestId,_data); 
   }

   function quiryByDid(string memory did,address dataConsumerAddress) public{

      // bytes32[ARBITER_NUM] memory requestIdList;
      // DataConsumer dataConsumerContract = DataConsumer(dataConsumerAddress);
      // requestIdList = dataConsumerContract.requestResultFromList(did);
      // didRequestsMap[did] = requestIdList;
      // emit KeyRquestId(did,requestIdList);

   }


}
