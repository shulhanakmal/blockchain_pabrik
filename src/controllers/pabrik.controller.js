const Production = require("../models/jenis.model");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Customer
  const Production = new Production({
    production: req.body.param,
    date: req.body.date,
    volume: req.body.volume,
  });

  // Save Customer in the database
  Production.create(Production, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating Production.",
      });
    else res.send(data);
  });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  Production.remove(req.params.production, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Production with id ${req.params.production}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Production with id " + req.params.production,
        });
      }
    } else res.send({ message: `Production was deleted successfully!` });
  });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};
