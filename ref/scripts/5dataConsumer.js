
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { readConfig,writeConfig,isTxSuccess } = require('./helper')

const main = async () => {

    console.log("5 deploy data consumer ....");

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const DataConsumer__Contract = await ethers.getContractFactory('DataConsumer',deployer)
    let dataConsumer = await DataConsumer__Contract.connect(deployer).deploy(
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );

    console.log("dataConsumer address : " + dataConsumer.address);
    await writeConfig("3","5","DATACONSUMER_ADDRESS",dataConsumer.address);

    let linkAddress = await readConfig("3","LINK_ADDRESS");
    const Link__Contract = await ethers.getContractFactory('ERC677',deployer)
    let link = await Link__Contract.connect(deployer).attach(linkAddress);
    
    let amount = utils.parseEther("10");
    let resultObj = await link.transfer(dataConsumer.address,amount);
    let isOK = await isTxSuccess(resultObj)
    console.log("transfer : ",isOK);

}



main();
