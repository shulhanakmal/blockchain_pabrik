pragma solidity >=0.5.8 <0.7.0;

contract SimpleStorage {
    uint256 storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}