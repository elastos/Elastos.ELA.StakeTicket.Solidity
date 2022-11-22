require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
require("@nomiclabs/hardhat-etherscan");

require('@openzeppelin/hardhat-upgrades');

const dotenv = require("dotenv");
dotenv.config({path: __dirname + '/.env'});
const { private_key, internal_url } = process.env;

module.exports = {
  
  networks: {

    reg: {
      url: `http://${internal_url}:20636`,
      accounts: [
        `${private_key}`
      ],
      gasLimit: 0x7a1200,
      gas: 0x02540be400
    },

    test: {
      url: `https://api-testnet.elastos.io/eth`,
      accounts: [
        "0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5"
      ],
      gasLimit: 0x7a1200,
      gas: 0x02540be400
    },

    local: {
      url: `http://127.0.0.1:6111`,
      accounts: [
        "0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5"
      ]
    },

    my: {
      url: `http://127.0.0.1:11001`,
      accounts: [
        "0xc03b0a988e2e18794f2f0e881d7ffcd340d583f63c1be078426ae09ddbdec9f5",
        "0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",
        "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0",
      ]
    },

    hardhat:{
      chainId:100,
      accounts: [
        {privateKey:"0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0",balance:"10000000000000000000000"},
        {privateKey:"0xf143b04240e065984bc0507eb1583234643d64c948e1e0ae2ed4abf7d7aed06a",balance:"10000000000000000000000"},
        {privateKey:"0x49b9dd4e00cb10e691abaa1de4047f9c9d98b72b9ce43e1e12959b22f56a0289",balance:"10000000000000000000000"},
      ],
      blockGasLimit: 8000000
    }



  },
  solidity: '0.7.6',
}
