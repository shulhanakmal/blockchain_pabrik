const AddStock = artifacts.require("AddStock");

module.exports = function(deployer) {
    deployer.deploy(AddStock);
};