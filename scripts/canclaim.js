Web3 = require("web3");
// web3 = new Web3("https://api-testnet.elastos.io/esc");
web3 = new Web3("http://127.0.0.1:6111");

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
}],"0x1F91EeE17687e4ea5282E3C6Ad256bc001730De2");
// 读取val值
contract.methods.canClaim("0x78c1645758228af7255c596cdc276d95ce47b52533b0bf14bd0136cf61560f01").call((err, val) => {
    console.log({ err, val })
})

