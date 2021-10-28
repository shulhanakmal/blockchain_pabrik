module.exports = (app) => {
  const jenis = require("../controllers/jenis.controller.js");  
  
  // Create a new Customer
  app.post("/daftarJenis", jenis.create);

  // Retrieve all Customers
  app.get("/getJenis", jenis.findAll);

  // Retrieve a single Customer with customerId
  app.get("/jenis/:jenisID", jenis.findOne);

  // Update a Customer with customerId
  app.put("/jenis/:jenisID", jenis.update);

  // Delete a Customer with customerId
  app.delete("/deleteJenis/:jenisID", jenis.delete);

  // Create a new Customer
  app.delete("/jenis", jenis.deleteAll);
};
