import { Fragment, useState, React, useEffect } from "react";
import { Field, reduxForm } from "redux-form";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CCardFooter,
  CRow,
  CCol,
  CDataTable,
  CNavLink
} from "@coreui/react";
import moment from 'moment';
import showResults from "./showResults/showResults";
import UserService from "../services/user.service";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";

const AddMitraTaniForm = (props) => {
    const { handleSubmit } = props;
    const [data, setData] = useState([]);
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#3c4b64");
    let [dataFBC, setDFBC] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
        `
    ;

  return (
    <Fragment>
      {(() => {
        if (loading === true) {
            return (
                <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                    <div className="sweet-loading">
                        <h5>Sedang diproses</h5><br></br>
                        {/* <h5>{this.state.TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + this.state.TxnHash} target="_blank" >Detail</a>}</h5> */}
                        <br></br>
                            <Loader color={color} loading={loading} css={override} size={150} />
                        <br></br>
                        <br></br>
                        <h5>Mohon Tunggu...</h5>
                    </div>
                </div>
            )
        } else {
            return (
                <Fragment>
                    <form onSubmit={handleSubmit}>
                        <main className="c-main">
                            <div className="container-fluid">
                                <CCard>
                                    <CCardHeader>
                                        <CRow>
                                            <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                                                <h4 style={{ margin: "auto" }}>Add Farmer Partner</h4>
                                            </CCol>
                                            <CCol>
                                                <CButton block color="dark" to="/List-mitra-petani">
                                                    <span style={{ color: "white" }}>X</span>
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CRow>
                                            <CCol xs={5} md={6} lg={6}>
                                                <CFormGroup>
                                                    <CLabel htmlFor="nf-namaJenis">Nama</CLabel>
                                                    <Field
                                                        className="textInput pabrik"
                                                        name="nama"
                                                        component="input"
                                                        type="text"
                                                        required
                                                    />
                                                </CFormGroup>
                                                <CFormGroup>
                                                    <CLabel htmlFor="nf-namaJenis">Kontak</CLabel>
                                                    <Field
                                                        className="textInput pabrik"
                                                        name="kontak"
                                                        component="input"
                                                        type="text"
                                                        required
                                                    />
                                                </CFormGroup>
                                                <CFormGroup>
                                                    <CLabel htmlFor="nf-namaJenis">Email</CLabel>
                                                    <Field
                                                        className="textInput pabrik"
                                                        name="email"
                                                        component="input"
                                                        type="email"
                                                        placeholder="example@email.com"
                                                        required
                                                    />
                                                </CFormGroup>
                                            </CCol>
                                            <CCol xs={5} md={6} lg={6}>
                                                <CFormGroup>
                                                    <CLabel htmlFor="nf-namaJenis">Luas Lahan</CLabel>
                                                    <Field
                                                        className="textInput pabrik"
                                                        name="luas_lahan"
                                                        component="input"
                                                        type="number"
                                                        placeholder="Otomatis terisi ketika input Farmer's Garden"
                                                        disabled
                                                    />
                                                </CFormGroup>
                                                <CFormGroup>
                                                    <CLabel htmlFor="nf-namaJenis">Status</CLabel>
                                                    <Field
                                                        className="textInput pabrik"
                                                        name="status"
                                                        component="select"
                                                        required
                                                    >
                                                        <option value="">Please Select Status</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </Field>
                                                </CFormGroup>
                                            </CCol>
                                        </CRow>
                                    </CCardBody>
                                    <CCardFooter>
                                        <CButton type="submit" size="sm" color="primary">Submit</CButton>
                                    </CCardFooter>
                                </CCard>
                            </div>
                        </main>
                    </form>
                </Fragment>
            )
        }
      })()}
    </Fragment>
  );
};

export default reduxForm({
  form: "AddMitraTani", // a unique identifier for this form
})(AddMitraTaniForm);



