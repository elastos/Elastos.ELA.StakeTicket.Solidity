const {
    NAME721,SYMBOL721,BASEURI,
    readConfig, sleep, attachStakeTicket
} = require('./utils/helper')
const { ethers: hEether,upgrades } = require('hardhat');


const main = async () => {
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let owner = accounts[0];

    let nftAddress = await readConfig("0", "ERC721_BPOSV1_ADDRESS")
    const nftContractFactory = await ethers.getContractFactory('ERC721UpradeableMinterBurnerPauser',owner);
    const instanceV1 = await nftContractFactory.attach(nftAddress);


    const nftContractFactory2 = await ethers.getContractFactory("ERC721UpradeableMinterBurnerPauser", owner);
    console.log('nftContract start upgrade ! ')
    await upgrades.upgradeProxy(
        nftAddress,
        nftContractFactory2,
        {args: [ NAME721,
                SYMBOL721,
                BASEURI]},
        {call:"__ERC721UpradeableMinterBurnerPauser_initialize"},
    );
    await sleep(15000);
    console.log('nftContract upgraded ! ');

    const instanceV2 = await nftContractFactory2.attach(nftAddress);
    version = await instanceV2.version();
    console.log("instanceV2", instanceV2.address, "version", version);

}

main();
