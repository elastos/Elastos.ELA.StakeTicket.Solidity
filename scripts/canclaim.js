Web3 = require("web3");
// web3 = new Web3("https://api-testnet.elastos.io/esc");
// web3 = new Web3("http://127.0.0.1:6111");
web3 = new Web3("https://api.elastos.io/esc");

contract = new web3.eth.Contract([{
    "inputs": [
        {
            "internalType": "bytes32",
            "name": "elaHash",
            "type": "bytes32"
        }
    ],
    "name": "canClaim",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}],"0xEb034B34CB567fA8958a98151e5F9531555E3F05");
// 读取val值
let tokenID = BigInt("103681193130065252982901595567548306120064382605014199407032809746496497403136")
let hex_tokenID = "0x00e53979c8afbd73b2700fc6a62b3fe9bbbadecfd7d675ff48ae63abc1edb845"
let ela_hash = "0x0f2d08c901f0c0d41a4125a96c71f535ad2f039260a7ccc7f97f0c5e4d915556";
contract.methods.canClaim(ela_hash).call((err, val) => {
    console.log({ err, val })
})

