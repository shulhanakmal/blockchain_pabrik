// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddProductionMsc {

    mapping (uint => ProductionMsc) msc;
    mapping (uint => ProductionMsc) private productionMapping;

    struct ProductionMsc {
        address walletAddress;
        uint mscid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    ProductionMsc[] public arr;
    
    function getAllData() public view returns (ProductionMsc[] memory) {
        return arr;
    }
    function addProductionMsc(uint mscid, string memory json, string memory status, string memory created) public {
        ProductionMsc memory _productionmsc = ProductionMsc(msg.sender, mscid, Json(json), status, created, true);
        productionMapping[_productionmsc.mscid] = _productionmsc;
        arr.push(_productionmsc);
    }
    function detailProductionMSC(uint mscid) public view returns (ProductionMsc memory)  {
        return (productionMapping[mscid]);
    }
} 