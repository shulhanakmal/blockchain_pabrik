// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsSobs {

    mapping (uint => LogisticsSobs) sobs;

    struct LogisticsSobs {
        address walletAddress;
        uint sobsid;
        string date;
        string volume;
        string sugar;
        string status;
        string created;
        bool init;
    }
    LogisticsSobs[] public arr;
    
    function getAllData() public view returns (LogisticsSobs[] memory) {
        return arr;
    }
    function addLogisticsSobs(uint sobsid, string memory date, string memory volume, string memory sugar, string memory status, string memory created) public {
        LogisticsSobs memory _logisticssobs = LogisticsSobs(msg.sender, sobsid, date, volume, sugar, status, created, true);
        arr.push(_logisticssobs);
    }
}