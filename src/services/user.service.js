import axios from "axios";
import authHeader from "./auth-header";
import authHeaderImage from "./auth-header-image";

// const API_URL = "http://209.97.160.154:90/api/v1/";
// const API_URL = "http://127.0.0.1:8000/api/v2/";
const API_URL = "http://209.97.160.154:8002/api/v2/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getStock() {
    return axios.get(API_URL + "get-stock", { headers: authHeader() });
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }

  getListProduction() {
    return axios.get(API_URL + "list-production", { headers: authHeader() });
  }

  getListProductionForIDProduct(flag, date) {
    return axios.get(API_URL + "list-production/" + flag + "/" + date, { headers: authHeader() });
  }

  getProduction(flag, id) {
    return axios.get(API_URL + "get-data-production/"+ flag + "/" + id, {
      headers: authHeader(),
    });
  }

  editProduction(raw) {
    return axios.post(API_URL + "edit-production", raw, {
      headers: authHeader(),
    });
  }

  getSummaryProduction() {
    return axios.get(API_URL + "summary-production", { headers: authHeader() });
  }

  getFilterProduction() {
    return axios.get(API_URL + "summary-production-filter", { headers: authHeader() });
  }

  addProduction(raw) {
    return axios.post(API_URL + "add-production", raw, {
      headers: authHeader(),
    });
  }

  addProductionMitra(raw) {
    return axios.post(API_URL + "add-production-msc-mitra", raw, {
      headers: authHeader(),
    });
  }

  addProdcutionTransactionHash(raw) {
    return axios.post(API_URL + "add-transaction-hash-production", raw, {
      headers: authHeader(),
    });
  }
  
  getListLogisticForIDProduct(flag, date) {
    return axios.get(API_URL + "list-logistic/" + flag + "/" + date, { headers: authHeader() });
  }

  getListLogistic() {
    return axios.get(API_URL + "list-logistic", { headers: authHeader() });
  }
  
  getLogisticsReturnBuyer(date) {
    return axios.get(API_URL + "get-buyer-by-date/" + date, {
      headers: authHeader(),
    });
  }

  getSugar(buyer, date) {
    return axios.get(API_URL + "get-sugar/" + buyer +"/"+ date, {
      headers: authHeader(),
    });
  }

  getMax(buyer, date, sugar) {
    return axios.get(API_URL + "get-maxlength/" + buyer +"/"+ date +"/"+ sugar, {
      headers: authHeader(),
    });
  }

  getSummaryLogistic() {
    return axios.get(API_URL + "summary-logistic", { headers: authHeader() });
  }

  addLogistic(raw) {
    return axios.post(API_URL + "add-logistic", raw, {
      headers: authHeader(),
    });
  }

  getLogistic(flag, id) {
    return axios.get(API_URL + "get-data-logistic/"+ flag + "/" + id, {
      headers: authHeader(),
    });
  }

  editLogistic(raw) {
    return axios.post(API_URL + "edit-logistic", raw, {
      headers: authHeader(),
    });
  }

  addLogisticsTransactionHash(raw) {
    return axios.post(API_URL + "add-transaction-hash-logistics", raw, {
      headers: authHeader(),
    });
  }

  getSales() {
    return axios.get(API_URL + "sales", { headers: authHeader() });
  }

  getDataSales(id) {
    return axios.get(API_URL + "get-data-sales/" + id, {
      headers: authHeader(),
    });
  }

  getSummarySales() {
    return axios.get(API_URL + "summary-sales", { headers: authHeader() });
  }

  addSales(raw) {
    return axios.post(API_URL + "add-sales", raw, {
      headers: authHeader(),
    });
  }

  addSalesTransactionHash(raw) {
    return axios.post(API_URL + "add-transaction-hash-sales", raw, {
      headers: authHeader(),
    });
  }

  editSales(raw) {
    return axios.post(API_URL + "edit-sales", raw, {
      headers: authHeader(),
    });
  }
  
  getUser() {
    return axios.get(API_URL + "list-user", { headers: authHeader() });
  }
  
  addUser(raw) {
    return axios.post(API_URL + "add-user", raw, {
      headers: authHeader(),
    });
  }
  
  getDashboard() {
    return axios.get(API_URL + "get-dashboard", { headers: authHeader() });
  }

  deleteData(flag, id) {
    return axios.get(API_URL + "delete-data/" + flag + "/" + id, {
      headers: authHeader(),
    });
  }

  RequestData(raw) {
    return axios.post(API_URL + "request-data", raw, {
      headers: authHeader(),
    });
  }

  getRD(signer) {
    return axios.get(API_URL + "get-request-data/" + signer, { headers: authHeader() });
  }

  ApproveRequestData(raw) { // raw adalah requestDataId
    return axios.post(API_URL + "approve-request-data", raw, {
      headers: authHeader(),
    });
  }

  getAdminLRD() {
    return axios.get(API_URL + "list-request-data", { headers: authHeader() });
  }

  changeSRD(requestDataControlId) {
    return axios.get(API_URL + "change-status-request-data/" + requestDataControlId, { headers: authHeader() });
  }

  addLogRequestData(raw) {
    return axios.post(API_URL + "add-log-request-data", raw, {
      headers: authHeader(),
    });
  }

  getDataMitraTani() {
    return axios.get(API_URL + "get-petani-all", { headers: authHeader() });
  }

  getDetailMitraTani(id) {
    return axios.get(API_URL + "get-detail-petani/" + id, { headers: authHeader() });
  }

  changeStatusMitraTani(id) {
    return axios.get(API_URL + "change-status-petani/" + id, { headers: authHeader() });
  }

  AddMitraTani(raw) {
    return axios.post(API_URL + "add-mitra-petani", raw, { 
      headers: authHeader() 
    });
  }

  getDataKebun() {
    return axios.get(API_URL + "get-kebun-all", { headers: authHeader() });
  }

  getDetailKebun(id) {
    return axios.get(API_URL + "get-detail-kebun/"+ id, { headers: authHeader() });
  }

  AddLokasiKebun(raw) {
    return axios.post(API_URL + "add-lokasi-kebun", raw, { 
      headers: authHeader() 
    });
  }

  // getSalesTrasaction(txHash) {
  //   return axios.get(API_URL + "get-sales-transaction/"+ txHash, { headers: authHeader() });
  // }
  getSalesTrasaction(raw) {
    return axios.post(API_URL + "track-sales-transaction", raw, { headers: authHeader() });
  }

  pushQRCodeImage(salesId, raw) {
    return axios.post(API_URL + "update-qr-product/" + salesId, raw, {
      headers: authHeaderImage(),
    });
  }

  getScanQRDataSales(sugar, salesDoc) {
    return axios.get(API_URL + "get-sales-detail/"+ sugar + "/" + salesDoc, { headers: authHeader() });
  }

  getDataProdukDanMitra(sugar, salesId) {
    return axios.get(API_URL + "get-produk-sales/"+ sugar + "/" + salesId, { headers: authHeader() });
  }

  getDataForAddMitra(flag, dataId) {
    return axios.get(API_URL + "get-data-for-mitra/"+ flag + "/" + dataId, { headers: authHeader() });
  }

  addStockTransactionHash(raw) {
    return axios.post(API_URL + "add-transaction-hash-stock", raw, {
      headers: authHeader(),
    });
  }

  getDetailReturn(dok) {
    return axios.get(API_URL + "get-detail-return/"+ dok, { headers: authHeader() });
  }

}

export default new UserService();
