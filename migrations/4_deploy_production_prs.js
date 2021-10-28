const AddProductionPrs = artifacts.require("AddProductionPrs");

module.exports = function (deployer) {
  deployer.deploy(AddProductionPrs);
};