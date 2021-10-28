// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddProductionSfrs {

    mapping (uint => ProductionSfrs) sfrs;
    mapping (string => ProductionSfrs) tgl;
    mapping (string => ProductionSfrs) dibuat;
    struct ProductionSfrs {
        uint sfrsid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addProductionSfrs(uint sfrsid, string memory date, string memory volume, string memory status, string memory created) public {
        sfrs[sfrsid] = ProductionSfrs(sfrsid, date, volume, status, created, true);
        tgl[date] = ProductionSfrs(sfrsid, date, volume, status, created, true);
        dibuat[created] = ProductionSfrs(sfrsid, date, volume, status, created, true);
    }
    function getDataSfrsBySfrsId(uint sfrsid) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(sfrs[sfrsid].init);
        ProductionSfrs memory ProductionSfrsStruct;
        ProductionSfrsStruct = sfrs[sfrsid];
        return(ProductionSfrsStruct.sfrsid, ProductionSfrsStruct.date, ProductionSfrsStruct.volume, ProductionSfrsStruct.status, ProductionSfrsStruct.created);
    }
    function getDataSfrsByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        ProductionSfrs memory ProductionSfrsStruct;
        ProductionSfrsStruct = tgl[date];
        return(ProductionSfrsStruct.sfrsid, ProductionSfrsStruct.date, ProductionSfrsStruct.volume, ProductionSfrsStruct.status, ProductionSfrsStruct.created);
    }
    function getDataSfrsByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        ProductionSfrs memory ProductionSfrsStruct;
        ProductionSfrsStruct = dibuat[created];
        return(ProductionSfrsStruct.sfrsid, ProductionSfrsStruct.date, ProductionSfrsStruct.volume, ProductionSfrsStruct.status, ProductionSfrsStruct.created);
    }
}