import { Fragment, React, Component } from "react";
import "./Pabrik.css";
import "./PabrikMedia.css";
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
import UserService from "../services/user.service";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";
import 'react-select2-wrapper/css/select2.css';
import Select2 from 'react-select2-wrapper';

require("dotenv").config();

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

var p = null;

export default class Farmer extends Component {
    constructor(props) {
        super(props);
        this.handlePetani = this.handlePetani.bind(this);
        this.GetTransaction = this.GetTransaction.bind(this);

        this.state = {
            content: null,
            loading: false,
            color: "#3c4b64",
            link: null,
            petani: null,
        };
    }

    componentDidMount() {
        UserService.getDataMitraTani().then(
          response => {
            this.setState({
                content: response.data.petani
            });
            
          },
          error => {
            this.setState({
              content:
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString()
            });
          }
        );
    }

    async handlePetani(e) {

        p = e.target.value;

    }

    async GetTransaction() {

        if(p === null) {

            alert(`Please select farmer`);

        } else {

            try {
                await UserService.TraceTransaksiPetani(p).then(
                    (response) => {
                        
                        if(response.data.success) {

                            this.setState({
                                link: `Farmer/Trace/${p}`,
                            })

                        } else {

                            alert(`${response.data.sales}`);

                        }

                    }
                )
            } catch (e) {
                console.log(e);
                alert(e.message);
            }
        }

    }

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
                if (this.state.loading === true || this.state.content === null) {
                    return (
                        <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                            <div className="sweet-loading">
                                <h5>Loading</h5><br></br>
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
                                            <h4 style={{ margin: "auto" }}>Trace Petani</h4>
                                        </CCol>
                                    </CRow>
                                </CCardHeader>
                                <CCardBody>
                                    <h3>Petani</h3>
                                    <CFormGroup>
                                        <CRow>
                                            <CCol xs={11} md={11} lg={11} style={{ margin: "auto" }}>
                                                <Select2
                                                    className="textInput pabrik"
                                                    name={`petani`}
                                                    onChange={(e) => this.handlePetani(e)}
                                                    data={ 
                                                        this.state.content && this.state.content.map((value) => {
                                                            return(
                                                                { text: value.nama_petani, id: value.id }
                                                            )
                                                        })
                                                    }
                                                    options={{
                                                        placeholder: 'search by tags',
                                                    }}
                                                />
                                            </CCol>
                                            <CCol xs={1} md={1} lg={1} style={{ margin: "auto" }}>
                                                <CButton
                                                    type="button"
                                                    size="sm"
                                                    color="info"
                                                    className="btn-pill"
                                                    onClick={() => this.GetTransaction()}
                                                    style={{
                                                    float: "right",
                                                    }}
                                                >
                                                    <span style={{ color: "white" }} >Track</span>
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
