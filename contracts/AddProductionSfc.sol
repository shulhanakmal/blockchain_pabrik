// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionSfc {

    mapping (uint => ProductionSfc) sfc;

    struct ProductionSfc {
        address walletAddress;
        uint sfcid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    ProductionSfc[] public arr;
    
    function getAllData() public view returns (ProductionSfc[] memory) {
        return arr;
    }
    function addProductionSfc(uint sfcid, string memory date, string memory volume, string memory status, string memory created) public {
        ProductionSfc memory _productionsfc = ProductionSfc(msg.sender, sfcid, date, volume, status, created, true);
        arr.push(_productionsfc);
    }
}