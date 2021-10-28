const Batch = require("../models/batch.model");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Customer
  const batch = new Batch({
    batchID: req.body.batchID,
    pilihJenis: req.body.pilihJenis,
    pilihSupplier: req.body.pilihSupplier,
    volume: req.body.volume,
    varietas: req.body.varietas,
    proses: req.body.proses,
    // gambar: req.body.gambar,
    tanggalPanen: req.body.tanggalPanen,
  });

  // Save Customer in the database
  Batch.create(batch, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating Batch.",
      });
    else res.send(data);
  });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  Batch.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Batch.",
      });
    else res.send(data);
  });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Batch.updateById(req.params.batchID, new Batch(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Batch with id ${req.params.batchID}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Batch with id " + req.params.batchID,
        });
      }
    } else res.send(data);
  });
};
