// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddLogisticsSbsfc {

    mapping (uint => LogisticsSbsfc) sbsfc;
    mapping (string => LogisticsSbsfc) tgl;
    mapping (string => LogisticsSbsfc) dibuat;
    struct LogisticsSbsfc {
        uint sbsfcid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    function addLogisticsSbsfc(uint sbsfcid, string memory date, string memory volume, string memory status, string memory created) public {   
        sbsfc[sbsfcid] = LogisticsSbsfc(sbsfcid, date, volume, status, created, true);
        tgl[date] = LogisticsSbsfc(sbsfcid, date, volume, status, created, true);
        dibuat[created] = LogisticsSbsfc(sbsfcid, date, volume, status, created, true);
    }
    function getDataSbsfcBySbsfcId(uint sbsfcid) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(sbsfc[sbsfcid].init);
        LogisticsSbsfc memory LogisticsSbsfcStruct;
        LogisticsSbsfcStruct = sbsfc[sbsfcid];
        return(LogisticsSbsfcStruct.sbsfcid, LogisticsSbsfcStruct.date, LogisticsSbsfcStruct.volume, LogisticsSbsfcStruct.status, LogisticsSbsfcStruct.created);
    }
    function getDataSbsfcByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        LogisticsSbsfc memory LogisticsSbsfcStruct;
        LogisticsSbsfcStruct = tgl[date];
        return(LogisticsSbsfcStruct.sbsfcid, LogisticsSbsfcStruct.date, LogisticsSbsfcStruct.volume, LogisticsSbsfcStruct.status, LogisticsSbsfcStruct.created);
    }
    function getDataSbsfcByDateCreatted(string memory created) view public returns (uint, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        LogisticsSbsfc memory LogisticsSbsfcStruct;
        LogisticsSbsfcStruct = dibuat[created];
        return(LogisticsSbsfcStruct.sbsfcid, LogisticsSbsfcStruct.date, LogisticsSbsfcStruct.volume, LogisticsSbsfcStruct.status, LogisticsSbsfcStruct.created);
    }
}