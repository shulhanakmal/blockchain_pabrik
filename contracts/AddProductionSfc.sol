// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionSfc {

    mapping (uint => ProductionSfc) sc;
    mapping (uint => ProductionSfc) private productionMapping;

    struct ProductionSfc {
        address walletAddress;
        uint scid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    ProductionSfc[] public arr;
    
    function getAllData() public view returns (ProductionSfc[] memory) {
        return arr;
    }
    function addProductionSfc(uint scid, string memory json, string memory status, string memory created) public {
        ProductionSfc memory _productionsfc = ProductionSfc(msg.sender, scid, Json(json), status, created, true);
        productionMapping[_productionsfc.scid] = _productionsfc;
        arr.push(_productionsfc);
    }
    function detailProductionSFC(uint scid) public view returns (ProductionSfc memory)  {
        return (productionMapping[scid]);
    }
} 