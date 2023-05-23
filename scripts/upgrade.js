const {
    readConfig, sleep, attachStakeTicket
} = require('./utils/helper')

const { ethers: hEether,upgrades } = require('hardhat');


const main = async () => {
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let owner = accounts[0];

    let stakeSticketAddress = await readConfig("1", "STAKE_TICKET_ADDRESS")

    const stakestick = await ethers.getContractFactory('StakeTicket',owner);
    const instanceV1 = await stakestick.attach(stakeSticketAddress);

    let version = await instanceV1.version();
    console.log("instanceV1", instanceV1.address, "version", version);

    let erc721Address = await readConfig("0","ERC721_ADDRESS");
    let erc721V2Address = await readConfig("0","ERC721_BPOSV1_ADDRESS");

    const stakestick2 = await ethers.getContractFactory("StakeTicket", owner);
    console.log('stakeTicket start upgrade ! ')
    await upgrades.upgradeProxy(
        stakeSticketAddress,
        stakestick2,
        {args: [erc721Address, erc721V2Address]},
        {call:"__StakeTicket_init"},
    );
    await sleep(15000);
    console.log('stakeTicket upgraded ! ');

    const instanceV2 = await stakestick2.attach(stakeSticketAddress);
    version = await instanceV2.version();
    let tx = await instanceV2.setERC721UpgradeAddress(erc721V2Address)
    console.log("instanceV2", instanceV2.address, "version", version, "tx.hash", tx.hash);

}

main();
