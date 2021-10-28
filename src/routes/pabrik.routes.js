module.exports = (app) => {
    const jenis = require("../controllers/pabrik.controller.js");  

    // pabrik daftar
    app.post("/daftarProduction", pabrik.production);
    app.post("/daftarLogistic", pubrik.logistic);
    app.post("/daftarSales", pabrik.sales);
}