// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionPrs {

    mapping (uint => ProductionPrs) prs;

    struct ProductionPrs {
        address walletAddress;
        uint prsid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }

    ProductionPrs[] public arr;
    
    function getAllData() public view returns (ProductionPrs[] memory) {
        return arr;
    }
    function addProductionPrs(uint prsid, string memory date, string memory volume, string memory status, string memory created) public {   
        ProductionPrs memory _productionprs = ProductionPrs(msg.sender, prsid, date, volume, status, created, true);
        arr.push(_productionprs);
    }
}