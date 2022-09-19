
const { ethers, getChainId} = require('hardhat')
const { readConfig,isTxSuccess} = require('./helper')

const main = async () => {

    console.log("7 request Ethereum Post ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumerAddress = await readConfig("1","DATACONSUMER_ADDRESS");
    let dataConsumer = await DataConsumer__Contract.connect(deployer).attach(dataConsumerAddress);
    
    // function requestResultFromList(string memory did,string memory method)
    // did_resolveDID
    // let resultObj = await dataConsumer.requestResultFromList(
    //     "iW8oCQShdduv7TZGovKQM76gaqdQiKhkgB",
    //     "did_resolveDID",
    //     {
    //         gasPrice: 0x02540be400,
    //         gasLimit: 0x7a1200
    //     }
    // );

    // did_listCredentials
    // let resultObj = await dataConsumer.requestResultFromList(
    //     "iULReN45NDUrzL1fGx3dHr62zNwMuFsAux",
    //     "did_listCredentials",
    //     {
    //         gasPrice: 0x02540be400,
    //         gasLimit: 0x7a1200
    //     }
    // );

    // did_resolveCredential
    let resultObj = await dataConsumer.requestResultFromList(
        "iULReN45NDUrzL1fGx3dHr62zNwMuFsAux",
        "did_resolveCredential",
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    let isOK = await isTxSuccess(resultObj)
    console.log("call consume result : ",isOK);

    

}



main();
