Web3 = require("web3");
web3 = new Web3("https://api-testnet.elastos.io/esc");

claimABI=[ {
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "elaHash",
            "type": "bytes32"
        },
        {
            "internalType": "address",
            "name": "to",
            "type": "address"
        },
        {
            "internalType": "bytes[]",
            "name": "signatures",
            "type": "bytes[]"
        },
        {
            "internalType": "bytes[]",
            "name": "publicKeys",
            "type": "bytes[]"
        },
        {
            "internalType": "uint256",
            "name": "multi_m",
            "type": "uint256"
        }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}]

let signatures =[];
let publickeys =[];
let signature= "02757c32c4a459c01306d4262b84a03d67987dcd7f9ff234a263a9986efa035f12f24d276785742aa01aa20f7b49560674acfc4983364aff0e29d762997dd6d2"
signatures.push(Buffer.from(signature, "hex"));

let publicKey = "0395bee2aa24e209dbb74b709a3fc16d2c728e2b0d1c475a2bf7f2c02b6fe96e57"
publickeys.push(Buffer.from(publicKey, "hex"));



acc = web3.eth.accounts.decrypt({"address":"53781e106a2e3378083bdcede1874e5c2a7225f8","crypto":{"cipher":"aes-128-ctr","ciphertext":"bc53c1fcd6e31a6392ddc1777157ae961e636c202ed60fb5dda77244c5c4b6ff","cipherparams":{"iv":"c5d1a7d86d0685aa4542d58c27ae7eb4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"409429444dabb5664ba1314c93f0e1d7a1e994a307e7b43d3f6cc95850fbfa9f"},"mac":"4c37821c90d35118182c2d4a51356186482662bb945f0fcd33d3836749fe59c0"},"id":"39e7770e-4bc6-42f3-aa6a-c0ae7756b607","version":3}, "123");
contract = new web3.eth.Contract(claimABI,"0x95c87f9c2381d43fc7019a2f7a2ea1dd8ca47230");
let cdata = contract.methods.claim("0xb0ec77618822e07218720e1dc8577c6d5943e4949858ece873d44449712db62e", "0x0aD689150EB4a3C541B7a37E6c69c1510BCB27A4", signatures, publickeys, 1).encodeABI();
tx = {data: cdata, to: contract.options.address, from: acc.address}

web3.eth.estimateGas(tx).then((gasLimit)=>{
    tx.gas=gasLimit;
    console.log("gasLimit", gasLimit);
});
