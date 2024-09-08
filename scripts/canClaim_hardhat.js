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

    let tokenID = BigInt("103681193130065252982901595567548306120064382605014199407032809746496497403136")
    console.log("tokenID", tokenID, tokenID.toString(16));
    let hex_tokenID = "0x" + tokenID.toString(16);
    console.log("hex_tokenID1", hex_tokenID);
    hex_tokenID = "0x00e53979c8afbd73b2700fc6a62b3fe9bbbadecfd7d675ff48ae63abc1edb845"
    console.log("hex_tokenID2", hex_tokenID);
    let ela_hash = "0x0f2d08c901f0c0d41a4125a96c71f535ad2f039260a7ccc7f97f0c5e4d915556"
    tokenID = await stakeSticket.canClaim(ela_hash);
    console.log("tokenID", tokenID);

    let tokenNumber = BigInt(tokenID);
    console.log("tokenNumber", tokenNumber.toString(16));
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