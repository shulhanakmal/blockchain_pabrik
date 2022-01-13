// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddSales {

    mapping (uint => Sales) sale;
    mapping (uint => Sales) private salesMapping;

    struct Sales {
        address walletAddress;
        uint salesid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    Sales[] public arr;
    
    function getAllData() public view returns (Sales[] memory) {
        return arr;
    }
    function addSales(uint salesid, string memory json, string memory status, string memory created) public {
        Sales memory _sales = Sales(msg.sender, salesid, Json(json), status, created, true);
        salesMapping[_sales.salesid] = _sales;
        arr.push(_sales);
    }
    function detailSales(uint salesid) public view returns (Sales memory)  {
        return (salesMapping[salesid]);
    }
} 