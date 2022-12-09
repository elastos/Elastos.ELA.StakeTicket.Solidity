
const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { attachStakeTicket,readConfig, sleep} = require('./utils/helper')
const crypto = require("crypto");
const ECDSA = require('ecdsa-secp256r1')
const web3 = require("web3")

const main = async () => {
    let chainID = await getChainId();
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " deployer address :" + deployer.address);

    let stakeTicketAddress = await readConfig("1","STAKE_TICKET_ADDRESS");
    console.log("stake ticket address : ",stakeTicketAddress);

    let contract = await attachStakeTicket(deployer, stakeTicketAddress);
    console.log("stakeTicket.address", contract.address);

    let elahash="0x78c1645758228af7255c596cdc276d95ce47b52533b0bf14bd0136cf61560f01"
    let privateKey="9812de27b49fff142b49da18396c09e99bb47abdf58c983335c51fdefd1c3c"
    // let privateKey="c03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5"
    // 0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5
    // let ecdh= crypto.createECDH("prime256v1")
    // ecdh.setPrivateKey(privateKey, "hex")
    // console.log("pbk==", ecdh.getPublicKey("hex", "compressed"));

    let ecdsa = ECDSA.generateKey(privateKey, "prime256v1")
    let data =  web3.utils.hexToBytes(elahash)
    let signature = ecdsa.sign(Buffer.from(data), "hex");
    console.log("signature", signature, "length", signature.length)
    let publicKey = ecdsa.toCompressedPublicKey("hex");
    console.log("getPublicKey", publicKey);
    console.log("verify", ecdsa.verify(Buffer.from(data), signature, "hex"));

    console.log("xxl 0001");
    let tx = await contract.claim(elahash, Buffer.from(signature, "hex"), Buffer.from(publicKey, "hex"));
    console.log("xxl 0002");

    await sleep(10000);
    console.log("claim tx", tx.hash);
   
}
const curveLength = Math.ceil(256 / 8) /* Byte length for validation */
ECDSA.generateKey = function generateKeys(privateKey, curve) {
    console.log("11111111 ", privateKey, "curve", curve)
    const ecdh = crypto.createECDH(curve)
    ecdh.setPrivateKey(privateKey, "hex")
    return new ECDSA({
        d: ecdh.getPrivateKey(),
        x: ecdh.getPublicKey().slice(1, curveLength + 1),
        y: ecdh.getPublicKey().slice(curveLength + 1)
    })
}



main();
