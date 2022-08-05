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
import moment from 'moment';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';

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
      proses: '',
      catchErr: false,
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

  // deleteSBSFC = (item) => {
  //   this.setState({
  //     loading: true,
  //   });

  //   UserService.deleteData('sbsfc', item.id).then(
  //     async (response) => {
  //       console.log(response)
  //       const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  //       const web3 = new Web3(provider);

  //       const accounts = await window.ethereum.enable();
  //       const akun = accounts[0];
  //       const storageContractCane = new web3.eth.Contract(StockCane, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
  //       const gas = await storageContractCane.methods.addLogisticsSbsfc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
  //       var post = await storageContractCane.methods.addLogisticsSbsfc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
  //       updateData.append('flag', 'stockBulkSugarFromCane');
  //       UserService.addLogisticsTransactionHash(updateData);

  //       this.setState({
  //         loading: false,
  //       });
  //       showResults("Dihapus");
  //       this.setState({
  //         TxnHash: "",
  //       });
  //     },
  //       (error) => {
  //       }
  //     );
  //   UserService.getListLogistic().then((response) => {
  //     this.setState({
  //       content: response.data,
  //     });
  //   });
  // };

  // deleteSBSFRS = (item) => {
  //   this.setState({
  //     loading: true,
  //   });

  //   UserService.deleteData('sbsfrs', item.id).then(
  //     async (response) => {
  //       console.log(response)
  //       const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  //       const web3 = new Web3(provider);

  //       const accounts = await window.ethereum.enable();
  //       const akun = accounts[0];
  //       const storageContractRs = new web3.eth.Contract(StockRS, '0x8fdb2D0eaD144FAc0f977747C5AB93Ad03eC2904');
  //       const gas = await storageContractRs.methods.addLogisticsSbsfrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
  //       var post = await storageContractRs.methods.addLogisticsSbsfrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
  //       updateData.append('flag', 'stockBulkSugarFromRs');
  //       UserService.addLogisticsTransactionHash(updateData);

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

  //   UserService.getListLogistic().then((response) => {
  //     this.setState({
  //       content: response.data,
  //     });
  //   });
  // };

  // deleteSOBS = (item) => {
  //   this.setState({
  //     loading: true,
  //   });

  //   UserService.deleteData('sobs', item.id).then(
  //     async (response) => {
  //       console.log(response)
  //       const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  //       const web3 = new Web3(provider);

  //       const accounts = await window.ethereum.enable();
  //       const akun = accounts[0];
  //       const storageContractStock = new web3.eth.Contract(StockOut, '0xdD61c2a97EaFF236B1643e387b966d778A8600a2');
  //       const gas = await storageContractStock.methods.addLogisticsSobs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
  //       var post = await storageContractStock.methods.addLogisticsSobs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
  //       updateData.append('flag', 'stockOutBulkSugar');
  //       UserService.addLogisticsTransactionHash(updateData);

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
  //   UserService.getListLogistic().then((response) => {
  //     this.setState({
  //       content: response.data,
  //     });
  //   });
  // };

  // deleteRBS = (item) => {
  //   this.setState({
  //     loading: true,
  //   });

  //   UserService.deleteData('rbs', item.id).then(
  //     async (response) => {
  //       console.log(response)
  //       const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  //       const web3 = new Web3(provider);

  //       const accounts = await window.ethereum.enable();
  //       const akun = accounts[0];
  //       const storageContractReturn = new web3.eth.Contract(Return, '0x0731b010C9AAEb70B9340a9Edeb555119d600C2f');
  //       const gas = await storageContractReturn.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'deleted', dateString).estimateGas();
  //       var post = await storageContractReturn.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'deleted', dateString).send({
  //       from: akun,
  //       gas,
  //       }, (error, transactionHash) => {
  //         console.log([error, transactionHash]);
  //         this.setState({
  //           TxnHash: transactionHash,
  //         });
  //       });

  //       // insert txn hash return ke database
  //       const updateData = new FormData();
  //       updateData.append('id', response.data.id);
  //       updateData.append('transaction', post.transactionHash);
  //       updateData.append('wallet', post.from);
  //       updateData.append('flag', 'returnBulkSugar');
  //       UserService.addLogisticsTransactionHash(updateData);

  //       // hapus data stock sugar
  //       if(response.data.data.sugar === 'cane'){
  //         const storageContractCane = new web3.eth.Contract(StockCane, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
  //         const gas = await storageContractCane.methods.addLogisticsSbsfc(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).estimateGas();
  //         var postSugar = await storageContractCane.methods.addLogisticsSbsfc(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).send({
  //         from: akun,
  //         gas,
  //         }, (error, transactionHash) => {
  //           console.log([error, transactionHash]);
  //         });

  //         // simpan hash
  //         const txnCane = new FormData();
  //         txnCane.append('id', response.data.sugar.id);
  //         txnCane.append('transaction', postSugar.transactionHash);
  //         txnCane.append('wallet', postSugar.from);
  //         txnCane.append('flag', 'stockBulkSugarFromCane');
  //         UserService.addLogisticsTransactionHash(txnCane);
  //       } else {
  //         const storageContractRs = new web3.eth.Contract(StockRS, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
  //         const gas = await storageContractRs.methods.addLogisticsSbsfrs(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).estimateGas();
  //         var postSugar = await storageContractRs.methods.addLogisticsSbsfrs(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'deleted', dateString).send({
  //         from: akun,
  //         gas,
  //         }, (error, transactionHash) => {
  //           console.log([error, transactionHash]);
  //         });

  //         // simpan hash
  //         const txnRS = new FormData();
  //         txnRS.append('id', response.data.sugar.id);
  //         txnRS.append('transaction', postSugar.transactionHash);
  //         txnRS.append('wallet', postSugar.from);
  //         txnRS.append('flag', 'stockBulkSugarFromRs');
  //         UserService.addLogisticsTransactionHash(txnRS);
  //       }

  //       this.setState({
  //         loading: false,
  //         TxnHash: "",
  //       });
  //       showResults("Dihapus");
  //     },
  //       (error) => {
  //     }
  //   );
  //   UserService.getListLogistic().then((response) => {
  //     this.setState({
  //       content: response.data,
  //     });
  //   });
  // };

  postDataSBSFC = async (item) => {

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
      this.setState({
        proses: 'Stock Bulk Sugar From Cane',
      });
      try{
        const updateData = new FormData();
        let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, StockCane, signer)
        let transaction = await contract.addLogisticsSbsfc(item.id, json, 'normal', dateString, {
          gasPrice: 7909680,
        })
          updateData.append('transaction', transaction.hash);
          updateData.append('wallet', transaction.from);
          this.setState({
            TxnHash: transaction.hash,
          });
        await transaction.wait()

        updateData.append('id', item.id);
        updateData.append('flag', 'stockBulkSugarFromCane');
        UserService.addLogisticsTransactionHash(updateData);
        this.setState({
          TxnHash: '',
        });
        alert("Data Berhasil Dimasukkan");
      } catch(e) {
        console.log(e);
        this.setState({
          err: true,
        });
      }

    }

    this.setState({
      loading: false,
    });

    if(this.state.catchErr) {
      this.setState({
        loading: false,
      });
      console.log(this.state.catchErr);
    } else if(chainId != parseInt(process.env.REACT_APP_CHAIN_ID)){
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    } else {
      this.setState({
        loading: false,
        proses: '',
      });
    }

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

  postDataSBSFRS = async (item) => {

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
      this.setState({
        proses: 'Stock Bulk Sugar From Raw Sugar',
      });
      try{
        const updateData = new FormData();
        let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, StockRS, signer)
        let transaction = await contract.addLogisticsSbsfrs(item.id, json, 'normal', dateString,{
          gasPrice: 7909680,
        })
          updateData.append('transaction', transaction.hash);
          updateData.append('wallet', transaction.from);
          this.setState({
            TxnHash: transaction.hash,
          });
        await transaction.wait()

        updateData.append('id', item.id);
        updateData.append('flag', 'stockBulkSugarFromRs');
        UserService.addLogisticsTransactionHash(updateData);
        this.setState({
          TxnHash: "",
        });
        alert("Data Berhasil Dimasukkan");
      } catch(e) {
        console.log(e);
        this.setState({
          err: true,
        });
      }

    }

    this.setState({
      loading: false,
    });

    if(this.state.catchErr) {
      this.setState({
        loading: false,
      });
      console.log(this.state.catchErr);
    } else if(chainId != parseInt(process.env.REACT_APP_CHAIN_ID)){
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    } else {
      this.setState({
        loading: false,
        proses: '',
      });
    }

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

  postDataSOBS = async (item) => {

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
      this.setState({
        proses: 'Stock Out Bulk Sugar',
      });
      try{
        const updateData = new FormData();
        let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SOBS, StockOut, signer)
        let transaction = await contract.addLogisticsSobs(item.id, json, 'normal', dateString, {
          gasPrice: 7909680,
        })
          updateData.append('transaction', transaction.hash);
          updateData.append('wallet', transaction.from);
          this.setState({
            TxnHash: transaction.hash,
          });
        await transaction.wait()

        updateData.append('id', item.id);
        updateData.append('flag', 'stockOutBulkSugar');
        UserService.addLogisticsTransactionHash(updateData);
        this.setState({
          TxnHash: '',
        });
        alert("Data Berhasil Dimasukkan");
      } catch(e) {
        console.log(e);
        this.setState({
          err: true,
        });
      }

    }

    this.setState({
      loading: false,
    });

    if(this.state.catchErr) {
      this.setState({
        loading: false,
      });
      console.log(this.state.catchErr);
    } else if(chainId != parseInt(process.env.REACT_APP_CHAIN_ID)){
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    } else {
      this.setState({
        loading: false,
        proses: '',
      });
    }

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

  postDataRBS = async (item) => {

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
      this.setState({
        proses: 'Return Bulk Sugar',
      });
      try{
        const updateData = new FormData();
        let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_RBS, Return, signer)
        let transaction = await contract.addLogisticsRbs(item.id, json, 'normal', dateString, {
          gasPrice: 7909680,
        })
          updateData.append('transaction', transaction.hash);
          updateData.append('wallet', transaction.from);
          this.setState({
            TxnHash: transaction.hash,
          });
        await transaction.wait()

        updateData.append('id', item.id);
        updateData.append('flag', 'returnBulkSugar');
        UserService.addLogisticsTransactionHash(updateData);
        this.setState({
          TxnHash: '',
        });
        alert("Data Berhasil Dimasukkan");
      } catch(e) {
        console.log(e);
        this.setState({
          err: true,
        });
      }

    }

    this.setState({
      loading: false,
    });

    if(this.state.catchErr) {
      this.setState({
        loading: false,
      });
      console.log(this.state.catchErr);
    } else if(chainId != parseInt(process.env.REACT_APP_CHAIN_ID)){
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    } else {
      this.setState({
        loading: false,
        proses: '',
      });
    }

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
                            <h5>Transaksi {this.state.proses} akan ditulis ke Blockchain</h5><br></br>
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
                                          date: (item) => {
                                            return (
                                              <td className="py-2">
                                                <div>
                                                  {moment(item.date).format('DD/MMM/YYYY')}
                                                </div>
                                              </td>
                                            )
                                          },
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
                                                          <CButton size="sm" color="warning" style={{'color': 'white'}} to={`/Production/add-mitra/sbsfc/${item.id}`} >Add Mitra</CButton>
                                                        )
                                                      }
                                                  })()}
                                                </div>
                                              </td>
                                            );
                                          },
                                          show_details: (item) => {
                                            return(
                                              <td className="py-2">
                                                {(() => {
                                                  if(!item.transaction_hash && item.product_id && item.volume) {
                                                    return (
                                                      <CButton size="sm" color="primary" style={{'color': 'white'}} onClick={() => this.postDataSBSFC(item)} >Tulis Ke Blockchain</CButton>
                                                    )
                                                  } else if(item.product_id && item.volume){
                                                    return (
                                                      <CButton href={`https://ropsten.etherscan.io/tx/${item.transaction_hash}`} target="_blank" size="sm" color="info" style={{'color': 'white'}} >Berhasil di tulis ke blockchain</CButton>
                                                    )
                                                  } else {
                                                    return (
                                                      <>
                                                      </>
                                                    )
                                                  }
                                                })()}

                                                {(() => {
                                                  if(item.no_do) {
                                                    console.log('cek nodo', item.no_do);
                                                    let nodo = item.no_do.replaceAll("/", "_")
                                                    return (
                                                      <CButton size="sm" color="warning" className="ml-1" to={`detailReturn/${nodo}/${item.product_id}`} style={{ color: "white" }} >Check</CButton>
                                                    );
                                                  }
                                                })()}

                                                {' '}
                                                {(() => {
                                                  if(item.volume){
                                                    return(
                                                      <CButton size="sm" color="dark" to={`/ProsesBlockchain/sbsfc/${item.product_id}`}>Proses Blockchain</CButton>
                                                    )
                                                  }
                                                })()}
                                              </td>
                                            )
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
                                          date: (item) => {
                                            return (
                                              <td className="py-2">
                                                <div>
                                                  {moment(item.date).format('DD/MMM/YYYY')}
                                                </div>
                                              </td>
                                            )
                                          },
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
                                                          <CButton size="sm" color="warning" style={{'color': 'white'}} to={`/Production/add-mitra/sbsfrs/${item.id}`} >Add Mitra</CButton>
                                                        )
                                                      }
                                                  })()}
                                                </div>
                                              </td>
                                            );
                                          },
                                          show_details: (item) => {
                                            return(
                                              <td className="py-2">
                                                {(() => {
                                                  if(!item.transaction_hash && item.product_id && item.volume) {
                                                    return (
                                                      <CButton size="sm" color="primary" style={{'color': 'white'}} onClick={() => this.postDataSBSFRS(item)} >Tulis Ke Blockchain</CButton>
                                                    )
                                                  } else if(item.product_id && item.volume){
                                                    return (
                                                      <CButton href={`https://ropsten.etherscan.io/tx/${item.transaction_hash}`} target="_blank" size="sm" color="info" style={{'color': 'white'}} >Berhasil di tulis ke blockchain</CButton>
                                                    )
                                                  } else {
                                                    return (
                                                      <>
                                                      </>
                                                    )
                                                  }
                                                })()}

                                                {(() => {
                                                  if(item.no_do) {
                                                    console.log('cek nodo', item.no_do);
                                                    let nodo = item.no_do.replaceAll("/", "_")
                                                    return (
                                                      <CButton size="sm" color="warning" className="ml-1" to={`detailReturn/${nodo}/${item.product_id}`} style={{ color: "white" }} >Check</CButton>
                                                    );
                                                  }
                                                })()}

                                                {' '}
                                                {(() => {
                                                  if(item.volume){
                                                    return(
                                                      <CButton size="sm" color="dark" to={`/ProsesBlockchain/sbsfrs/${item.product_id}`}>Proses Blockchain</CButton>
                                                    )
                                                  }
                                                })()}

                                              </td>
                                            )
                                          },
                                          // show_details: (item) => {
                                          //   if(item.no_do) {
                                          //     let dok = item.no_do.replaceAll("/", "_")
                                          //     return (
                                          //       <td className="py-2">
                                          //         {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                          //         {/* <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSBSFRS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton> */}
                                          //         <CButton size="sm" color="warning" className="ml-1" to={`detailReturn/${dok}`} style={{ color: "white" }} >Check</CButton>
                                          //       </td>
                                          //     );
                                          //   } else {
                                          //     return (
                                          //       <td className="py-2">
                                          //         {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                          //         {/* <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSBSFRS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton> */}
                                          //       </td>
                                          //     );
                                          //   }
                                          // },
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
                                                {/* <CButton size="sm" color="info" to={`/Logistic/edit/sobs/${item.id}`}>Edit</CButton> */}
                                                {/* <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSOBS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton> */}
                                                {(() => {
                                                  if(!item.transaction_hash && item.volume) {
                                                    return (
                                                      <CButton size="sm" color="primary" style={{'color': 'white'}} onClick={() => this.postDataSOBS(item)} >Tulis Ke Blockchain</CButton>
                                                    )
                                                  } else if(item.volume){
                                                    return (
                                                      <CButton href={`https://ropsten.etherscan.io/tx/${item.transaction_hash}`} target="_blank" size="sm" color="info" style={{'color': 'white'}} >Berhasil di tulis ke blockchain</CButton>
                                                    )
                                                  } else {
                                                    return (
                                                      <>
                                                      </>
                                                    )
                                                  }
                                                })()}

                                                {' '}
                                                {(() => {
                                                  if(item.volume){
                                                    return(
                                                      <CButton size="sm" color="dark" to={`/ProsesBlockchain/sobs/${item.id}`}>Proses Blockchain</CButton>
                                                    )
                                                  }
                                                })()}
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
                                                {/* <CButton size="sm" color="info" to={`/Logistic/edit/return/${item.id}`}>Edit</CButton> */}
                                                {/* <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteRBS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton> */}
                                                {(() => {
                                                  if(!item.transaction_hash && item.product_id && item.volume) {
                                                    return (
                                                      <CButton size="sm" color="primary" style={{'color': 'white'}} onClick={() => this.postDataRBS(item)} >Tulis Ke Blockchain</CButton>
                                                    )
                                                  } else if(item.product_id && item.volume){
                                                    return (
                                                      <CButton href={`https://ropsten.etherscan.io/tx/${item.transaction_hash}`} target="_blank" size="sm" color="info" style={{'color': 'white'}} >Berhasil di tulis ke blockchain</CButton>
                                                    )
                                                  } else {
                                                    return (
                                                      <>
                                                      </>
                                                    )
                                                  }
                                                })()}

                                                {' '}
                                                {(() => {
                                                  if(item.volume){
                                                    return(
                                                      <CButton size="sm" color="dark" to={`/ProsesBlockchain/rbs/${item.id}`}>Proses Blockchain</CButton>
                                                    )
                                                  }
                                                })()}
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
