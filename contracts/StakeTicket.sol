// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./ERC721MinterBurnerPauser.sol";
import "./ERC721UpradeableMinterBurnerPauser.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Arbiter.sol";

import "hardhat/console.sol";

/**
    @title Facilitates deposits and creation of deposit executions.
    @author Elastos Gelaxy team.
 */
contract StakeTicket is Initializable,Arbiter,OwnableUpgradeable{
    struct TickInfo{
        bytes32[] txList;
    }

    address private _erc721Address;
    string constant public version = "v0.2.0";
    mapping(uint256 => TickInfo) internal _idTickInfoMap;
    address private _erc721UpgradeableAddress;

    event StakeTicketMint(
        address to,
        uint256 tokenId,
        bytes32 txHash,
        uint256 version
    );


    event StakeTicketBurn(
        uint256 tokenId,
        string elaAddress
    );

    /**
     * @dev __StakeTicket_init
       @param erc721Address erc721 token address
     */
    function __StakeTicket_init(
        address erc721Address
    ) public initializer {
        __Ownable_init();
        _erc721Address = erc721Address;
    }

    function setERC721UpgradeAddress(address nftAddress) public onlyOwner {
        require(Address.isContract(nftAddress), "must contract address");
        _erc721UpgradeableAddress = nftAddress;
    }

    function isNotClaimed(bytes32 elaHash, uint256 tokenID) private view returns(bool) {
        bytes32[] memory txList = _idTickInfoMap[tokenID].txList;
        for (uint i = 0; i < txList.length; i++) {
            if (txList[i] == elaHash) {
                return false;
            }
        }
        return true;
    }

    function claim(bytes32 elaHash, address to, bytes[] memory signatures, bytes[] memory publicKeys, uint256 multi_m) external {

        require(!Address.isContract(to), "claim_onlyEOA");

        // TODO test the result
        uint isVerified = pledgeBillVerify(elaHash, to, signatures, publicKeys, multi_m);
        require(isVerified == 1,"pledgeBill Verify do not pass !");

        // TODO get the  precompile contract value
        uint256 tokenId = canClaim(elaHash);
        require(tokenId != uint256(0), "can'tClaim");
        _idTickInfoMap[tokenId].txList.push(elaHash);

        //dummy data
        uint nftType = getBPosNFTPayloadVersion(elaHash);
        if(nftType == 0){
            ERC721MinterBurnerPauser(_erc721Address).mint(to,tokenId,"0x0");
        }else{
            ERC721UpradeableMinterBurnerPauser(_erc721UpgradeableAddress).mint(to,tokenId,"0x0",elaHash);
        }

        emit StakeTicketMint(
            to,
            tokenId,
            elaHash,
            nftType
        );

    }

    /**
        @notice mint the stake tick
        @param tokenId nft id of the ERC721
     */
    function getTickFromTokenId(uint256 tokenId) public view returns(TickInfo memory){

        require(tokenId > 0,"token id must larger than 0");
        return _idTickInfoMap[tokenId];

    }

    /**
        @notice burn the stake tick
        @param tokenId nft id of the ERC721
     */
    function burnTick(uint256 tokenId,string memory saddress) public {

        require(tokenId > 0,"stake amount must larger than 0");
        bool exist = ERC721UpradeableMinterBurnerPauser(_erc721UpgradeableAddress).exists(tokenId);
        if (exist) {
            ERC721UpradeableMinterBurnerPauser(_erc721UpgradeableAddress).burn(tokenId);
        } else {
            ERC721MinterBurnerPauser(_erc721Address).burn(tokenId);
        }

        emit StakeTicketBurn(
            tokenId,
            saddress
        );
    }

    function getNFTContract() public view returns (address){
        return _erc721Address;
    }

    function getNFTUpgradeableContract() public view returns (address){
        return _erc721UpgradeableAddress;
    }

    function canClaim(bytes32 elaHash) public view returns(uint256 tokenID) {
        tokenID = getTokenIDByTxhash(elaHash);
        if (tokenID == uint256(0)) {
            return tokenID;
        }
        if (isNotClaimed(elaHash, tokenID) == false) {
            return uint256(0);
        }
        return tokenID;
    }
}
