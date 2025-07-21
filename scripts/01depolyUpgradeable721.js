
const { ethers, getChainId, network} = require('hardhat')
const { utils} = require('ethers')
const {NAME721,SYMBOL721,BASEURI, writeConfig,readConfig,deployERC721Upgradeable, attachStakeTicket } = require('./utils/helper')

const main = async () => {


    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is: " + chainID + " address: " + deployer.address);

    let upgradeAble721 = await deployERC721Upgradeable(NAME721,SYMBOL721,BASEURI,deployer)

    // await writeConfig("0","0","ERC721_BPOSV1_ADDRESS",upgradeAble721.address);
    await writeConfig(network.name, network.name, "ERC721_BPOSV1_ADDRESS",upgradeAble721.address);
    console.log("erc721 upgrade address : ",upgradeAble721.address);
    console.log("nftName", await upgradeAble721.name(), "\nsymbol", await upgradeAble721.symbol());

    let stakeSticketAddress = await readConfig(network.name, "STAKE_TICKET_ADDRESS")
    if (stakeSticketAddress != null && stakeSticketAddress != "") {
        let stakeSticket = await attachStakeTicket(deployer, stakeSticketAddress)

        let tx = await upgradeAble721.setMinterRole(stakeSticket.address);
        console.log("setMinerRole2 tx.hash", tx.hash)
    }
}



main();
