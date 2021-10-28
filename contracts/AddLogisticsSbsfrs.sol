// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddLogisticsSbsfrs {

    mapping (uint => LogisticsSbsfrs) sbsfrs;
    mapping (string => LogisticsSbsfrs) tgl;
    mapping (string => LogisticsSbsfrs) dibuat;
    struct LogisticsSbsfrs {
        uint sbsfrsid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addLogisticsSbsfrs(uint sbsfrsid, string memory date, string memory volume, string memory status, string memory created) public {   
        sbsfrs[sbsfrsid] = LogisticsSbsfrs(sbsfrsid, date, volume, status, created, true);
        tgl[date] = LogisticsSbsfrs(sbsfrsid, date, volume, status, created, true);
        dibuat[created] = LogisticsSbsfrs(sbsfrsid, date, volume, status, created, true);
    }
    function getDataSbsfrsBySbsfrsId(uint sbsfrsid) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(sbsfrs[sbsfrsid].init);
        LogisticsSbsfrs memory LogisticsSbsfrsStruct;
        LogisticsSbsfrsStruct = sbsfrs[sbsfrsid];
        return(LogisticsSbsfrsStruct.sbsfrsid, LogisticsSbsfrsStruct.date, LogisticsSbsfrsStruct.volume, LogisticsSbsfrsStruct.status, LogisticsSbsfrsStruct.created);
    }
    function getDataSbsfrsByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        LogisticsSbsfrs memory LogisticsSbsfrsStruct;
        LogisticsSbsfrsStruct = tgl[date];
        return(LogisticsSbsfrsStruct.sbsfrsid, LogisticsSbsfrsStruct.date, LogisticsSbsfrsStruct.volume, LogisticsSbsfrsStruct.status, LogisticsSbsfrsStruct.created);
    }
    function getDataSbsfrsByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        LogisticsSbsfrs memory LogisticsSbsfrsStruct;
        LogisticsSbsfrsStruct = dibuat[created];
        return(LogisticsSbsfrsStruct.sbsfrsid, LogisticsSbsfrsStruct.date, LogisticsSbsfrsStruct.volume, LogisticsSbsfrsStruct.status, LogisticsSbsfrsStruct.created);
    }
}