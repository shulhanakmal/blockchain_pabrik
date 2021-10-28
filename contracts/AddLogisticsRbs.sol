// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddLogisticsRbs {

    mapping (uint => LogisticsRbs) rbs;
    mapping (string => LogisticsRbs) tgl;
    mapping (string => LogisticsRbs) dibuat;
    struct LogisticsRbs {
        uint rbsid;
        string date;
        string buyer;
        string sugar;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addLogisticsRbs(uint rbsid, string memory date, string memory buyer, string memory sugar, string memory volume, string memory status, string memory created) public {
        rbs[rbsid] = LogisticsRbs(rbsid, date, buyer, sugar, volume, status, created, true);
        tgl[date] = LogisticsRbs(rbsid, date, buyer, sugar, volume, status, created, true);
        dibuat[created] = LogisticsRbs(rbsid, date, buyer, sugar, volume, status, created, true);
    }
    function getDataRbsByRbsId(uint rbsid) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(rbs[rbsid].init);
        LogisticsRbs memory LogisticsRbsStruct;
        LogisticsRbsStruct = rbs[rbsid];
        return(LogisticsRbsStruct.rbsid, LogisticsRbsStruct.date, LogisticsRbsStruct.buyer, LogisticsRbsStruct.sugar, LogisticsRbsStruct.volume, LogisticsRbsStruct.status, LogisticsRbsStruct.created);
    }
    function getDataRbsByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        LogisticsRbs memory LogisticsRbsStruct;
        LogisticsRbsStruct = tgl[date];
        return(LogisticsRbsStruct.rbsid, LogisticsRbsStruct.date, LogisticsRbsStruct.buyer, LogisticsRbsStruct.sugar, LogisticsRbsStruct.volume, LogisticsRbsStruct.status, LogisticsRbsStruct.created);
    }
    function getDataRbsByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        LogisticsRbs memory LogisticsRbsStruct;
        LogisticsRbsStruct = dibuat[created];
        return(LogisticsRbsStruct.rbsid, LogisticsRbsStruct.date, LogisticsRbsStruct.buyer, LogisticsRbsStruct.sugar, LogisticsRbsStruct.volume, LogisticsRbsStruct.status, LogisticsRbsStruct.created);
    }
}