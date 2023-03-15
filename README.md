# Elastos.ELA.StakeTicket.Solidity: Decentralized pledge contract based on Elastos main chain and ESC side chain

[![All Contributors](https://img.shields.io/badge/all__contributors-2-red)](#contributors)
[![golang](https://img.shields.io/badge/solidity-0.7.6-orange)](#solidity)
[![c++](https://img.shields.io/badge/License-MIT-success)](#License)

## Overview

Elastos.ELA.StakeTicket.Solidity is a ticket pledge system based on Elastos main chain and ESC side chain, which includes functions such as claim, mint and burn


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

Take the test environment as an example, including the deployment of contracts, the implementation of Burn and Claim functions

1. Install the package
 ```shell
yarn install
```
2. deploy the contract NFT contract
```shell
yarn scripts scripts/0deployErc721.js --network test
```

3. deploy the contract Ticket contract
```shell
yarn scripts scripts/1deployStakeTicket.js --network test
```

4. run claim function 
```shell
yarn scripts scripts/2claim.js --network test
```

5. run burn function 
```shell
yarn scripts scripts/3burnTick.js --network test
```

## License

And of course:
MIT: https://rem.mit-license.org


## Contribution
Thank you for considering to help out with the source code! We welcome contributions from anyone on the internet, and are grateful for even the smallest of fixes!

If you'd like to contribute to Elastos.ELA.StakeTicket.Solidity , please fork, fix, commit and send a pull request for the maintainers to review and merge into the main code base. 