import { React, Fragment, useState, useEffect } from "react";
import { Field, reduxForm, FieldArray } from "redux-form";
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
  CInput,
//   CModal,
//   CModalBody,
//   CModalFooter,
//   CModalHeader,
//   CModalTitle,
} from "@coreui/react";
import DatePicker from "react-datepicker";
import UserService from "../../../services/user.service";
import "../react-datepicker.css";
import moment from 'moment';
// import { formatValue } from 'react-currency-input-field';
// import CurrencyInput from 'react-currency-input-field';
import NumberFormat from 'react-number-format';

const AddMitraMscForm = (props) => {
  const { handleSubmit, reset, param } = props;
  const [tgl, setStartDate] = useState('');
  const [mt, setMT] = useState(1);
//   const [dataVolTotal, setDataVolTotal] = useState("");
  const [dataMitra, setMitra] = useState([]);
  const [dataVolMitra, setDataVolMitra] = useState([]);
//   const [totalVol, setTVol] = useState(0);
  
  const AddMitra = async (e) => {
      setMT(parseInt(e) + 1);
  };

//   props.onSelectDate(moment(tgl).format('YYYY-MM-DD'));
//   props.Milling(milling);
//   props.Icumsa(icumsa);
//   props.BJB(bjb);
//   props.KA(ka);

    // if(dataVolMitra.length > 0) {
    //   props.TOTALV(dataVolMitra.reduce((curr, next) => parseInt(curr) + parseInt(next)))
    // }


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
      await UserService.getDataMitraTani().then(
      (response) => {
        console.log(response);
        setMitra(response.data.petani)
      },
      (error) => {
        // setMitra((error.response && error.response.data && error.response.data.message) || error.message || error.toString())
        console.log(error);
      }
    );
  }

  const handleVolumeChange = (tags) => async (event) => {
    const vols = dataVolMitra;
    vols[event.target.id] = event.target.value;
    setDataVolMitra(vols);
    console.log("Total ", vols.reduce((curr, next) => parseInt(curr) + parseInt(next)));
  };

  const renderMitra = ({ fields, meta: { error, submitFailed } }) => (
    <ul style={{ listStyle: "none", marginLeft: "0px", padding: "0px" }}>
      {fields.map((mitra, index) => (
        <li key={index} style={{ marginTop: "40px" }}>
          <CButton
            type="button"
            size="sm"
            color="dark"
            className="btn-pill"
            style={{
              float: "right",
            }}
            onClick={() => fields.remove(index)}
          >
            <span style={{ color: "white" }}>X</span>
          </CButton>
          <h4 style={{ marginTop: "30px" }}>Mitra #{index + 1}</h4>
          <Fragment>
            <CFormGroup>
                <CLabel htmlFor="selectMitraMultiple"> Select Mitra </CLabel>
                <Field
                  className="textInput pabrik"
                  name={`${mitra}.selectMitra`}
                  component="select"
                >
                  <option value="" disabled hidden>
                    -= Select Mitra =-
                  </option>
                  {dataMitra &&
                    dataMitra.map((value) => {
                      return (
                        <option key={value.id} value={value.id}>
                          {value.nama_petani}
                        </option>
                      );
                    })}
                </Field>
            </CFormGroup>
            <CFormGroup>
                <CLabel htmlFor="selectBeanMultiple"> Volume Milled Sugar Cane </CLabel>
                <Field
                  id={index}
                  className="textInput pabrik"
                  name={`${mitra}.persentase`}
                  onChange={handleVolumeChange(index)}
                  component="input"
                />
            </CFormGroup>
          </Fragment>
        </li>
      ))}
        <li>
          <CButton
            type="button"
            size="sm"
            color="info"
            className="btn-pill"
            onClick={() => fields.push({})}
          >
            Add Mitra
          </CButton>
          &nbsp;
          {submitFailed && error && <span>{error}</span>}
        </li>
    </ul>
  );  

  return (
    <form onSubmit={handleSubmit}>
      <main className="c-main">
        <div className="container-fluid">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                  <h4 style={{ margin: "auto" }}>Add Production Mitra</h4>
                </CCol>
                <CCol>
                  <CButton block color="dark" to="/Production">
                    <span style={{ color: "white" }}>X</span>
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
                <CFormGroup>
                  <FieldArray name="mitra" component={renderMitra} />
                </CFormGroup>
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary">
                Submit
              </CButton>{" "}
              <CButton type="reset" size="sm" color="danger" onClick={reset}>
                Reset
              </CButton>
            </CCardFooter>
          </CCard>
        </div>
      </main>
    </form>
  );
};

export default reduxForm({
  form: "AddMitraMsc", // a unique identifier for this form
})(AddMitraMscForm);
