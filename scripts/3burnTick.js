const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { attachStakeTicket,attachNFTContract, readConfig, sleep} = require('./utils/helper')
const crypto = require("crypto");
const ECDSA = require('ecdsa-secp256r1')
const web3 = require("web3")
const {publicKey} = require("eth-crypto");
var RIPEMD160 = require('ripemd160')
const {binary_to_base58} = require("base58-js")
const {hexString} = require("hardhat/internal/core/config/config-validation");

const main = async () => {

    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);
    //
    let erc721Address = await readConfig("1","ERC721_ADDRESS");
    let nftContract = await attachNFTContract(deployer, erc721Address)
    console.log("nftContract", nftContract.address);
    let stakeSticketAddress = await readConfig("1", "STAKE_TICKET_ADDRESS")
    let stakeSticket = await attachStakeTicket(deployer, stakeSticketAddress)
    console.log("stakeSticket", stakeSticket.address);
    let ecdsa = ECDSA.generateKey("9aede013637152836b14b423dabef30c9b880ea550dbec132183ace7ca6177ed", "prime256v1")
    let publicKey = ecdsa.toCompressedPublicKey("hex");
    let saddress = createSaddress(publicKey)
    console.log("saddress", saddress)

    let tokenID = BigInt("24321663383758171497331128045553867915983080013115371228720067867067809947027")
    let tx = await nftContract.approve(stakeSticket.address, tokenID);
    await sleep(10000)
    console.log("approve tx.hash = ", tx.hash);

    tx = await stakeSticket.burnTick(tokenID, saddress);
    console.log("burnTick tx", tx.hash)
    await sleep(10000)

    let balance = await nftContract.balanceOf(deployer.address)
    console.log("balance of nft", balance)
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

function createSaddress(pubKey)  {
    let buffer = Buffer.alloc(35);
    let pbkBuffer = Buffer.from(pubKey, "hex");

    buffer.writeUInt8(pbkBuffer.length,0)
    buffer.write(pbkBuffer.toString("hex"), 1, "hex")
    buffer.writeUInt8(172,34)

    let sha256 =  crypto.createHash("sha256")
    sha256.update(buffer)
    let digestHash = sha256.digest()

    let hash160 = new RIPEMD160().update(digestHash).digest('hex')

    let uint168 = Buffer.alloc(21);
    uint168.writeUInt8(63,0)
    uint168.write(hash160.toString("hex"), 1, "hex")

    let sha2562 =  crypto.createHash("sha256")
    sha2562.update(uint168)
    let checkSum1 = sha2562.digest()
    let sha2563 =  crypto.createHash("sha256")
    sha2563.update(checkSum1)
    let checkSum = sha2563.digest()

    let data =Buffer.alloc(25);
    data.write(uint168.toString("hex"),0, "hex")
    data.write(checkSum.slice(0, 4).toString("hex"), 21, "hex")

    let address =  binary_to_base58(data)
    return address


}

main();