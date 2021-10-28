// SPDX-License-Identifier: MIT
pragma solidity >=0.5.8 <=0.8.4;

contract AddSales {

    mapping (uint => Sales) sale;
    mapping (string => Sales) tgl;
    struct Sales {
        uint saleid;
        string date;
        string nodo;
        string buyer;
        string price;
        string sugar;
        string volume;
        string status;
        bool init;
    }
    function addSales(uint saleid, string memory date, string memory nodo, string memory buyer, string memory price, string memory sugar, string memory volume, string memory status) public {   
        sale[saleid] = Sales(saleid, date, nodo, buyer, price, sugar, volume, status, true);
        tgl[date] = Sales(saleid, date, nodo, buyer, price, sugar, volume, status, true);
    }
    function getDataSalesBySalesId(uint saleid) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(sale[saleid].init);
        Sales memory SalesStruct;
        SalesStruct = sale[saleid];
        return(SalesStruct.saleid, SalesStruct.date, SalesStruct.nodo, SalesStruct.buyer, SalesStruct.price, SalesStruct.sugar, SalesStruct.volume, SalesStruct.status);
    }
    function getDataSalesByDate(string memory date) view public returns (uint, string memory, string memory, string memory, string memory, string memory, string memory, string memory) {
        require(tgl[date].init);
        Sales memory SalesStruct;
        SalesStruct = tgl[date];
        return(SalesStruct.saleid, SalesStruct.date, SalesStruct.nodo, SalesStruct.buyer, SalesStruct.price, SalesStruct.sugar, SalesStruct.volume, SalesStruct.status);
    }
}