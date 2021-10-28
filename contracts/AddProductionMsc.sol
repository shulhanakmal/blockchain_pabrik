// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddProductionMsc {

    mapping (uint => ProductionMsc) msc;
    mapping (string => ProductionMsc) tgl;
    mapping (string => ProductionMsc) dibuat;
    struct ProductionMsc {
        uint mscid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addProductionMsc(uint mscid, string memory date, string memory volume, string memory status, string memory created) public {
        msc[mscid] = ProductionMsc(mscid, date, volume, status, created, true);
        tgl[date] = ProductionMsc(mscid, date, volume, status, created, true);
        dibuat[created] = ProductionMsc(mscid, date, volume, status, created, true);
    }
    function getDataMscByMscId(uint mscid) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(msc[mscid].init);
        ProductionMsc memory ProductionMscStruct;
        ProductionMscStruct = msc[mscid];
        return(ProductionMscStruct.mscid, ProductionMscStruct.date, ProductionMscStruct.volume, ProductionMscStruct.status, ProductionMscStruct.created);
    }
    function getDataMscByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        ProductionMsc memory ProductionMscStruct;
        ProductionMscStruct = tgl[date];
        return(ProductionMscStruct.mscid, ProductionMscStruct.date, ProductionMscStruct.volume, ProductionMscStruct.status, ProductionMscStruct.created);
    }
    function getDataMscByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        ProductionMsc memory ProductionMscStruct;
        ProductionMscStruct = dibuat[created];
        return(ProductionMscStruct.mscid, ProductionMscStruct.date, ProductionMscStruct.volume, ProductionMscStruct.status, ProductionMscStruct.created);
    }
}