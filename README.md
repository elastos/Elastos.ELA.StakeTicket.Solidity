## Dependencies
Either make sure you're running a version of node compliant with the `engines` requirement in `package.json`, or install Node Version Manager [`nvm`](https://github.com/creationix/nvm) and run `nvm use` to use the correct version of node.

Requires `nodejs` ,`yarn` and `npm`.

```shell
# node -v 
v16.0.0
# yarn version
yarn version v1.22.17 
# npm -v
8.5.3
```

## Quick Start
1.issue standard erc20

2.yarn add @nomiclabs/buidler
yarn add @nomiclabs/hardhat-etherscan

npx hardhat verify --network mainnet 0x727d56b61ff08975a62d72d71c919385c8776d95 "SexCoin" "SexCoin" 99999999999000000000000000000


3.hash
uint256 dataLen = _didData.length + 32;
uint256[1] memory p;

assembly {
    if iszero(staticcall(gas(), 22, _didData , dataLen , p, 0x20)) {
        revert(0,0)
    }
}

