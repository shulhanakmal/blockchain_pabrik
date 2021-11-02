// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsSbsfc {

    mapping (uint => LogisticsSbsfc) sbsfc;

    struct LogisticsSbsfc {
        address walletAddress;
        uint sbsfcid;
        string date;
        string volume;
        string status;
        string created;
        bool init;
    }
    
    LogisticsSbsfc[] public arr;

    function getAllData() public view returns (LogisticsSbsfc[] memory) {
        return arr;
    }
    function addLogisticsSbsfc(uint sbsfcid, string memory date, string memory volume, string memory status, string memory created) public {   
        LogisticsSbsfc memory _logisticssbsfc = LogisticsSbsfc(msg.sender, sbsfcid, date, volume, status, created, true);
        arr.push(_logisticssbsfc);
    }
}