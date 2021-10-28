const sql = require("./db");

// constructor
const Jenis = function (jenis) {
  this.namaJenis = jenis.namaJenis;
  this.deskripsiJenis = jenis.deskripsiJenis;
};

Jenis.create = (newJenis, result) => {
  sql.query("INSERT INTO jenis SET ?", newJenis, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created jenis: ", { id: res.insertId, ...newJenis });
    result(null, { id: res.insertId, ...newJenis });
  });
};

Jenis.findById = (jenisID, result) => {
  sql.query(`SELECT * FROM jenis WHERE id = ${jenisID}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found jenis: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Jenis with the id
    result({ kind: "not_found" }, null);
  });
};

Jenis.getAll = (result) => {
  sql.query("SELECT * FROM jenis", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("jenis: ", res);
    result(null, res);
  });
};

Jenis.updateById = (id, jenis, result) => {
  sql.query(
    "UPDATE jenis SET namaJenis = ?, deskripsiJenis = ? WHERE id = ?",
    [jenis.email, jenis.name, id],
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

      console.log("updated jenis: ", { id: id, ...jenis });
      result(null, { id: id, ...jenis });
    }
  );
};

Jenis.remove = (id, result) => {
  sql.query("DELETE FROM jenis WHERE id = ?", id, (err, res) => {
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

    console.log("deleted jenis with id: ", id);
    result(null, res);
  });
};

Jenis.removeAll = (result) => {
  sql.query("DELETE FROM jenis", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} jenis`);
    result(null, res);
  });
};

module.exports = Jenis;
