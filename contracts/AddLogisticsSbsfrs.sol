// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsSbsfrs {

    mapping (uint => LogisticsSbsfrs) sbsfrs;

    struct LogisticsSbsfrs {
        address walletAddress;
        uint sbsfrsid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }

    LogisticsSbsfrs[] public arr;
    
    function getAllData() public view returns (LogisticsSbsfrs[] memory) {
        return arr;
    }
    function addLogisticsSbsfrs(uint sbsfrsid, string memory date, string memory volume, string memory status, string memory created) public {
        LogisticsSbsfrs memory _logisticssbsfrs = LogisticsSbsfrs(msg.sender, sbsfrsid, date, volume, status, created, true);
        arr.push(_logisticssbsfrs);
    }
}