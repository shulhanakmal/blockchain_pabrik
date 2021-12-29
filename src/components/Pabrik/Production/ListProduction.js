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
import showResults from "../../showResults/showResults";
import UserService from "../../../services/user.service";
import Web3 from "web3";
import { AddProduct as MSC } from "../../../abi/productionMsc";
import { AddProduct as PRS} from "../../../abi/productionPrs";
import { AddProduct as SFC} from "../../../abi/productionSfc";
import { AddProduct as SFRS} from "../../../abi/productionSfrs";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

export default class ListProduction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      loading: false,
      color: "#3c4b64",
      TxnHash: "",
      account: '',
      sugar: '',
      volume: ''
    };
  }

  componentDidMount() {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);
    provider.engine.stop();

    // const getWallet = async () => {
    //   web3.eth.getAccounts(function(err, accounts){
    //       if (err != null) {
    //           // alert("An error occurred: "+err);
    //       } else if (accounts.length == 0) {
    //           alert("User is not logged in to MetaMask");
    //       } else {
    //           this.setState({
    //             account: accounts[0],
    //           });
    //       }
    //   });
    // };

    // getWallet();

    UserService.getListProduction().then(
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

  deleteMSC = (item) => {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);

    this.setState({
      loading: true,
    });

    UserService.deleteData('msc', item.id).then(
      async (response) => {
        console.log(response)
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const msc = new web3.eth.Contract(MSC, '0xA2E320F53a57EFe583A3ddfB5a29bacDa944f4fd');
        const gas = await msc.methods.addProductionMsc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var postMSC = await msc.methods.addProductionMsc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
        updateData.append('transaction', postMSC.transactionHash);
        updateData.append('wallet', postMSC.from);
        updateData.append('flag', 'milledSugarCane');
        UserService.addProdcutionTransactionHash(updateData);

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

    UserService.getListProduction().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  deletePRS = (item) => {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);

    this.setState({
      loading: true,
    });

    UserService.deleteData('prs', item.id).then(
      async (response) => {
        console.log(response)
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const prs = new web3.eth.Contract(PRS, '0xEBd34C9958E1e921a2359DEd83b9e7945Af720E4');
        const gas = await prs.methods.addProductionPrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var postPRS = await prs.methods.addProductionPrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
        updateData.append('transaction', postPRS.transactionHash);
        updateData.append('wallet', postPRS.from);
        updateData.append('flag', 'processedRs');
        UserService.addProdcutionTransactionHash(updateData);

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

    UserService.getListProduction().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  deleteSFC = (item) => {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);

    this.setState({
      loading: true,
    });

    UserService.deleteData('sc', item.id).then(
      async (response) => {
        console.log(response)
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const sfc = new web3.eth.Contract(SFC, '0xF7e31a64761a538413333812EC150184fC42b475');
        const gas = await sfc.methods.addProductionSfc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var postSFC = await sfc.methods.addProductionSfc(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
        updateData.append('transaction', postSFC.transactionHash);
        updateData.append('wallet', postSFC.from);
        updateData.append('flag', 'sugarCane');
        UserService.addProdcutionTransactionHash(updateData);

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

    UserService.getListProduction().then((response) => {
      this.setState({
        content: response.data,
      });
    });
  };

  deleteSFRS = (item) => {
    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);

    this.setState({
      loading: true,
    });

    UserService.deleteData('sfrs', item.id).then(
      async (response) => {
        console.log(response)
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const sfrs = new web3.eth.Contract(SFRS, '0x855DeEff0EC2169F3798075e7c402389B88bFF11');
        const gas = await sfrs.methods.addProductionSfrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).estimateGas();
        var postSFRS = await sfrs.methods.addProductionSfrs(response.data.id, response.data.date, response.data.volume, 'deleted', dateString).send({
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
        updateData.append('transaction', postSFRS.transactionHash);
        updateData.append('wallet', postSFRS.from);
        updateData.append('flag', 'sugarFromRs');
        UserService.addProdcutionTransactionHash(updateData);

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

    UserService.getListProduction().then((response) => {
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

    const milledSugarCane = [
      { key: "date", label: "Date", _style: { width: "30%" } },
      { key: "product_id", label: "Product", _style: { width: "20%" } },
      { key: "show_volume", label: "Volume", _style: { width: "30%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const processedRS = [
      { key: "date", label: "Date", _style: { width: "30%" } },
      { key: "product_id", label: "Product", _style: { width: "20%" } },
      { key: "show_volume", label: "Volume", _style: { width: "30%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const sugarCane = [
      { key: "date", label: "Date", _style: { width: "30%" } },
      { key: "product_id", label: "Product", _style: { width: "20%" } },
      { key: "show_volume", label: "Volume", _style: { width: "30%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const sugarFromRS = [
      { key: "date", label: "Date", _style: { width: "30%" } },
      { key: "product_id", label: "Product", _style: { width: "20%" } },
      { key: "show_volume", label: "Volume", _style: { width: "30%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const excessSugar = [
      { key: "date", label: "Date", _style: { width: "30%" } },
      { key: "proses", label: "Product", _style: { width: "40%" } },
      { key: "volume", label: "Volume", _style: { width: "30%" } },
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
                      <CCard>
                        <CCardBody>
                          <CTabs>
                            <CNav variant="tabs">
                              <CNavItem>
                                <CNavLink>Milled Sugar Cane</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Processed RS</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Sugar Cane</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Sugar From RS</CNavLink>
                              </CNavItem>
                              <CNavItem>
                                <CNavLink>Excess Sugar</CNavLink>
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
                                          <h4 style={{ margin: "auto" }}>Production Data</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Production/tambah-milled-sugar-cane"
                                          >
                                            Add Data
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.milledSugarCane}
                                        fields={milledSugarCane}
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
                                            return (
                                              <td className="py-2">
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteMSC(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
                                                {/* <CButton size="sm" color="info" to={`/Production/edit/msc/${item.id}`}>Edit</CButton> */}
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
                                          <h4 style={{ margin: "auto" }}>Production Data</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Production/tambah-processed-rs"
                                          >
                                            Add Data
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.processedRS}
                                        fields={processedRS}
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
                                                          <CButton size="sm" color="warning" style={{'color': 'white'}} to={`/Production/add-mitra/prs/${item.id}`} >Add Mitra</CButton>
                                                        )
                                                      }
                                                  })()}
                                                </div>
                                              </td>
                                            );
                                          },
                                          show_details: (item) => {
                                            return (
                                              <td className="py-2">
                                                {/* <CButton size="sm" color="info" to={`/Production/edit/prs/${item.id}`}>Edit</CButton> */}
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deletePRS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
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
                                          <h4 style={{ margin: "auto" }}>Production Data</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Production/tambah-sugar-cane"
                                          >
                                            Add Data
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.sugarCane}
                                        fields={sugarCane}
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
                                                          <CButton size="sm" color="warning" style={{'color': 'white'}} to={`/Production/add-mitra/sc/${item.id}`} >Add Mitra</CButton>
                                                        )
                                                      }
                                                  })()}
                                                </div>
                                              </td>
                                            );
                                          },
                                          show_details: (item) => {
                                            return (
                                              <td className="py-2">
                                                {/* <CButton size="sm" color="info" to={`/Production/edit/sfc/${item.id}`}>Edit</CButton> */}
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSFC(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
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
                                          <h4 style={{ margin: "auto" }}>Production Data</h4>
                                        </CCol>
                                        <CCol>
                                          <CButton
                                            block
                                            color="dark"
                                            to="/Production/tambah-sugar-from-rs"
                                          >
                                            Add Data
                                          </CButton>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.sugarFromRS}
                                        fields={sugarFromRS}
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
                                            return (
                                              <td className="py-2">
                                                {/* <CButton size="sm" color="info" to={`/Production/edit/sfrs/${item.id}`}>Edit</CButton> */}
                                                <CButton size="sm" color="danger" className="ml-1" onClick={() => this.deleteSFRS(item)}style={{ backgroundColor: "#e2602c" }}>Delete</CButton>
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
                                          <h4 style={{ margin: "auto" }}>Production Data Excess Sugar</h4>
                                        </CCol>
                                      </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                      <CDataTable
                                        items={this.state.content.excessSugar}
                                        fields={excessSugar}
                                        itemsPerPage={10}
                                        tableFilter
                                        cleaner
                                        itemsPerPageSelect
                                        hover
                                        sorter
                                        pagination
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
