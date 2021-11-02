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
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

export default class RequestDataListExt extends Component {
    constructor(props) {
        super(props);
        const { signer } = props;
        const { data } = props;

        this.state = {
        content: data,
        loading: false,
        color: "#3c4b64",
        TxnHash: "",
        account: signer      
        };
    }

    render() {
        const override = `
        display: block;
        margin: 0 auto;
        border-color: red;
        `
        ;

        const dataRequest = [
            { key: "address_wallet", label: "Wallet"},
            { key: "data", label: "Request Data"},
            { key: "status", label: "Status"},
            { key: "approved_by", label: "Approve"},
            {
                key: "aksi",
                label: "Aksi",
                filter: false,
            },
        ];

        return (
            <Fragment>
                <main className="c-main">
                    <div className="container-fluid">
                        <CCard>
                            <CCardBody>
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
                                                    <h4 style={{ margin: "auto" }}>List Requested Data</h4>
                                                </CCol>
                                            </CRow>
                                        </CCardHeader>
                                        <CCardBody>
                                            <CDataTable
                                            items={this.state.content.data}
                                            fields={dataRequest}
                                            itemsPerPage={10}
                                            pagination
                                            scopedSlots={{
                                                aksi: (item) => {
                                                return (
                                                    <td className="py-2">
                                                        <CButton size="sm" color="info" >Get Data</CButton>
                                                    </td>
                                                );
                                                },
                                            }}
                                            />
                                        </CCardBody>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </div>
                </main>
            </Fragment>
        );
    }
}
