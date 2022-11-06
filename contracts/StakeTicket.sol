//The Licensed Work is (c) 2022 Sygma
//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./ERC721MinterBurnerPauser.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

/**
    @title Facilitates deposits and creation of deposit executions.
    @author ChainSafe Systems.
 */
contract StakeTicket is Initializable{

    struct TickInfo{
        address owner;
        uint256 amount;
        uint256 startTimeSpan;
        string supperNode;
        string txHash;
        string withDrawTo;
    }

    address private _erc721Address;
    string private _version;
    mapping(uint256 => TickInfo) internal _idTickInfoMap;

    /**
     * @dev __StakeTicket_init
       @param erc721Address erc721 token address
       @param version stake ticket version
     */
    function __StakeTicket_init(
      address erc721Address,
      string memory version
    ) public initializer{

        _erc721Address = erc721Address;
        _version = version;
          
    }

    /**
        @notice mint the stake tick
        @param to the address of ERC721 
        @param tokenId nft id of the ERC721
        @param _data data of the ERC721
        @param amount amount of the ela Stake 
        @param startTimeSpan start timespan of the start stake time
        @param supperNode supper node info
        @param txHash stake txid 
     */
    function mintTick(
        address to, 
        uint256 tokenId, 
        string memory _data,
        uint256 amount,
        uint256 startTimeSpan,
        string memory supperNode,
        string memory txHash) public {
       
       require(amount > 0,"stake amount must larger than 0");
       
       _idTickInfoMap[tokenId].amount = amount;
       _idTickInfoMap[tokenId].startTimeSpan = startTimeSpan;
       _idTickInfoMap[tokenId].supperNode = supperNode;
       _idTickInfoMap[tokenId].txHash = txHash;
       _idTickInfoMap[tokenId].owner = to;

        ERC721MinterBurnerPauser(_erc721Address).mint(to,tokenId,_data);
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
    function burnTick(uint256 tokenId) public {
       
       require(tokenId > 0,"stake amount must larger than 0");

       ERC721MinterBurnerPauser(_erc721Address).burn(tokenId);
       delete _idTickInfoMap[tokenId];  
    }

    /**
        @notice tranfer the stake tick
        @param tokenId nft id of the ERC721
     */
    function tranferTick(address to,uint256 tokenId) public {
       
       require(tokenId > 0,"stake amount must larger than 0");

       ERC721MinterBurnerPauser(_erc721Address).safeTransferFrom(msg.sender,to,tokenId);
       _idTickInfoMap[tokenId].owner = to;

    }

    /**
        @notice withDraw the stake tick
        @param tokenId nft id of the ERC721
     */
    function withDrawTick(uint256 tokenId,string memory withDrawTo) public {
       
       require(tokenId > 0,"stake amount must larger than 0");
       require(msg.sender == _idTickInfoMap[tokenId].owner,"ticket owner is not collect");

       _idTickInfoMap[tokenId].withDrawTo = withDrawTo;

    }
}
