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
} from "@coreui/react";
import showResults from "../../showResults/showResults";
import UserService from "../../../services/user.service";
import Web3 from "web3";
import { AddSales } from "../../../abi/sales";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

export default class Sales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      loading: false,
      color: "#3c4b64",
      TxnHash: "",
      account: '',
      sugar: '',
      volume: '',
      flag: '',
    };
  }

  componentDidMount() {
    UserService.getSales().then(
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

  deleteSales = (item) => {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);

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

    this.setState({
      loading: true,
    });

    UserService.deleteData('sales', item.id).then(
      async (response) => {
        console.log(response.data);
        if(response.data.mount_sugar_sold_cane === '0.00') {
          this.setState({
            sugar: 'rs',
            volume: response.data.mount_sugar_sold_rs,
          })
        } else {
          this.setState({
            sugar: 'cane',
            volume: response.data.mount_sugar_sold_cane,
          })
        }
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContract = new web3.eth.Contract(AddSales, '0xC974bc711392Faa384C633Eb0b941DbAA133d382');
        console.log(this.sugar);
        console.log(this.volume);
        const gas = await storageContract.methods.addSales(response.data.id, response.data.date, response.data.no_do, response.data.buyer, response.data.price, this.state.sugar, this.state.volume, 'deleted').estimateGas();
        var post = await storageContract.methods.addSales(response.data.id, response.data.date, response.data.no_do, response.data.buyer, response.data.price, this.state.sugar, this.state.volume, 'deleted').send({
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
        UserService.addSalesTransactionHash(updateData);

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
    UserService.getSales().then((response)  => {
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

    const sales = [
      { key: "date", label: "Date", _style: { width: "15%" } },
      { key: "no_do", label: "No", _style: { width: "15%" } },
      { key: "buyer", label: "Buyer", _style: { width: "15%" } },
      { key: "price", label: "Price", _style: { width: "15%" } },
      { key: "mount_sugar_sold_cane", label: "Cane", _style: { width: "10%" } },
      { key: "mount_sugar_sold_rs", label: "RS", _style: { width: "10%" } },
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
            return (
              <main className="c-main">
                <div className="container-fluid">
                  <CCard>
                    <CCardBody>
                      <CCol xs="12">
                          <CCardHeader>
                              <CRow>
                                  <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                                      <h4 style={{ margin: "auto" }}>Data Sales</h4>
                                  </CCol>
                                  <CCol>
                                      <CButton block color="dark" to="/Sales/tambah-sales">Add Sales</CButton>
                                  </CCol>
                              </CRow>
                          </CCardHeader>
                          <CCardBody>
                              <CDataTable
                                  items={this.state.content.sales}
                                  fields={sales}
                                  itemsPerPage={10}
                                  pagination
                                  scopedSlots={{
                                  show_details: (item) => {
                                      return (
                                        <td className="py-2">
                                            <CButton size="sm" color="info" to={`/Sales/edit/${item.id}`}>Edit</CButton>
                                            <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSales(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                        </td>
                                      );
                                  },
                                  }}
                              />
                          </CCardBody>
                      </CCol>
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
