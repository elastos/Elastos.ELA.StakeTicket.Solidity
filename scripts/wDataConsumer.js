const Web3 = require('web3')
require('dotenv').config({path:'../.env'});

// const web3 = new Web3(`ws://${process.env.internal_url}:${process.env.esc_ws_port}`)
const web3 = new Web3("wss://api-testnet.elastos.io/esc-ws");
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
    
    // console.log("xxl 1",error,result);
    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        result.data,
        result.topics.slice(1)
      )

      // console.log("xxl 2",eventObj);
      if(eventObj.hasOwnProperty("key")){
        console.log("--------------search condition--------------"); 
        console.log("block number :  ",result.blockNumber); 
        console.log("data requestId :", eventObj.requestId)
        console.log("data searchKey :", eventObj.key)
      }else if(eventObj.hasOwnProperty("data")){
        console.log("\n**************search result**************"); 
        //console.log("data bytes:", eventObj.data)
        //console.log("data hash :", web3.utils.sha3(eventObj.data));
        console.log("block number :  ",result.blockNumber); 
        console.log("data requestId :", eventObj.requestId)
        console.log("data result :", hex2a(eventObj.data));
      }else{
        console.log("unused event");
      }

    }

  })

  subscribedEvents[eventName] = subscription
}

const {
  readConfig,
} = require('./helper')

const main = async () => {

  console.log("**************** watch elink data ****************");

  let dataConsumerAddress = await readConfig("1","DATACONSUMER_ADDRESS");
  const dataConsumer = require('../artifacts/contracts/DataConsumer.sol/DataConsumer.json');

  let dataConsumerInstance = new web3.eth.Contract(dataConsumer.abi,dataConsumerAddress)
  subscribeLogEvent(dataConsumerInstance,"SearchInfo");
  subscribeLogEvent(dataConsumerInstance,"SearchConformed");
  

  

}

main();
