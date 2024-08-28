const { ethers, getChainId} = require('hardhat')
const { utils, BigNumber} = require('ethers')
const { attachStakeTicket,attachNFTContract, readConfig, sleep} = require('./utils/helper')
const crypto = require("crypto");
const ECDSA = require('ecdsa-secp256r1')
const web3 = require("web3")
const {concat} = require("ethers/lib/utils");

const main = async () => {
    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let stakeSticketAddress = await readConfig("1", "STAKE_TICKET_ADDRESS")
    let stakeSticket = await attachStakeTicket(deployer, stakeSticketAddress)

    let nftAddress = await stakeSticket.getNFTContract();
    console.log("nftAddress", nftAddress);
    let tokenID = BigInt("103681193130065252982901595567548306120064382605014199407032809746496497403136")
    console.log("tokenID", tokenID, tokenID.toString(16));

    let tickInfo = await stakeSticket.getTickFromTokenId(tokenID);
    console.log("tickInfo", tickInfo);
}

const curveLength = Math.ceil(256 / 8) /* Byte length for validation */
ECDSA.generateKey = function generateKeys(privateKey, curve) {
    const ecdh = crypto.createECDH(curve)
    ecdh.setPrivateKey(privateKey, "hex")
    return new ECDSA({
        d: ecdh.getPrivateKey(),
        x: ecdh.getPublicKey().slice(1, curveLength + 1),
        y: ecdh.getPublicKey().slice(curveLength + 1)
    })
}

main();