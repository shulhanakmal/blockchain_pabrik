const sql = require("./db");

// constructor
const Batch = function (batch) {
  this.batchID = batch.batchID;
  this.pilihJenis = batch.pilihJenis;
  this.pilihSupplier = batch.pilihSupplier;
  this.volume = batch.volume;
  this.varietas = batch.varietas;
  this.proses = batch.proses;
  // this.gambar = batch.gambar;
  this.tanggalPanen = batch.tanggalPanen;
};

Batch.create = (newBatch, result) => {
  sql.query("INSERT INTO batch SET ?", newBatch, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created batch: ", { id: res.insertId, ...newBatch });
    result(null, { id: res.insertId, ...newBatch });
  });
};

Batch.getAll = (result) => {
  sql.query("SELECT * FROM batch", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("batch: ", res);
    result(null, res);
  });
};

Batch.updateById = (id, batch, result) => {
  sql.query(
    "UPDATE batch SET gambar = ? WHERE id = ?",
    [batch.gambar, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Jenis with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated batch: ", { id: id, ...jenis });
      result(null, { id: id, ...jenis });
    }
  );
};

module.exports = Batch;
