// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddProductionPrs {

    mapping (uint => ProductionPrs) prs;
    mapping (string => ProductionPrs) tgl;
    mapping (string => ProductionPrs) dibuat;
    struct ProductionPrs {
        uint prsid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addProductionPrs(uint prsid, string memory date, string memory volume, string memory status, string memory created) public {   
        prs[prsid] = ProductionPrs(prsid, date, volume, status, created, true);
        tgl[date] = ProductionPrs(prsid, date, volume, status, created, true);
        dibuat[created] = ProductionPrs(prsid, date, volume, status, created, true);
    }
    function getDataPrsByPrsId(uint prsid) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(prs[prsid].init);
        ProductionPrs memory ProductionPrsStruct;
        ProductionPrsStruct = prs[prsid];
        return(ProductionPrsStruct.prsid, ProductionPrsStruct.date, ProductionPrsStruct.volume, ProductionPrsStruct.status, ProductionPrsStruct.created);
    }
    function getDataPrsByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        ProductionPrs memory ProductionPrsStruct;
        ProductionPrsStruct = tgl[date];
        return(ProductionPrsStruct.prsid, ProductionPrsStruct.date, ProductionPrsStruct.volume, ProductionPrsStruct.status, ProductionPrsStruct.created);
    }
    function getDataPrsByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        ProductionPrs memory ProductionPrsStruct;
        ProductionPrsStruct = dibuat[created];
        return(ProductionPrsStruct.prsid, ProductionPrsStruct.date, ProductionPrsStruct.volume, ProductionPrsStruct.status, ProductionPrsStruct.created);
    }
}

