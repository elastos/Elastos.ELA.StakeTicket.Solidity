require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
require("@nomiclabs/hardhat-etherscan");

require('@openzeppelin/hardhat-upgrades');

const dotenv = require("dotenv");
dotenv.config({path: __dirname + '/.env'});
const { private_key, internal_url,local_key,testnet_key } = process.env;

module.exports = {

  networks: {
    mainnet: {
      url: `https://api.elastos.io/esc`,
      accounts: [
        `${private_key}`
      ],
    },

    regtest: {
      url: `http://${internal_url}:20636`,
      accounts: [
        `${private_key}`
      ],
    },

    testnet: {
      url: `https://api-testnet.elastos.io/esc`,
      accounts: [
        `${testnet_key}`
      ],
    },

    pgp: {
      url: `https://api.elastos.io/pgp`,
      accounts: [
        `${private_key}`
      ],
    },

    local: {
      url: `http://127.0.0.1:6111`,
      accounts: [
         `${local_key}`
      ]
    },
    eco_mainnet: {
      url: `https://api.elastos.io/esc`,
      accounts: [
        `${private_key}`
      ],
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
  etherscan: {
    apiKey: {
      "pgp_testnet": "empty"
    },
    customChains: [
      {
        network: "pgp",
        chainId: 860621,
        urls: {
          apiURL: "https://pgp.elastos.io:443/api",
          browserURL: "https://pgp.elastos.io:443"
        }
      },
      {
        network: "eco_mainnet",
        chainId: 12343,
        urls: {
          apiURL: "https://api.elastos.io/esc",
          browserURL: "https://api.elastos.io/esc"
        }
      }
    ]
  },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
}
