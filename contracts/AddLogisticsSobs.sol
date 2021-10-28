// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddLogisticsSobs {

    mapping (uint => LogisticsSobs) sobs;
    mapping (string => LogisticsSobs) tgl;
    mapping (string => LogisticsSobs) dibuat;
    struct LogisticsSobs {
        uint sobsid;
        string date;
        string volume;
        string sugar;
        string status;
        string created;
        bool init;
    }
    function addLogisticsSobs(uint sobsid, string memory date, string memory volume, string memory sugar, string memory status, string memory created) public {   
        sobs[sobsid] = LogisticsSobs(sobsid, date, volume, sugar, status, created, true);
        tgl[date] = LogisticsSobs(sobsid, date, volume, sugar, status, created, true);
        dibuat[created] = LogisticsSobs(sobsid, date, sugar, volume, status, created, true);
    }
    function getDataSobsBySobsId(uint sobsid) view public returns (uint, string memory, string memory, string memory, string memory, string memory) {
        require(sobs[sobsid].init);
        LogisticsSobs memory LogisticsSobsStruct;
        LogisticsSobsStruct = sobs[sobsid];
        return(LogisticsSobsStruct.sobsid, LogisticsSobsStruct.date, LogisticsSobsStruct.volume, LogisticsSobsStruct.sugar, LogisticsSobsStruct.status, LogisticsSobsStruct.created);
    }
    function getDataSobsByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        LogisticsSobs memory LogisticsSobsStruct;
        LogisticsSobsStruct = tgl[date];
        return(LogisticsSobsStruct.sobsid, LogisticsSobsStruct.date, LogisticsSobsStruct.volume, LogisticsSobsStruct.sugar, LogisticsSobsStruct.status, LogisticsSobsStruct.created);
    }
    function getDataSobsByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        LogisticsSobs memory LogisticsSobsStruct;
        LogisticsSobsStruct = dibuat[created];
        return(LogisticsSobsStruct.sobsid, LogisticsSobsStruct.date, LogisticsSobsStruct.volume, LogisticsSobsStruct.sugar, LogisticsSobsStruct.status, LogisticsSobsStruct.created);
    }
}