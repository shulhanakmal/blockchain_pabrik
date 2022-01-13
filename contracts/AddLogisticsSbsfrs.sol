// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsSbsfrs {

    mapping (uint => LogisticsSbsfrs) sbsfrs;
    mapping (uint => LogisticsSbsfrs) private logisticMapping;

    struct LogisticsSbsfrs {
        address walletAddress;
        uint sbsfrsid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    LogisticsSbsfrs[] public arr;
    
    function getAllData() public view returns (LogisticsSbsfrs[] memory) {
        return arr;
    }
    function addLogisticsSbsfrs(uint sbsfrsid, string memory json, string memory status, string memory created) public {
        LogisticsSbsfrs memory _logisticsbsfrs = LogisticsSbsfrs(msg.sender, sbsfrsid, Json(json), status, created, true);
        logisticMapping[_logisticsbsfrs.sbsfrsid] = _logisticsbsfrs;
        arr.push(_logisticsbsfrs);
    }
    function detailLogisticSBSFRS(uint sbsfrsid) public view returns (LogisticsSbsfrs memory)  {
        return (logisticMapping[sbsfrsid]);
    }
} 