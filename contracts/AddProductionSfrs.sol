// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionSfrs {

    mapping (uint => ProductionSfrs) sfrs;
    mapping (uint => ProductionSfrs) private productionMapping;

    struct ProductionSfrs {
        address walletAddress;
        uint sfrsid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    ProductionSfrs[] public arr;
    
    function getAllData() public view returns (ProductionSfrs[] memory) {
        return arr;
    }
    function addProductionSfrs(uint sfrsid, string memory json, string memory status, string memory created) public {
        ProductionSfrs memory _productionsfrs = ProductionSfrs(msg.sender, sfrsid, Json(json), status, created, true);
        productionMapping[_productionsfrs.sfrsid] = _productionsfrs;
        arr.push(_productionsfrs);
    }
    function detailProductionSFRS(uint sfrsid) public view returns (ProductionSfrs memory)  {
        return (productionMapping[sfrsid]);
    }
} 