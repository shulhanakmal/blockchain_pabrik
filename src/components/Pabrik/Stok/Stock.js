import { Fragment, React, Component } from "react";
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
  CTabContent,
  CTabPane,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import UserService from "../../../services/user.service";
import moment from 'moment';
import { AddStock } from "../../../abi/addStock";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Web3 from "web3";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

export default class Stock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      loading: false,
      TxnHash: "",
      setErr: false,
    };
  }

  componentDidMount() {
    UserService.getStock().then(
      (response) => {
          console.log(response.data);
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

  postDataStock = async (item) => {

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
        const updateDataStock = new FormData();
        let contractStok = new ethers.Contract(process.env.REACT_APP_ADDRESS_STOCK, AddStock, signer)
        let transactionStok = await contractStok.addStock(item.id, json, 'normal', dateString, {
          gasPrice: 7909680,
        })
          this.setState({
            TxnHash: transactionStok.hash,
          });
          updateDataStock.append('transaction', transactionStok.hash);
          updateDataStock.append('wallet', transactionStok.from);
        await transactionStok.wait()

        updateDataStock.append('id', item.id);
        updateDataStock.append('flag', 'Stock');
        UserService.addStockTransactionHash(updateDataStock);
        this.setState({
          TxnHash: '',
        });
        alert('Data berhasil ditulis ke blockchain');
      } catch(e) {
        console.log(e);
        this.setState({
          setErr: true,
        });
        alert(e.message);
      }
      this.setState({
        loading: false,
      });

    } else {
      this.setState({
        loading: false,
      });
      alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
    }

    UserService.getStock().then(
      (response) => {
          console.log(response.data);
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

    const stock = [
      { key: "date", label: "Date", _style: { width: "10%" } },
      { key: "cane", label: "Cane", _style: { width: "10%" } },
      { key: "rs", label: "Raw", _style: { width: "10%" } },
      { key: "proses", label: "Process", _style: { width: "30%" } },
      { key: "volume", label: "Volume", _style: { width: "10%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "20%" },
        filter: false,
      },
    ];

    const product = [
      { key: "product_id", label: "Product", _style: { width: "15%" } },
      { key: "sugar", label: "Sugar", _style: { width: "15%" } },
      { key: "volume", label: "Volume", _style: { width: "15%" } },
      { key: "created_at", label: "Date", _style: { width: "15%" } },
    ];

    return (
      <Fragment>
        {(() => {
          if (this.state.loading === true) {
            return (
              <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                <div className="sweet-loading">
                  <h5>Transaksi Stock akan ditulis ke Blockchain</h5><br></br>
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
                    {/* <CCardBody>
                      <CCol xs="12">
                          <CCardHeader>
                              <CRow>
                                  <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                                      <h4 style={{ margin: "auto" }}>Stock</h4>
                                  </CCol>
                              </CRow>
                          </CCardHeader>
                          <CCardBody>
                              <CDataTable
                                  items={this.state.content.stock}
                                  fields={stock}
                                  itemsPerPage={10}
                                  pagination
                                  scopedSlots={{
                                  show_details: (item) => {
                                      return (
                                      <td className="py-2">
                                          <CButton size="sm" color="info">Edit</CButton>
                                          <CButton size="sm" color="danger" className="ml-1" onClick={() => {}}>Delete</CButton>
                                      </td>
                                      );
                                  },
                                  }}
                              />
                          </CCardBody>
                      </CCol>
                    </CCardBody> */}

                    <CCardBody>
                      <CTabs>
                        <CNav variant="tabs">
                          <CNavItem>
                            <CNavLink>Stock Sugar</CNavLink>
                          </CNavItem>
                          <CNavItem>
                            <CNavLink>Stock Product</CNavLink>
                          </CNavItem>
                        </CNav>
                        <CTabContent>
                          <CTabPane>
                            <CRow>
                              <CCol xs="12">
                                <CCardHeader>
                                    <CRow>
                                        <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                                            <h4 style={{ margin: "auto" }}>Stock</h4>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                  <CDataTable
                                    items={this.state.content.stock}
                                    fields={stock}
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
                                      show_details: (item) => {
                                        return (
                                        <td className="py-2" align="center">
                                            {/* <CButton size="sm" color="info">Edit</CButton>
                                            <CButton size="sm" color="danger" className="ml-1" onClick={() => {}}>Delete</CButton> */}
                                            {(() => {
                                              if(!item.transaction_hash) {
                                                return (
                                                  // <CButton size="sm" color="primary" style={{'color': 'white'}} to={`/Production/add-mitra/msc/${item.id}`} >Tulis Ke Blockchain</CButton>
                                                  <CButton size="sm" color="primary" style={{'color': 'white'}} onClick={() => this.postDataStock(item)} >Tulis Ke Blockchain</CButton>
                                                )
                                              } else {
                                                return (
                                                  <CButton href={`https://ropsten.etherscan.io/tx/${item.transaction_hash}`} target="_blank" size="sm" color="info" style={{'color': 'white'}} >Berhasil di tulis ke blockchain</CButton>
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
                                      <h4 style={{ margin: "auto" }}>Production Data</h4>
                                    </CCol>
                                  </CRow>
                                </CCardHeader>
                                <CCardBody>
                                  <CDataTable
                                    items={this.state.content.product}
                                      fields={product}
                                    itemsPerPage={10}
                                    tableFilter
                                    cleaner
                                    itemsPerPageSelect
                                    hover
                                    sorter
                                    pagination
                                    scopedSlots={{
                                      created_at: (item) => {
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
                                              <CButton size="sm" color="info">Edit</CButton>
                                              <CButton size="sm" color="danger" className="ml-1" onClick={() => {}}>Delete</CButton>
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
