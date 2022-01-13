// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsSbsfc {

    mapping (uint => LogisticsSbsfc) sbsfc;
    mapping (uint => LogisticsSbsfc) private logisticMapping;

    struct LogisticsSbsfc {
        address walletAddress;
        uint sbsfcid;
        Json json;
        string status;
        string created;
        bool init;
    }

    struct Json {
        string json;
    }

    LogisticsSbsfc[] public arr;
    
    function getAllData() public view returns (LogisticsSbsfc[] memory) {
        return arr;
    }
    function addLogisticsSbsfc(uint sbsfcid, string memory json, string memory status, string memory created) public {
        LogisticsSbsfc memory _logisticsbsfc = LogisticsSbsfc(msg.sender, sbsfcid, Json(json), status, created, true);
        logisticMapping[_logisticsbsfc.sbsfcid] = _logisticsbsfc;
        arr.push(_logisticsbsfc);
    }
    function detailLogisticSBSFC(uint sbsfcid) public view returns (LogisticsSbsfc memory)  {
        return (logisticMapping[sbsfcid]);
    }
} 