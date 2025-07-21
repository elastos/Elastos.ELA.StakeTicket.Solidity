Web3 = require("web3");
web3 = new Web3("https://api-testnet.elastos.io/esc");

getNFTInfoABI=[{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
        }
    ],
    "name": "getInfo",
    "outputs": [
        {
            "components": [
                {
                    "internalType": "bytes32",
                    "name": "referKey",
                    "type": "bytes32"
                },
                {
                    "internalType": "string",
                    "name": "stakeAddress",
                    "type": "string"
                },
                {
                    "internalType": "bytes32",
                    "name": "genesisBlockHash",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint32",
                    "name": "startHeight",
                    "type": "uint32"
                },
                {
                    "internalType": "uint32",
                    "name": "endHeight",
                    "type": "uint32"
                },
                {
                    "internalType": "int64",
                    "name": "votes",
                    "type": "int64"
                },
                {
                    "internalType": "int64",
                    "name": "voteRights",
                    "type": "int64"
                },
                {
                    "internalType": "bytes",
                    "name": "targetOwnerKey",
                    "type": "bytes"
                }
            ],
            "internalType": "struct ERC721UpradeableMinterBurnerPauser.StakeTickNFT",
            "name": "",
            "type": "tuple"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}]


acc = web3.eth.accounts.decrypt(keystore, password);
contract = new web3.eth.Contract(getNFTInfoABI,"0xcfaBC7302a9294444741a9705E57c660aa7FC651");
// let cdata = contract.methods.getInfo("eb601c9f624a0a27c05cad4638382d1266bb30103e4a51a4ee788f620462f37").encodeABI();
// tx = {data: cdata, to: contract.options.address, from: acc.address}

contract.methods.getInfo("0x0eb601c9f624a0a27c05cad4638382d1266bb30103e4a51a4ee788f620462f37").call((err, val) => {
    console.log({ err, val })
})

// web3.eth.estimateGas(tx).then((gasLimit)=>{
//     tx.gas=gasLimit;
//     console.log("gasLimit", gasLimit);
// });
