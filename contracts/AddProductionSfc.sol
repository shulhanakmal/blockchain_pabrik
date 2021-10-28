// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddProductionSfc {

    mapping (uint => ProductionSfc) sfc;
    mapping (string => ProductionSfc) tgl;
    mapping (string => ProductionSfc) dibuat;
    struct ProductionSfc {
        uint sfcid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addProductionSfc(uint sfcid, string memory date, string memory volume, string memory status, string memory created) public {
        sfc[sfcid] = ProductionSfc(sfcid, date, volume, status, created, true);
        tgl[date] = ProductionSfc(sfcid, date, volume, status, created, true);
        dibuat[created] = ProductionSfc(sfcid, date, volume, status, created, true);
    }
    function getDataSfcBySfcId(uint sfcid) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(sfc[sfcid].init);
        ProductionSfc memory ProductionSfcStruct;
        ProductionSfcStruct = sfc[sfcid];
        return(ProductionSfcStruct.sfcid, ProductionSfcStruct.date, ProductionSfcStruct.volume, ProductionSfcStruct.status, ProductionSfcStruct.created);
    }
    function getDataSfcByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        ProductionSfc memory ProductionSfcStruct;
        ProductionSfcStruct = tgl[date];
        return(ProductionSfcStruct.sfcid, ProductionSfcStruct.date, ProductionSfcStruct.volume, ProductionSfcStruct.status, ProductionSfcStruct.created);
    }
    function getDataSfcByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        ProductionSfc memory ProductionSfcStruct;
        ProductionSfcStruct = dibuat[created];
        return(ProductionSfcStruct.sfcid, ProductionSfcStruct.date, ProductionSfcStruct.volume, ProductionSfcStruct.status, ProductionSfcStruct.created);
    }
}