import { Fragment, React, useState, useEffect, Component } from "react";
import "./Pabrik.css";
import "./PabrikMedia.css";
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
import UserService from '../services/user.service';
import showResults from './showResults/showResults';
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

export default class ListRequestData extends Component {
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
    UserService.getAdminLRD().then(
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

  approveRD = (item) => {
    this.setState({
      loading: true,
    });

    console.log(item.id);

    const formData = new FormData();
    formData.append('requestDataId',item.id);
    formData.append('status', 'Approve');
    console.log(formData);

    UserService.ApproveRequestData(formData).then(
      async (response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
        showResults("Diapprove");
      },
        (error) => {
        }
      );

    UserService.getAdminLRD().then((response) => {
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

  };

  changeSRD = (item) => {
    this.setState({
      loading: true,
    });

    UserService.changeSRD(item).then(
      async (response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
        showResults("Diupdate");
      },
        (error) => {
        }
      );

    UserService.getAdminLRD().then((response) => {
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

  };

  rejectRD = (item) => {
    this.setState({
      loading: true,
    });

    console.log(item.id);

    const formData = new FormData();
    formData.append('requestDataId',item.id);
    formData.append('status', 'Reject');
    console.log(formData);

    UserService.ApproveRequestData(formData).then(
      async (response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
        showResults("Direject");
      },
        (error) => {
        }
      );

    UserService.getAdminLRD().then((response) => {
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

  };

  render() {
    const override = `
      display: block;
      margin: 0 auto;
      border-color: red;
      `
    ;

    const RequestData = [
      { key: "address_wallet", label: "Wallet"},
      { key: "data", label: "Data"},
      { key: "email", label: "Email"},
      { key: "status", label: "Status"},
      { key: "name", label: "Name"},
      { key: "created_at", label: "Date"},
      {
        key: "aksi",
        label: "Aksi",
        _style: { width: "10%" },
        filter: false,
      },
    ];

    const Data = [
      { key: "signer", label: "Wallet"},
      { key: "data", label: "Data"},
      { key: "status", label: "Status"},
      { key: "created_at", label: "Date"},
      {
        key: "dataControl",
        label: "Aksi",
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
                          <h5>Sedang diproses</h5><br></br>
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
                      <CTabs>
                        <CNav variant="tabs">
                          <CNavItem>
                            <CNavLink>List Request Data</CNavLink>
                          </CNavItem>
                          <CNavItem>
                            <CNavLink>Data</CNavLink>
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
                                      <h4 style={{ margin: "auto" }}>List Request Data</h4>
                                    </CCol>
                                  </CRow>
                                </CCardHeader>
                                <CCardBody>
                                  <CDataTable
                                    items={this.state.content.listRequestData}
                                    fields={RequestData}
                                    itemsPerPage={10}
                                    tableFilter
                                    cleaner
                                    itemsPerPageSelect
                                    hover
                                    sorter
                                    pagination
                                    scopedSlots={{
                                      aksi: (item) => {
                                        return (
                                          <td className="py-2">
                                            {(() => {
                                              if(item.status === 'Waiting') {
                                                return(
                                                  <div>
                                                    <CButton size="sm" color="info" onClick={() => this.approveRD(item)}>Approve</CButton>
                                                    <CButton size="sm" color="danger" className="ml-1" onClick={() => this.rejectRD(item)}>Reject</CButton>
                                                  </div>
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
                                    items={this.state.content.requestDataControl}
                                    fields={Data}
                                    tableFilter
                                    cleaner
                                    itemsPerPageSelect
                                    hover
                                    sorter
                                    pagination
                                    scopedSlots={{
                                      status: (item) => {
                                        return(
                                          <td>
                                            {(() => {
                                              if(item.status === 1) {
                                                return(
                                                  'Allow'
                                                )
                                              } else {
                                                return(
                                                  'Disallow'
                                                )
                                              }
                                            })()}
                                          </td>
                                        )
                                      },
                                      dataControl: (item) => {
                                        return (
                                          <td className="py-2">
                                            {(() => {
                                              if(item.status === 1) {
                                                return(
                                                  <CButton size="sm" color="danger" onClick={() => this.changeSRD(item.id)} >Disallow</CButton>
                                                )
                                              } else {
                                                return(
                                                  <CButton size="sm" color="success" onClick={() => this.changeSRD(item.id)} >Allow</CButton>
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
