// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsSobs {

    mapping (uint => LogisticsSobs) sobs;
    mapping (uint => LogisticsSobs) private logisticMapping;

    struct LogisticsSobs {
        address walletAddress;
        uint sobsid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    LogisticsSobs[] public arr;
    
    function getAllData() public view returns (LogisticsSobs[] memory) {
        return arr;
    }
    function addLogisticsSobs(uint sobsid, string memory json, string memory status, string memory created) public {
        LogisticsSobs memory _logisticsbsobs = LogisticsSobs(msg.sender, sobsid, Json(json), status, created, true);
        logisticMapping[_logisticsbsobs.sobsid] = _logisticsbsobs;
        arr.push(_logisticsbsobs);
    }
    function detailLogisticSOBS(uint sobsid) public view returns (LogisticsSobs memory)  {
        return (logisticMapping[sobsid]);
    }
} 