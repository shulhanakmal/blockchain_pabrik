const Supplier = require("../models/supplier.model");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Customer
  const supplier = new Supplier({
    namaSupplier: req.body.namaSupplier,
    lokasiSupplier: req.body.lokasiSupplier,
  });

  // Save Customer in the database
  Supplier.create(supplier, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating Supplier.",
      });
    else res.send(data);
  });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  Supplier.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Supplier.",
      });
    else res.send(data);
  });
};

exports.delete = (req, res) => {
  Supplier.remove(req.params.supplierID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Supplier with id ${req.params.supplierID}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Supplier with id " + req.params.supplierID,
        });
      }
    } else res.send({ message: `Supplier was deleted successfully!` });
  });
};
