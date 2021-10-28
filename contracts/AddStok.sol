// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddStock {

    mapping (uint => Stock) stok;
    mapping (string => Stock) tgl;
    mapping (string => Stock) dibuat;
    struct Stock {
        uint stockid;
        string date;
        string cane;
        string rs;
        string proses;
        string volume;
        string created;
        bool init;
    }

    Stock[] public stokarr;

    function addStock(uint stockid, string memory date, string memory cane, string memory rs, string memory proses, string memory volume, string memory created) public {   
        stok[stockid] = Stock(stockid, date, cane, rs, proses, volume, created, true);
        tgl[date] = Stock(stockid, date, cane, rs, proses, volume, created, true);
        dibuat[created] = Stock(stockid, date, cane, rs, proses, volume, created, true);
    }
    function getDataStokId(uint stockid) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(stok[stockid].init);
        Stock memory StockStruct;
        StockStruct = stok[stockid];
        return(StockStruct.stockid, StockStruct.date, StockStruct.cane, StockStruct.rs, StockStruct.proses, StockStruct.volume, StockStruct.created);
    }
    function getDataStokByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        Stock memory StockStruct;
        StockStruct = tgl[date];
        return(StockStruct.stockid, StockStruct.date, StockStruct.cane, StockStruct.rs, StockStruct.proses, StockStruct.volume, StockStruct.created);
    }
    function getDataStokByDateCreated(string memory created) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(dibuat[created].init);
        Stock memory StockStruct;
        StockStruct = dibuat[created];
        return(StockStruct.stockid, StockStruct.date, StockStruct.cane, StockStruct.rs, StockStruct.proses, StockStruct.volume, StockStruct.created);
    }
    function getStok() public view returns (Stock[] memory) {
        return stokarr;
    }
}