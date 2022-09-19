
const { ethers, getChainId} = require('hardhat')
const { sleep,readConfig,isTxSuccess} = require('./helper')

const Web3 = require('web3')
const web3 = new Web3('http://127.0.0.1:6111')

const main = async () => {

    console.log("7 request Ethereum Post ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("5","DATACONSUMER_ADDRESS");
    let dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);    
    let pressNum = 200;

    // ms
    let timeForWait = 1000;
    await sleep(timeForWait);

    let nonce = await web3.eth.getTransactionCount(deployer.address);
    console.log("xxl nonce is :",nonce);

    for(var i = 0 ;i < pressNum ;i ++){
        
        
        console.time("test" + i);
        dataConsumer.requestResultFromList(
            "iW8oCQShdduv7TZGovKQM76gaqdQiKhkgB",
            {
                nonce:nonce ++ 
            }
        );

        // dataConsumer.requestResultFromList(
        //     "iV6keniHfidTPxbkpBRqE5pTkQfkW9aXQM",
        //     {   
        //         nonce:nonce ++ 
        //     }
        // );

        console.timeEnd("test" + i);
        
    }


   
}



main();
