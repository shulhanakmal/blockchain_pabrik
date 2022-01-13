// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsRbs {

    mapping (uint => LogisticsRbs) rbs;
    mapping (uint => LogisticsRbs) private logisticMapping;

    struct LogisticsRbs {
        address walletAddress;
        uint rbsid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    LogisticsRbs[] public arr;
    
    function getAllData() public view returns (LogisticsRbs[] memory) {
        return arr;
    }
    function addLogisticsRbs(uint rbsid, string memory json, string memory status, string memory created) public {
        LogisticsRbs memory _logisticsbrbs = LogisticsRbs(msg.sender, rbsid, Json(json), status, created, true);
        logisticMapping[_logisticsbrbs.rbsid] = _logisticsbrbs;
        arr.push(_logisticsbrbs);
    }
    function detailLogisticRBS(uint rbsid) public view returns (LogisticsRbs memory)  {
        return (logisticMapping[rbsid]);
    }
} 