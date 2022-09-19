const { ethers, getChainId} = require('hardhat');

const {
    sleep,
    readConfig
} = require('./helper')

const main = async () => {

    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    const arbiter = await ethers.getContractFactory('Arbiter',deployer)

    let arbiterAddress = await readConfig("2","ARBITER_ADDRESS");
    console.log("arbiterAddress :",arbiterAddress);

    const arbiterContract = await arbiter.connect(deployer).attach(arbiterAddress)

    let result = await arbiterContract.setArbiterList( {
        gasPrice: 0x02540be400,
        gasLimit: 0x7a1200
    });

    let tx = await result.wait();
    console.log(tx);

    await sleep(5000);

    let arbiters = await arbiterContract.getArbiterList();
    console.log("arbiterList ",arbiters);
    
    // let arbiter0 = await arbiterContract.getArbiter0();
    // console.log("arbiter0 ",arbiter0);
}



main();
