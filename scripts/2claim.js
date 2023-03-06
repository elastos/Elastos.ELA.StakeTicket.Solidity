const { ethers, getChainId} = require('hardhat')
const { utils} = require('ethers')
const { attachStakeTicket,attachNFTContract, readConfig, sleep} = require('./utils/helper')
const crypto = require("crypto");
const ECDSA = require('ecdsa-secp256r1')
const web3 = require("web3")

const main = async () => {
    let userPrivates = ["096a6e5c49e624844a0d8088672e67f89a4f5fd8edab5b5c32de49606375d2ad","de016d3dc360e0cbce74c960029a6bc4adc8d0a318aa86678c9f33462a6cfa3b", "2ad85c7312aee8ec66c342aec6e1a3cbe9ebe27d3d3053dbfac314c456ec70ce","39205bb64c62dae517e5ee0678c7837236bdb4057464fb501e2c8215e0be0f7b"];
    // userPrivates = ["096a6e5c49e624844a0d8088672e67f89a4f5fd8edab5b5c32de49606375d2ad"];
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
    let data =  web3.utils.hexToBytes(elaHash)
    let signatures =[];
    let publickeys =[];
    for (let i = 0; i < userPrivates.length; i++) {
        let ecdsa = ECDSA.generateKey(userPrivates[i], "prime256v1")
        let signature = ecdsa.sign(Buffer.from(data), "hex");
        signatures.push(Buffer.from(signature, "hex"));

        let publicKey = ecdsa.toCompressedPublicKey("hex");
        publickeys.push(Buffer.from(publicKey, "hex"));

        console.log("publicKey", publicKey, publicKey.length);
        console.log("verify", ecdsa.verify(Buffer.from(data), signature, "hex"));
        console.log("signature", signature, signature.length)
    }


    console.log("xxl before claim start : ");
    // tx = await stakeSticket.claim(elaHash, Buffer.from([signature], "hex"), Buffer.from(publicKey, "hex"));
    tx = await stakeSticket.claim(elaHash, signatures, publickeys, 3);
    console.log("xxl before claim end : ");
    console.log("claim tx", tx.hash)
    await sleep(10000)

    let balance = await nftContract.balanceOf(deployer.address)
    console.log("balance of nft", balance)
    if (balance > 0) {
        for(var i = 0 ;i < balance ;i ++ ){
            let tokenID = await await nftContract.tokenOfOwnerByIndex(deployer.address,i);
            console.log("tokenID of nft", "hex format",i, BigInt(tokenID).toString(16), "uint256 format",BigInt(tokenID).toString())
            let ownerOf = await nftContract.ownerOf(tokenID)
            console.log("ownerOf of nft", ownerOf)

        }

    }

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