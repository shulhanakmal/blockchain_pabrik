const Jenis = require("../models/jenis.model");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Customer
  const jenis = new Jenis({
    namaJenis: req.body.namaJenis,
    deskripsiJenis: req.body.deskripsiJenis,
  });

  // Save Customer in the database
  Jenis.create(jenis, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating Jenis.",
      });
    else res.send(data);
  });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  Jenis.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Jenis.",
      });
    else res.send(data);
  });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  Jenis.remove(req.params.jenisID, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Jenis with id ${req.params.jenisID}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Jenis with id " + req.params.jenisID,
        });
      }
    } else res.send({ message: `Jenis was deleted successfully!` });
  });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};
