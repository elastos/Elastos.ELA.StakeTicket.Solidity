//The Licensed Work is (c) 2022 Sygma
//SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "./ERC721MinterBurnerPauser.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Arbiter.sol";

import "hardhat/console.sol";
/**
    @title Facilitates deposits and creation of deposit executions.
    @author ChainSafe Systems.
 */
contract StakeTicket is Initializable,OwnableUpgradeable,Arbiter{

    struct TickInfo{
        address owner;
        uint256 amount;
        uint256 startTimeSpan;
        string supperNode;
        bytes32 txHash;
        string withDrawTo;
    }

    address private _erc721Address;
    string private _version;
    mapping(uint256 => TickInfo) internal _idTickInfoMap;

    event StakeTicketMint(
        address to, 
        uint256 tokenId, 
        uint256 startTimeSpan,
        bytes32  txHash
    );

    event StakeTicketBurn(
        address owner,
        uint256 amount,
        uint256 startTimeSpan,
        string supperNode,
        bytes32 txHash,
        string withDrawTo
    );

    /**
     * @dev __StakeTicket_init
       @param erc721Address erc721 token address
       @param version stake ticket version
     */
    function __StakeTicket_init(
      address erc721Address,
      string memory version
    ) public initializer {

        _erc721Address = erc721Address;
        _version = version;

        __Ownable_init();
          
    }

    function claim(bytes32 elaHash, bytes memory signature, bytes memory publicKey) external {
        uint isVerified = pledgeBillVerify(elaHash, signature, publicKey);
        require(isVerified == 1,"pledgeBill Verify do not pass !");
        uint256 tokenId = getTokenIDByTxhash(elaHash);
        _idTickInfoMap[tokenId].startTimeSpan = block.timestamp;
        _idTickInfoMap[tokenId].txHash = elaHash;
        _idTickInfoMap[tokenId].owner = msg.sender;
        //
        ERC721MinterBurnerPauser(_erc721Address).mint( msg.sender,tokenId,"0x0");
        emit StakeTicketMint(
            msg.sender,
            tokenId,
            block.timestamp,
            elaHash
        );
    }

    /**
        @notice mint the stake tick
        @param to the address of ERC721 
        @param tokenId nft id of the ERC721
        @param txHash tx hash of from the spv
     */
    function mintTick(
        address to, 
        uint256 tokenId, 
        bytes32 txHash
        ) public {
       
    //     uint isVerified = 0;
    //     isVerified = pledgeBillVerify(to, tokenId, txHash);
    //     require(isVerified == 1,"pledgeBill Verify do not pass !");

    //    _idTickInfoMap[tokenId].startTimeSpan = block.timestamp;
    //    //_idTickInfoMap[tokenId].supperNode = supperNode;
    //    _idTickInfoMap[tokenId].txHash = txHash;
    //    _idTickInfoMap[tokenId].owner = to;

    //    ERC721MinterBurnerPauser(_erc721Address).mint(to,tokenId,"0x0");
    //    emit StakeTicketMint(
    //         to,
    //         tokenId,
    //         block.timestamp,
    //         txHash
    //    );
    }

    // /**
    //     @notice mint the stake tick
    //     @param to the address of ERC721 
    //     @param tokenId nft id of the ERC721
    //     @param txHash tx hash of from the spv
    //  */
    // function mintTickTest(
    //     address to, 
    //     uint256 tokenId, 
    //     bytes32 txHash
    //     ) public {

    //         pledgeBillVerify(to, tokenId, txHash);

    //     }


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
       
       emit StakeTicketBurn(
            _idTickInfoMap[tokenId].owner,
            _idTickInfoMap[tokenId].amount,
            _idTickInfoMap[tokenId].startTimeSpan,
            _idTickInfoMap[tokenId].supperNode,
            _idTickInfoMap[tokenId].txHash,
            _idTickInfoMap[tokenId].withDrawTo
       );

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
