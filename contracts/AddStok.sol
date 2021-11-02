// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddStock {

    mapping (uint => Stock) stok;

    struct Stock {
        address walletAddress;
        uint stockid;
        string date;
        string cane;
        string rs;
        string proses;
        string volume;
        string created;
        bool init;
    }
    Stock[] public arr;

    function getAllData() public view returns (Stock[] memory) {
        return arr;
    }
    function addStock(uint stockid, string memory date, string memory cane, string memory rs, string memory proses, string memory volume, string memory created) public {   
        Stock memory _stok = Stock(msg.sender, stockid, date, cane, rs, proses, volume, created, true);
        arr.push(_stok);
    }
}