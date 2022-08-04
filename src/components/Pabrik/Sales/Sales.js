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
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { AddSales } from "../../../abi/sales";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";
import moment from 'moment';
import QRcode from "qrcode.react";

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
      err: false,
      qr: 'test',
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

  handleChange = (value) => {
    this.setState({
      qr: value,
    });
  };

  downloadQR = (salesId) => {
    const canvas = document.getElementById("myqr");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "" + salesId + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  postDataSales = async (item) => {

    this.setState({
      loading: true,
    });

    let  json = JSON.stringify(item, null, 4).replace(/[",\\]]/g, "")

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const {chainId} = await provider.getNetwork();
    const signer = provider.getSigner();
    
    if(chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
      try{
        const updateData = new FormData();
        let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SALES, AddSales, signer)
        let transaction = await contract.addSales(item.id, json, 'normal', dateString, {
          gasPrice: 7909680,
        })
          updateData.append('transaction', transaction.hash);
          updateData.append('wallet', transaction.from);
          this.setState({
            TxnHash: transaction.hash,
          });
        await transaction.wait()

        updateData.append('id', item.id);
        UserService.addSalesTransactionHash(updateData);
      } catch(e) {
        console.log(e);
        this.setState({
          err: true,
        });
      }

      const salesId = item.id;
      const linkQRCode =
        process.env.REACT_APP_PROD_URL +
        "detailProduk/" +
        item.sugar +
        "/" +
        item.id;
      await this.handleChange(linkQRCode);

      const canvas = document.getElementById("myqr");
      let imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      let formDataQR = new FormData();
      formDataQR.append("files_qr", imageBlob, "" + salesId + ".png");
      console.log("gambar qr", imageBlob, "" + salesId + ".png");
      formDataQR.append("fileName_qr", "" + salesId + ".png");

      this.downloadQR(item.id);

      UserService.pushQRCodeImage(salesId, formDataQR);

      if(this.state.err) {
        this.setState({
          loading: false,
        });
        console.log(this.state.err);
      } else {
        this.setState({
          loading: false,
        });
        showResults("Data berhasil dimasukan");
      }

      this.setState({
        TxnHash: '',
        loading: false,
      });
    } else {
      this.setState({
        loading: false,
      });
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    }

    this.setState({
      loading: false,
    });

    if(this.state.err) {
      this.setState({
        loading: false,
      });
      console.log(this.state.err);
    } else if(chainId != parseInt(process.env.REACT_APP_CHAIN_ID)){
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    } else {
      this.setState({
        loading: false,
      });
      alert("Data Berhasil Dimasukkan");
    }

    UserService.getSales().then((response)  => {
      this.setState({
        content: response.data,
      });
    });

  }

  // deleteSales = (item) => {
  //   const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  //   const web3 = new Web3(provider);

  //   const getWallet = async () => {
  //     web3.eth.getAccounts(function(err, accounts){
  //         if (err != null) {
  //             // alert("An error occurred: "+err);
  //         } else if (accounts.length == 0) {
  //             alert("User is not logged in to MetaMask");
  //         } else {
  //             this.setState({
  //               account: accounts[0],
  //             });
  //         }
  //     });
  //   };

  //   getWallet()

  //   this.setState({
  //     loading: true,
  //   });

  //   UserService.deleteData('sales', item.id).then(
  //     async (response) => {
  //       console.log(response.data);
  //       if(response.data.mount_sugar_sold_cane === '0.00') {
  //         this.setState({
  //           sugar: 'rs',
  //           volume: response.data.mount_sugar_sold_rs,
  //         })
  //       } else {
  //         this.setState({
  //           sugar: 'cane',
  //           volume: response.data.mount_sugar_sold_cane,
  //         })
  //       }
  //       const accounts = await window.ethereum.enable();
  //       const akun = accounts[0];
  //       const storageContract = new web3.eth.Contract(AddSales, '0xC974bc711392Faa384C633Eb0b941DbAA133d382');
  //       console.log(this.sugar);
  //       console.log(this.volume);
  //       const gas = await storageContract.methods.addSales(response.data.id, response.data.date, response.data.no_do, response.data.buyer, response.data.price, this.state.sugar, this.state.volume, 'deleted').estimateGas();
  //       var post = await storageContract.methods.addSales(response.data.id, response.data.date, response.data.no_do, response.data.buyer, response.data.price, this.state.sugar, this.state.volume, 'deleted').send({
  //       from: akun,
  //       gas,
  //       }, (error, transactionHash) => {
  //         console.log([error, transactionHash]);
  //         this.setState({
  //           TxnHash: transactionHash,
  //         });
  //       });

  //       // insert txn hash ke database
  //       const updateData = new FormData();
  //       updateData.append('id', response.data.id);
  //       updateData.append('transaction', post.transactionHash);
  //       updateData.append('wallet', post.from);
  //       UserService.addSalesTransactionHash(updateData);

  //       this.setState({
  //         loading: false,
  //       });
  //       showResults("Dihapus");
  //       this.setState({
  //         TxnHash: "",
  //       });
  //     },
  //       (error) => {
  //     }
  //   );
  //   UserService.getSales().then((response)  => {
  //     this.setState({
  //       content: response.data,
  //     });
  //   });
  // };

  render() {
    const override = `
      display: block;
      margin: 0 auto;
      border-color: red;
      `
    ;

    const sales = [
      { key: "date", label: "Date", _style: { width: "10%" } },
      { key: "no_do", label: "No", _style: { width: "20%" } },
      { key: "buyer", label: "Buyer", _style: { width: "15%" } },
      { key: "price", label: "Price", _style: { width: "8%" } },
      { key: "mount_sugar_sold_cane", label: "Cane", _style: { width: "8%" } },
      { key: "mount_sugar_sold_rs", label: "RS", _style: { width: "8%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "31%" },
        filter: false,
      },
    ];

    return (
      <Fragment>
        {(() => {
          if (this.state.loading === true) {
            return (
              <>
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
                <div style={{ visibility: "hidden" }}>
                  {this.state.qr ? (
                    <QRcode id="myqr" value={this.state.qr} size={320} includeMargin={true} />
                  ) : (
                    <p>No QR code preview</p>
                  )}
                </div>
              </>
            )
          } else {
            return (
              <>
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
                                    date: (item) => {
                                      return (
                                        <td className="py-2">
                                          <div>
                                            {moment(item.date).format('DD/MMM/YYYY')}
                                          </div>
                                        </td>
                                      )
                                    },
                                    show_details: (item) => {
                                        return (
                                          <td className="py-2">
                                            {(() => {
                                                if(!item.transaction_hash) {
                                                  return (
                                                    // <CButton size="sm" color="primary" style={{'color': 'white'}} to={`/Production/add-mitra/msc/${item.id}`} >Tulis Ke Blockchain</CButton>
                                                    <CButton size="sm" color="primary" style={{'color': 'white'}} onClick={() => this.postDataSales(item)} >Tulis Ke Blockchain</CButton>
                                                  )
                                                } else{
                                                  return (
                                                    <CButton href={`https://ropsten.etherscan.io/tx/${item.transaction_hash}`} target="_blank" size="sm" color="info" style={{'color': 'white'}} >Berhasil di tulis ke blockchain</CButton>
                                                  )
                                                }
                                            })()}
                                            {/* <CButton size="sm" color="info" to={`/Sales/edit/${item.id}`}>Edit</CButton> */}
                                            {/* <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSales(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton> */}
                                            {' '}
                                            <CButton size="sm" color="dark" to={`/ProsesBlockchain/sales/${item.id}`}>Proses Blockchain</CButton>
                                            {/* {(() => {
                                              if(item.volume){
                                                return(
                                                  <CButton size="sm" color="dark" to={`/ProsesBlockchain/sales/${item.product_id}`}>Proses Blockchain</CButton>
                                                )
                                              }
                                            })()} */}
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
                <div style={{ visibility: "hidden" }}>
                  {this.state.qr ? (
                    <QRcode id="myqr" value={this.state.qr} size={320} includeMargin={true} />
                  ) : (
                    <p>No QR code preview</p>
                  )}
                </div>
              </>
            )
          }
        })()}
      </Fragment>
    );
  }
}
