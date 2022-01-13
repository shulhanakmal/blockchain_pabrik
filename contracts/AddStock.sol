// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddStock {

    mapping (uint => Stock) stok;
    mapping (uint => Stock) private stockMapping;

    struct Stock {
        address walletAddress;
        uint stockid;
        Json json;
        string status;
        string created;
        bool init;
    }
    
    struct Json {
        string json;
    }

    Stock[] public arr;
    
    function getAllData() public view returns (Stock[] memory) {
        return arr;
    }
    function addStock(uint stockid, string memory json, string memory status, string memory created) public {
        Stock memory _stock = Stock(msg.sender, stockid, Json(json), status, created, true);
        stockMapping[_stock.stockid] = _stock;
        arr.push(_stock);
    }
    function detailStock(uint stockid) public view returns (Stock memory)  {
        return (stockMapping[stockid]);
    }
} 