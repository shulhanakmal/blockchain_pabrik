import { Fragment, React, useState, useEffect, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import { AddLogistics as StockCane } from "../../../abi/logisticsSbsfc";
import { AddLogistics as StockRS} from "../../../abi/logisticsSbsfrs";
import { AddLogistics as StockOut} from "../../../abi/logisticsSobs";
import { AddLogistics as Return} from "../../../abi/logisticsRbs";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);
export default class ListLogistic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      loading: false,
      color: "#3c4b64",
      TxnHash: "",
      account: '',
      sugar: '',
      cane: '',
      rs: '',
      volume: '',
      // provider: new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID),
      // web3: new Web3(new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID)),
    };
  }

  componentDidMount() {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);
    provider.engine.stop();

    const getWallet = async () => {
      web3.eth.getAccounts(function(err, accounts){
          if (err != null) {
              // alert("An error occurred: "+err);
          } else if (accounts.length == 0) {
              alert("User is not logged in to MetaMask");
          } else {
            this.setState({
              account: accounts[0],
            });
          }
      });
    };
    
    getWallet()

    UserService.getListLogistic().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  deleteSBSFC = (item) => {
    this.setState({
      loading: true,
    });

    UserService.deleteData('sbsfc', item.id).then(
      async (response) => {
        console.log(response)
        const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
        const web3 = new Web3(provider);

        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContractCane = new web3.eth.Contract(StockCane, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
        const gas = await storageContractCane.methods.addLogisticsSbsfc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var post = await storageContractCane.methods.addLogisticsSbsfc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
        from: akun,
        gas,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          this.setState({
            TxnHash: transactionHash,
          });
        });

        // insert txn hash ke database
        const updateData = new FormData();
        updateData.append('id', response.data.id);
        updateData.append('transaction', post.transactionHash);
        updateData.append('wallet', post.from);
        updateData.append('flag', 'stockBulkSugarFromCane');
        UserService.addLogisticsTransactionHash(updateData);

        this.setState({
          loading: false,
        });
        showResults("Dihapus");
        this.setState({
          TxnHash: "",
        });
      },
        (error) => {
        }
      );
    UserService.getListLogistic().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  deleteSBSFRS = (item) => {
    this.setState({
      loading: true,
    });

    UserService.deleteData('sbsfrs', item.id).then(
      async (response) => {
        console.log(response)
        const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
        const web3 = new Web3(provider);

        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContractRs = new web3.eth.Contract(StockRS, '0x8fdb2D0eaD144FAc0f977747C5AB93Ad03eC2904');
        const gas = await storageContractRs.methods.addLogisticsSbsfrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var post = await storageContractRs.methods.addLogisticsSbsfrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
        from: akun,
        gas,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          this.setState({
            TxnHash: transactionHash,
          });
        });

        // insert txn hash ke database
        const updateData = new FormData();
        updateData.append('id', response.data.id);
        updateData.append('transaction', post.transactionHash);
        updateData.append('wallet', post.from);
        updateData.append('flag', 'stockBulkSugarFromRs');
        UserService.addLogisticsTransactionHash(updateData);

        this.setState({
          loading: false,
        });
        showResults("Dihapus");
        this.setState({
          TxnHash: "",
        });
      },
        (error) => {
      }
    );

    UserService.getListLogistic().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  deleteSOBS = (item) => {
    this.setState({
      loading: true,
    });

    UserService.deleteData('sobs', item.id).then(
      async (response) => {
        console.log(response)
        const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
        const web3 = new Web3(provider);

        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContractStock = new web3.eth.Contract(StockOut, '0xdD61c2a97EaFF236B1643e387b966d778A8600a2');
        const gas = await storageContractStock.methods.addLogisticsSobs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var post = await storageContractStock.methods.addLogisticsSobs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
        from: akun,
        gas,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          this.setState({
            TxnHash: transactionHash,
          });
        });

        // insert txn hash ke database
        const updateData = new FormData();
        updateData.append('id', response.data.id);
        updateData.append('transaction', post.transactionHash);
        updateData.append('wallet', post.from);
        updateData.append('flag', 'stockOutBulkSugar');
        UserService.addLogisticsTransactionHash(updateData);

        this.setState({
          loading: false,
        });
        showResults("Dihapus");
        this.setState({
          TxnHash: "",
        });
      },
        (error) => {
      }
    );
    UserService.getListLogistic().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  deleteRBS = (item) => {
    this.setState({
      loading: true,
    });

    UserService.deleteData('rbs', item.id).then(
      async (response) => {
        console.log(response)
        const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
        const web3 = new Web3(provider);

        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContractReturn = new web3.eth.Contract(Return, '0x0731b010C9AAEb70B9340a9Edeb555119d600C2f');
        const gas = await storageContractReturn.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'deleted', dateString).estimateGas();
        var post = await storageContractReturn.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'deleted', dateString).send({
        from: akun,
        gas,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          this.setState({
            TxnHash: transactionHash,
          });
        });

        // insert txn hash return ke database
        const updateData = new FormData();
        updateData.append('id', response.data.id);
        updateData.append('transaction', post.transactionHash);
        updateData.append('wallet', post.from);
        updateData.append('flag', 'returnBulkSugar');
        UserService.addLogisticsTransactionHash(updateData);

        // hapus data stock sugar
        if(response.data.data.sugar === 'cane'){
          const storageContractCane = new web3.eth.Contract(StockCane, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
          const gas = await storageContractCane.methods.addLogisticsSbsfc(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).estimateGas();
          var postSugar = await storageContractCane.methods.addLogisticsSbsfc(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).send({
          from: akun,
          gas,
          }, (error, transactionHash) => {
            console.log([error, transactionHash]);
          });

          // simpan hash
          const txnCane = new FormData();
          txnCane.append('id', response.data.sugar.id);
          txnCane.append('transaction', postSugar.transactionHash);
          txnCane.append('wallet', postSugar.from);
          txnCane.append('flag', 'stockBulkSugarFromCane');
          UserService.addLogisticsTransactionHash(txnCane);
        } else {
          const storageContractRs = new web3.eth.Contract(StockRS, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
          const gas = await storageContractRs.methods.addLogisticsSbsfrs(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).estimateGas();
          var postSugar = await storageContractRs.methods.addLogisticsSbsfrs(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).send({
          from: akun,
          gas,
          }, (error, transactionHash) => {
            console.log([error, transactionHash]);
          });

          // simpan hash
          const txnRS = new FormData();
          txnRS.append('id', response.data.sugar.id);
          txnRS.append('transaction', postSugar.transactionHash);
          txnRS.append('wallet', postSugar.from);
          txnRS.append('flag', 'stockBulkSugarFromRs');
          UserService.addLogisticsTransactionHash(txnRS);
        }

        this.setState({
          loading: false,
          TxnHash: "",
        });
        showResults("Dihapus");
      },
        (error) => {
      }
    );
    UserService.getListLogistic().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  render() {
    const override = `
      display: block;
      margin: 0 auto;
      border-color: red;
      `
    ;

    const StockBulkSugarFromCane = [
      { key: "date", label: "Date"},
      // { key: "volume", label: "Volume", _style: { width: "30%" } },
      { key: "product_id", label: "Product"},
      { key: "show_volume", label: "Volume"},
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const StockBulkSugarFromRS = [
      { key: "date", label: "Date"},
      // { key: "volume", label: "Volume", _style: { width: "30%" } },
      { key: "product_id", label: "Product"},
      { key: "show_volume", label: "Volume"},
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const StockOutBulkSugar = [
      { key: "date", label: "Date"},
      { key: "volume", label: "Volume"},
      { key: "sugar", label: "Sugar"},
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    // const sugarFromRS = [
    const ReturnBulkSugar = [
      { key: "date", label: "Date"},
      { key: "volume", label: "Volume"},
      { key: "sugar", label: "Sugar"},
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];

    return (
      <Fragment>
        {(() => {
            if (this.state.loading === true) {
                return (
                    <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                        <div className="sweet-loading">
                            <h5>Transaksi akan ditulis ke Blockchain</h5><br></br>
                            {/* <h5>{this.state.TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + this.state.TxnHash} target="_blank" >Detail</a>}</h5> */}
                            <br></br>
                                <Loader color={this.state.color} loading={this.state.loading} css={override} size={150} />
                            <br></br>
                            <br></br>
                            <h5>Mohon Tunggu...</h5>
                        </div>
                    </div>
                )
            } else {
                return(
                  <main className="c-main">
                    <div className="container-fluid">
                      {/* <CCard>
                        <CCardBody>
                          <h3>Stok</h3>
                          <br></br>
                          <CCard>
                            <CCardBody>
                              <h5>Cane</h5>
                                <input readOnly value={this.state.cane} className="textInput pabrik" />
                              <h5>Raw Sugar</h5>
                                <input readOnly value={this.state.rs} className="textInput pabrik" />
                            </CCardBody>
                          </CCard>
                        </CCardBody>
                      </CCard> */}
                      <CCard>
                        <CCardBody>
                          <CTabs>
                            <CNav variant="tabs">
                              <CNavItem>
                                <CNavLink>Stock Bulk Sugar From Cane</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Stock Bulk Sugar From RS</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Stock Out Bulk Sugar</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Return Bulk Sugar</CNavLink>
                              </CNavItem>
                            </CNav>
                            <CTabContent>
                              <CTabPane>
                                <CRow>
                                  <CCol xs="12">
                                    <CCardHeader>
                                      <CRow>
                                        <CCol
                                          xs={6}
                                          md={7}
                                          lg={10}
                                          style={{ margin: "auto" }}
                                        >
                                          <h4 style={{ margin: "auto" }}>Data Logistic</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Logistic/tambah-stock-bulk-sugar-from-cane"
                                          >
                                            Add Logistics
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.stockBulkSugarFromCane}
                                        fields={StockBulkSugarFromCane}
                                        itemsPerPage={10}
                                        tableFilter
                                        cleaner
                                        itemsPerPageSelect
                                        hover
                                        sorter
                                        pagination
                                        scopedSlots={{
                                          show_volume: (item) => {
                                            return (
                                              <td className="py-2">
                                                <div>
                                                  {(() => {
                                                      if(item.volume) {
                                                        return(
                                                          item.volume
                                                        )
                                                      } else {
                                                        return (
                                                          <CButton size="sm" color="warning" style={{'color': 'white'}} to={`/Production/add-mitra/msc/${item.id}`} >Add Mitra</CButton>
                                                        )
                                                      }
                                                  })()}
                                                </div>
                                              </td>
                                            );
                                          },
                                          show_details: (item) => {
                                            if(item.no_do) {
                                              let nodo = item.no_do.replaceAll("/", "_")
                                              return (
                                                <td className="py-2" >
                                                  {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                                  <CRow>
                                                    <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSBSFC(item)} style={{ backgroundColor: "#e2602c" }} >Delete</CButton> {" "}
                                                    <CButton size="sm" color="warning" className="ml-1" to={`detailReturn/${nodo}`} style={{ color: "white" }} >Check</CButton>
                                                  </CRow>
                                                </td>
                                              );
                                            } else {
                                              return (
                                                <td className="py-2">
                                                  {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                                  <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSBSFC(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                                </td>
                                              );
                                            }
                                          },
                                        }}
                                      />
                                    </CCardBody>
                                  </CCol>
                                </CRow>
                              </CTabPane>
                              <CTabPane>
                                <CRow>
                                  <CCol xs="12">
                                    <CCardHeader>
                                      <CRow>
                                        <CCol
                                          xs={6}
                                          md={7}
                                          lg={10}
                                          style={{ margin: "auto" }}
                                        >
                                          <h4 style={{ margin: "auto" }}>Data Logistic</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Logistic/tambah-stock-bulk-sugar-from-rs"
                                          >
                                            Add Logistics
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.stockBulkSugarFromRs}
                                        fields={StockBulkSugarFromRS}
                                        itemsPerPage={10}
                                        tableFilter
                                        cleaner
                                        itemsPerPageSelect
                                        hover
                                        sorter
                                        pagination
                                        scopedSlots={{
                                          show_volume: (item) => {
                                            return (
                                              <td className="py-2">
                                                <div>
                                                  {(() => {
                                                      if(item.volume) {
                                                        return(
                                                          item.volume
                                                        )
                                                      } else {
                                                        return (
                                                          <CButton size="sm" color="warning" style={{'color': 'white'}} to={`/Production/add-mitra/msc/${item.id}`} >Add Mitra</CButton>
                                                        )
                                                      }
                                                  })()}
                                                </div>
                                              </td>
                                            );
                                          },
                                          show_details: (item) => {
                                            if(item.no_do) {
                                              let dok = item.no_do.replaceAll("/", "_")
                                              return (
                                                <td className="py-2">
                                                  {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                                  <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSBSFRS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                                  <CButton size="sm" color="warning" className="ml-1" to={`detailReturn/${dok}`} style={{ color: "white" }} >Check</CButton>
                                                </td>
                                              );
                                            } else {
                                              return (
                                                <td className="py-2">
                                                  {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                                  <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSBSFRS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                                </td>
                                              );
                                            }
                                          },
                                        }}
                                      />
                                    </CCardBody>
                                  </CCol>
                                </CRow>
                              </CTabPane>
                              <CTabPane>
                                <CRow>
                                  <CCol xs="12">
                                    <CCardHeader>
                                      <CRow>
                                        <CCol
                                          xs={6}
                                          md={7}
                                          lg={10}
                                          style={{ margin: "auto" }}
                                        >
                                          <h4 style={{ margin: "auto" }}>Data Logistic</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Logistic/tambah-stock-out-bulk-sugar"
                                          >
                                            Add Logistics
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.stockOutBulkSugar}
                                        fields={StockOutBulkSugar}
                                        itemsPerPage={10}
                                        pagination
                                        scopedSlots={{
                                          show_details: (item) => {
                                            return (
                                              <td className="py-2">
                                                {/* <CButton size="sm" color="info" to={`/Logistic/edit/sobs/${item.id}`}>Edit</CButton> */}
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSOBS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                              </td>
                                            );
                                          },
                                        }}
                                      />
                                    </CCardBody>
                                  </CCol>
                                </CRow>
                              </CTabPane>
                              <CTabPane>
                                <CRow>
                                  <CCol xs="12">
                                    <CCardHeader>
                                      <CRow>
                                        <CCol
                                          xs={6}
                                          md={7}
                                          lg={10}
                                          style={{ margin: "auto" }}
                                        >
                                          <h4 style={{ margin: "auto" }}>Data Logistic</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Logistic/tambah-return-bulk-sugar"
                                          >
                                            Add Logistics
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.returnBulkSugar}
                                        fields={ReturnBulkSugar}
                                        itemsPerPage={10}
                                        pagination
                                        scopedSlots={{
                                          show_details: (item) => {
                                            return (
                                              <td className="py-2">
                                                {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteRBS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                              </td>
                                            );
                                          },
                                        }}
                                      />
                                    </CCardBody>
                                  </CCol>
                                </CRow>
                              </CTabPane>
                            </CTabContent>
                          </CTabs>
                        </CCardBody>
                      </CCard>
                    </div>
                  </main>
                )
            }
        })()}
      </Fragment>
    );
  }
}
