// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionMsc {

    mapping (uint => ProductionMsc) msc;

    struct ProductionMsc {
        address walletAddress;
        uint mscid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }

    ProductionMsc[] public arr;
    
    function getAllData() public view returns (ProductionMsc[] memory) {
        return arr;
    }
    function addProductionMsc(uint mscid, string memory date, string memory volume, string memory status, string memory created) public {
        ProductionMsc memory _productionmsc = ProductionMsc(msg.sender, mscid, date, volume, status, created, true);
        arr.push(_productionmsc);
    }
}