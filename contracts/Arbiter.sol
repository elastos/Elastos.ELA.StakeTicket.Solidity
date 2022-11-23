// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "hardhat/console.sol";

import "./bytesUtils/Bytes.sol";

/**
 * @title Arbiter
 * @dev A super simple ERC20 implementation!
 */
contract Arbiter is Bytes{
    //xxl Done
    uint256 public constant ARBITER_NUM = 12;
    // using Bytes for bytes;

    //uint256 constant public ARBITER_NUM = 3;
    function isArbiterInList(bytes32 arbiter) internal view returns (bool) {
        bytes32[ARBITER_NUM] memory arbiterList = getArbiterList();

        for (uint256 i = 0; i < ARBITER_NUM; i++) {
            if (arbiter == arbiterList[i]) {
                return true;
            }
        }

        return false;
    }

    function getArbiterList()
        public
        view
        returns (bytes32[ARBITER_NUM] memory)
    {
        bytes32[ARBITER_NUM] memory p;
        uint256 input;
        assembly {
            if iszero(staticcall(gas(), 1000, input, 0x00, p, 384)) {
                revert(0, 0)
            }
        }
        return p;
    }

    function pledgeBillVerify(
        address _to,
        uint256 _tokenId, 
        bytes32 _txHash
    ) public view returns (uint) {
        
        uint method = 1003;
        uint offSet = 32;
        uint outputSize = 32;
        uint256[1] memory result;
        uint256 inputSize = 0;
        uint256 leftGas = gasleft();

        bytes memory toInput = toBytes(_to);
        bytes memory tokenIdInput = toBytes(_tokenId);
        bytes memory txHashInput = toBytes(_txHash);

        bytes memory input = concat(toInput, tokenIdInput);
        input = concat(input, txHashInput);
        inputSize = input.length + offSet;

        assembly {
            if iszero(staticcall(leftGas, method, input, inputSize, result, outputSize)) {
                revert(0, 0)
            }
        }

        return result[0];


    }

    function pledgeBillVerifyTest(
        address _to,
        uint256 _tokenId, 
        bytes32 _txHash
    ) public view returns (bool) {
        
        
        string memory strInput = strConcat(strConcat(addressToString(_to), uint2str(_tokenId)), bytes32ToString(_txHash));
        bytes memory input = hexStr2bytes(strInput);
        uint256[1] memory p;

        assembly {
            if iszero(staticcall(gas(), 1003, input, 147, p, 0x20)) {
                revert(0, 0)
            }
        }

        return p[0] == 1;
    }











    function p256Verify(
        string memory _pubkey,
        string memory _data,
        string memory _sig
    ) public view returns (bool) {
        string memory strInput = strConcat(strConcat(_pubkey, _data), _sig);
        bytes memory input = hexStr2bytes(strInput);
        uint256[1] memory p;

        assembly {
            if iszero(staticcall(gas(), 1001, input, 193, p, 0x20)) {
                revert(0, 0)
            }
        }

        return p[0] == 1;
    }

    function strConcat(string memory _a, string memory _b)
        internal
        pure
        returns (string memory)
    {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint256 k = 0;
        for (uint256 i = 0; i < _ba.length; i++) bret[k++] = _ba[i];
        for (uint256 i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(ret);
    }

    function hexStr2bytes(string memory _data)
        internal
        view
        returns (bytes memory)
    {
        bytes memory a = bytes(_data);
        uint8[] memory b = new uint8[](a.length);

        for (uint256 i = 0; i < a.length; i++) {
            uint8 _a = uint8(a[i]);

            if (_a > 96) {
                b[i] = _a - 97 + 10;
            } else if (_a > 66) {
                b[i] = _a - 65 + 10;
            } else {
                b[i] = _a - 48;
            }
        }

        bytes memory c = new bytes(b.length / 2);
        for (uint256 _i = 0; _i < b.length; _i += 2) {
            c[_i / 2] = bytes1(b[_i] * 16 + b[_i + 1]);
        }

        return c;
    }

    function addressToString(address _addr)
        internal
        pure
        returns (string memory)
    {
        bytes memory addresssBytes = abi.encodePacked(_addr);
        bytes memory stringBytes = new bytes(40);
        stringBytes = bytesToString(addresssBytes, 20);

        return string(stringBytes);
    }

    function bytes32ToString(bytes32 _bytes32)
        internal
        pure
        returns (string memory)
    {
        bytes memory addresssBytes = abi.encodePacked(_bytes32);
        bytes memory stringBytes = new bytes(64);
        stringBytes = bytesToString(addresssBytes, 32);

        return string(stringBytes);
    }

    function bytesToString(bytes memory addresssBytes, uint256 len)
        internal
        pure
        returns (bytes memory)
    {
        bytes memory stringBytes = new bytes(len * 2);
        for (uint256 i = 0; i < len; i++) {
            uint8 leftValue = uint8(addresssBytes[i]) / 16;
            uint8 rightValue = uint8(addresssBytes[i]) - 16 * leftValue;

            bytes1 leftChar = leftValue < 10
                ? bytes1(leftValue + 48)
                : bytes1(leftValue + 87);
            bytes1 rightChar = rightValue < 10
                ? bytes1(rightValue + 48)
                : bytes1(rightValue + 87);

            stringBytes[2 * i] = leftChar;
            stringBytes[2 * i + 1] = rightChar;
        }

        return stringBytes;
    }

    function stringToBytes32(string memory _source)
        internal
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(_source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(_source, 32))
        }
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
