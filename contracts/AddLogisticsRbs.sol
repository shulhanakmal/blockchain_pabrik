// SPDX-License-Identifier: MIT
pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

contract AddLogisticsRbs {

    mapping (uint => LogisticsRbs) rbs;

    struct LogisticsRbs {
        address walletAddress;
        uint rbsid;
        string date;
        string buyer;
        string sugar;
        string volume;
        string status;
        string created;
        bool init;
    }
    LogisticsRbs[] public RbsArr;

    function getAllData() public view returns (LogisticsRbs[] memory) {
        return RbsArr;
    }

    function addLogisticsRbs(uint rbsid, string memory date, string memory buyer, string memory sugar, string memory volume, string memory status, string memory created) public {
        LogisticsRbs memory _logisticsrbs = LogisticsRbs(msg.sender, rbsid, date, buyer, sugar, volume, status, created, true);
        RbsArr.push(_logisticsrbs);
    }
}