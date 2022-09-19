const Web3 = require('web3')
const web3 = new Web3('ws://192.168.0.103:7111')
const { hex2a } = require('./helper')

// a list for saving subscribed event instances
const subscribedEvents = {}
// Subscriber method
const subscribeLogEvent = (contract, eventName) => {

  //console.log("xxl web3 123 ---- ",web3.utils._);
  const eventJsonInterface = web3.utils._.find(
    contract._jsonInterface,
    o => o.name === eventName && o.type === 'event',
  )

  const subscription = web3.eth.subscribe('logs', {
    address: contract.options.address,
    topics: [eventJsonInterface.signature]
  }, (error, result) => {

    console.log("block number is  ",result.blockNumber);

    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        result.data,
        result.topics.slice(1)
      )


      console.log("decodeLog is :", eventObj);
      // console.log("data bytes:", eventObj.data)
      // console.log("data hash :", web3.utils.sha3(eventObj.data));
      // console.log("data json :", hex2a(eventObj.data));
      console.log("--------------------------------\n");

    }

  })
  subscribedEvents[eventName] = subscription
}

const {
  readConfig,
} = require('./helper')

const main = async () => {

  console.log("**************** watch elink data ****************");

  let callbackAddress = await readConfig("6","CALLBACK_ADDRESS");
  const callbackTest = require('../artifacts/contracts/mock/CallbackTest.sol/CallbackTest.json');

  let callbackInstance = new web3.eth.Contract(callbackTest.abi,callbackAddress)
  // subscribeLogEvent(callbackInstance,"KeyRquestId");
  subscribeLogEvent(callbackInstance,"CallbackResult");

}

main();
