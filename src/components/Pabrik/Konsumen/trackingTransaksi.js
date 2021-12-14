import { Fragment, React, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import { withRouter } from "react-router";
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

class TrackingTransaksi extends Component {
    constructor(props) {
        super(props);

        this.state = {
        content: "",
        loading: false,
        color: "#3c4b64",
        TxnHash: null,
        transaksi: null,
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const hash = this.props.match.params.hash;
        this.setState({
            TxHash: hash,
            transaksi: id,
        })


    }

  render() {
    const override = `
      display: block;
      margin: 0 auto;
      border-color: red;
      `
    ;

    return (
      <Fragment>
        <main className="c-main">
            <div className="container-fluid">
                <CCard>
                    <CCardBody>
                        <CCol xs="12">
                            <CCardHeader>
                                <CRow>
                                    <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                                        <h4 style={{ margin: "auto" }}>Transaction</h4>
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                                <h3>Track</h3>
                                <CFormGroup>
                                    
                                </CFormGroup>
                            </CCardBody>
                        </CCol>
                    </CCardBody>
                </CCard>
            </div>
        </main>
      </Fragment>
    );
  }
}


export default withRouter(TrackingTransaksi);