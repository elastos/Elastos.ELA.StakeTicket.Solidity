const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { attachStakeTicket,attachNFTContract, readConfig, sleep} = require('./utils/helper')
const crypto = require("crypto");
const ECDSA = require('ecdsa-secp256r1')
const web3 = require("web3")

const main = async () => {

    let chainID = await getChainId();
    //let chainID = 0;
    let accounts = await ethers.getSigners()
    let deployer = accounts[0];
    console.log("chainID is :" + chainID + " address :" + deployer.address);

    let erc721Address = await readConfig("1","ERC721_ADDRESS");
    let nftContract = await attachNFTContract(deployer, erc721Address)

    let stakeSticketAddress = await readConfig("1", "STAKE_TICKET_ADDRESS")
    let stakeSticket = await attachStakeTicket(deployer, stakeSticketAddress)

    let tx = await nftContract.setMinterRole(stakeSticketAddress)
    console.log("setMinerRole tx.hash", tx.hash)
    await sleep(10000)

    let elaHash="0x78c1645758228af7255c596cdc276d95ce47b52533b0bf14bd0136cf61560f01"
    let ecdsa = ECDSA.generateKey("9812de27b49fff142b49da18396c09e99bb47abdf58c983335c51fdefd1c3c", "prime256v1")
    let data =  web3.utils.hexToBytes(elaHash)
    let signature = ecdsa.sign(Buffer.from(data), "hex");
    console.log("signature", signature, "length", signature.length)
    let publicKey = ecdsa.toCompressedPublicKey("hex");
    console.log("getPublicKey", publicKey);
    console.log("verify", ecdsa.verify(Buffer.from(data), signature, "hex"));

    console.log("xxl before claim start : ");
    tx = await stakeSticket.claim(
        elaHash, Buffer.from(signature, "hex"), Buffer.from(publicKey, "hex"),
        {
            gasPrice: 0x02540be400,
            gasLimit: 0x7a1200
        }
    );
    //tx = await stakeSticket.claim(elaHash, signature, publicKey);
    console.log("xxl before claim end : ");
    console.log("claim tx", tx.hash)
    await sleep(10000)

    let balance = await nftContract.balanceOf(deployer.address)
    console.log("balance of nft", balance)
    let tokenID = await nftContract.tokenByIndex(0)
    console.log("tokenID of nft", tokenID)
    let ownerOf = await nftContract.ownerOf(tokenID)
    console.log("ownerOf of nft", ownerOf)


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