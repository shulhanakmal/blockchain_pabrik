// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddSales {

    mapping (uint => Sales) sale;

    struct Sales {
        address walletAddress;
        uint saleid;
        string date;
        string nodo;
        string buyer;
        string price;
        string sugar;
        string volume;
        string status;
        bool init;
    }
    Sales[] public arr;
    
    function getAllData() public view returns (Sales[] memory) {
        return arr;
    }
    function addSales(uint saleid, string memory date, string memory nodo, string memory buyer, string memory price, string memory sugar, string memory volume, string memory status) public {   
        Sales memory _sales = Sales(msg.sender, saleid, date, nodo, buyer, price, sugar, volume, status, true);
        arr.push(_sales);
    }
}