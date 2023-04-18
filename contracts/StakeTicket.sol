// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERC721MinterBurnerPauser.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Arbiter.sol";


import "hardhat/console.sol";
/**
    @title Facilitates deposits and creation of deposit executions.
    @author Elastos Gelaxy team.
 */
//contract StakeTicket is Initializable,Arbiter,ERC721MinterBurnerPauser,OwnableUpgradeable{
contract StakeTicket is Initializable,Arbiter,OwnableUpgradeable{
    struct TickInfo{
        bytes32[] txList;
    }

    address private _erc721Address;
    string constant public version = "v0.0.1";
    mapping(uint256 => TickInfo) internal _idTickInfoMap;

    event StakeTicketMint(
        address to, 
        uint256 tokenId, 
        bytes32 txHash
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
        uint isVerified = pledgeBillVerify(elaHash, to, signatures, publicKeys, multi_m);
        require(isVerified == 1,"pledgeBill Verify do not pass !");
        uint256 tokenId = getTokenIDByTxhash(elaHash);
        require(isNotClaimed(elaHash, tokenId), "isClaimed");

        _idTickInfoMap[tokenId].txList.push(elaHash);
        //
        ERC721MinterBurnerPauser(_erc721Address).mint(to,tokenId,"0x0");
        emit StakeTicketMint(
            to,
            tokenId,
            elaHash
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
       ERC721MinterBurnerPauser(_erc721Address).burn(tokenId);

       emit StakeTicketBurn(
            tokenId,
            saddress
       );
    }


    function getNFTContract() public view returns (address){
        return _erc721Address;
    }
}
