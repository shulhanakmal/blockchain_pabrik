import { Fragment, React, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import { Redirect, Link } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CFormGroup,
  CInput
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

export default class Konsumen extends Component {
    constructor(props) {
        super(props);
        this.TxHashInput = this.TxHashInput.bind(this);
        this.GetTransaction = this.GetTransaction.bind(this);

        this.state = {
        content: "",
        loading: false,
        color: "#3c4b64",
        TxnHash: "",
        link: null,
        };
    }

    TxHashInput(e) {
        this.setState({
            TxnHash: e.target.value,
        });
    }

    async GetTransaction() {
        const transaksi = this.state.TxnHash;
        // transaksi.replaceAll("/", "_");
        console.log('cek setelah di replace string', transaksi.replaceAll("/", "_"));

        const formData = new FormData();
        formData.append('noDo',transaksi);

        if(this.state.TxnHash === '') {
            showResults(`Please fill the transaction hash`);
        } else {
            try {
                await UserService.getSalesTrasaction(formData).then(
                    (response) => {
                        console.log("cek responsenya nih mal: ", response);

                        if(response.data.success) {
                            if(response.data.sales.mount_sugar_sold_cane === 0) {
                                this.setState({
                                    link: 'detailProduk/rs/' + response.data.sales.id,
                                });
                            } else {
                                this.setState({
                                    link: 'detailProduk/cane/' + response.data.sales.id,
                                });
                            }
                        } else {
                            showResults(`${response.data.sales}`);
                        }

                        // this.setState({
                        //     link: `Konsumen/transaction/${response.data.data.id}/${response.data.data.transaksi_hash}`,
                        // })
                    }
                )
            } catch (e) {
                console.log(e);
            }
        }
    }

    // async trackData() {
    //     const transaksi = this.state.TxnHash;
    //     if(transaksi) {
    //         console.log('cek data mal', transaksi);
    //     } else {
    //         console.log('cek data mal', '1');
    //     }
    // }

    render() {
        const override = `
        display: block;
        margin: 0 auto;
        border-color: red;
        `
        ;

        if (this.state.link) {
            return <Redirect to={this.state.link} />;
        }

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
                                            <h4 style={{ margin: "auto" }}>Tracking Transaksi</h4>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                    <h3>Track</h3>
                                    <CFormGroup>
                                        <CRow>
                                            <CCol xs={11} md={11} lg={11} style={{ margin: "auto" }}>
                                                <CInput
                                                    className="textInput pabrik"
                                                    name="txHash"
                                                    placeholder="Input Nomor Dokumen..."
                                                    onChange={this.TxHashInput}
                                                    // onChange={(val) => this.setState({
                                                    //     TxnHash: val,
                                                    // })}
                                                />
                                            </CCol>
                                            <CCol xs={1} md={1} lg={1} style={{ margin: "auto" }}>
                                                <CButton
                                                    type="button"
                                                    size="sm"
                                                    color="info"
                                                    className="btn-pill"
                                                    onChange={(val) => this.setState({ TxnHash: val.target.value })}
                                                    // onClick={this.GetTransaction}
                                                    // style={{
                                                    // float: "right",
                                                    // }}
                                                >
                                                    <span style={{ color: "white" }} onClick={this.GetTransaction}>Track</span>
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CFormGroup>
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
