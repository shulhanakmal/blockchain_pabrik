module.exports = (app) => {
  const batch = require("../controllers/batch.controller.js");

  // Create a new Customer
  app.post("/daftarBatch", batch.create);

  // Retrieve all Customers
  app.get("/getBatch", batch.findAll);

  // Update a Customer with customerId
  app.put("/daftarBatch/:batchID",  batch.update);
};
