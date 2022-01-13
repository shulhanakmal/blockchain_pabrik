// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionPrs {

    mapping (uint => ProductionPrs) prs;
    mapping (uint => ProductionPrs) private productionMapping;

    struct ProductionPrs {
        address walletAddress;
        uint prsid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    ProductionPrs[] public arr;
    
    function getAllData() public view returns (ProductionPrs[] memory) {
        return arr;
    }
    function addProductionPrs(uint prsid, string memory json, string memory status, string memory created) public {
        ProductionPrs memory _productionprs = ProductionPrs(msg.sender, prsid, Json(json), status, created, true);
        productionMapping[_productionprs.prsid] = _productionprs;
        arr.push(_productionprs);
    }
    function detailProductionPRS(uint prsid) public view returns (ProductionPrs memory)  {
        return (productionMapping[prsid]);
    }
} 