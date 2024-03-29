// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

// This is adapted from https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/presets/ERC721PresetMinterPauserAutoId.sol
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721PausableUpgradeable.sol";
import "./Arbiter.sol";

import "hardhat/console.sol";

contract ERC721UpradeableMinterBurnerPauser is ContextUpgradeable, AccessControlUpgradeable,ERC721BurnableUpgradeable, ERC721PausableUpgradeable,Arbiter{

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    struct StakeTickNFT{
        bytes32 referKey;
        string stakeAddress;
        bytes32 genesisBlockHash;
        uint32 startHeight;
        uint32 endHeight;
        int64 votes;
        int64 voteRights;
        bytes targetOwnerKey;
    }
    mapping(uint256 => StakeTickNFT) internal _stakeTickNFTInfo;
    string constant public version = "v0.1.0";

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE`to the account that
     * deploys the contract.
     *
     * Token URIs will be autogenerated based on `baseURI` and their token IDs.
     * See {ERC721-tokenURI}.
     */
    function __ERC721UpradeableMinterBurnerPauser_initialize(string memory name, string memory symbol, string memory baseURI) initializer public {
        __ERC721_init(name, symbol);
        _setBaseURI(baseURI);
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
     }

    function setMinterRole(address mintAddress) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ERC721MinterBurnerPauser: must have admin role to mint");
        uint num = getRoleMemberCount(MINTER_ROLE);
        if (num > 0) {
            address oldAddress = getRoleMember(MINTER_ROLE, num - 1);
            revokeRole(MINTER_ROLE, oldAddress);
        }
        _setupRole(MINTER_ROLE, mintAddress);
    }

    function changeAdminRole(address newAdmin) public {
        require(newAdmin != address(0), "InvalidNewAdmin");
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ERC721MinterBurnerPauser: must have admin role to changeAdminRole");
        revokeRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(DEFAULT_ADMIN_ROLE, newAdmin);
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    /**
     * @dev Creates a new token for `to`. Its token ID will be automatically
     * assigned (and available on the emitted {Transfer} event), and the token
     * URI autogenerated based on the base URI passed at construction.
     *
     * See {ERC721-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(
        address to, 
        uint256 tokenId, 
        string memory data,
        bytes32 elaHash
    ) public {
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721UpradeableMinterBurnerPauser: must have minter role to mint");

        _mint(to, tokenId);
        _setTokenURI(tokenId, data);


        bytes32 referKey;
        string memory stakeAddress;
        bytes32 genesisBlockHash;
        uint32 startHeight;
        uint32 endHeight;
        int64 votes;
        int64 voteRights;
        bytes memory targetOwnerKey;

        (referKey,stakeAddress,genesisBlockHash,startHeight,endHeight,votes,voteRights,targetOwnerKey) = getBPosNFTInfo(elaHash);
        
        _stakeTickNFTInfo[tokenId].referKey = referKey;
        _stakeTickNFTInfo[tokenId].stakeAddress = stakeAddress;
        _stakeTickNFTInfo[tokenId].genesisBlockHash = genesisBlockHash;
        _stakeTickNFTInfo[tokenId].startHeight = startHeight;
        _stakeTickNFTInfo[tokenId].endHeight = endHeight;
        _stakeTickNFTInfo[tokenId].votes = votes;
        _stakeTickNFTInfo[tokenId].voteRights = voteRights;
        _stakeTickNFTInfo[tokenId].targetOwnerKey = targetOwnerKey;
    }

    function getInfo(uint256 tokenId) public view returns(StakeTickNFT memory) {
        require(tokenId > 0,"tokenId invalid");
        return _stakeTickNFTInfo[tokenId];
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC721Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ERC721MinterBurnerPauser: must have pauser role to pause");
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC721Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ERC721MinterBurnerPauser: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Upgradeable,ERC721PausableUpgradeable) {
            
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721Upgradeable) {

        super._burn(tokenId);
        delete _stakeTickNFTInfo[tokenId];
    
    }

}
