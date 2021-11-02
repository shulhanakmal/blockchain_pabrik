// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionSfrs {

    mapping (uint => ProductionSfrs) sfrs;

    struct ProductionSfrs {
        address walletAddress;
        uint sfrsid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    ProductionSfrs[] public arr;
    
    function getAllData() public view returns (ProductionSfrs[] memory) {
        return arr;
    }
    function addProductionSfrs(uint sfrsid, string memory date, string memory volume, string memory status, string memory created) public {
        ProductionSfrs memory _productionsfrs = ProductionSfrs(msg.sender, sfrsid, date, volume, status, created, true);
        arr.push(_productionsfrs);
    }
}