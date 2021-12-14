import { React, useState } from "react";
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
} from "@coreui/react";
import DatePicker from "react-datepicker";
import "../react-datepicker.css";
import moment from 'moment';
import NumberFormat from 'react-number-format';

const DaftarProductionForm = (props) => {
  const { handleSubmit, reset, param } = props;
  const [tgl, setStartDate] = useState('');
  const [icumsa, setIcumsa] = useState(0);
  const [bjb, setBjb] = useState(0);
  const [ka, setKA] = useState(0);

  const MAX_VAL = parseFloat(0.10).toFixed(2);
  const withValueKALimit = ({ formattedValue }) => formattedValue <= MAX_VAL;

  const MAX_BJB = parseFloat(1.20).toFixed(2);
  const withValueBJBLimit = ({ formattedValue }) => formattedValue <= MAX_BJB;

  const MAX_ICUMSA = 300;
  const formatIcumsa = ({ formattedValue }) => formattedValue <= MAX_ICUMSA;

  props.onSelectDate(moment(tgl).format('YYYY-MM-DD'));
  props.Icumsa(icumsa);
  props.BJB(bjb);
  props.KA(ka);

  return (
    <form onSubmit={handleSubmit}>
      <main className="c-main">
        <div className="container-fluid">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                  <h4 style={{ margin: "auto" }}>Add Production</h4>
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
                <CLabel htmlFor="nf-date">Date</CLabel>
                <DatePicker
                  selected={tgl}
                  className="textInput pabrik"
                  onChange={(date) => setStartDate(date)}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  name="date"
                  placeholderText="Select a date"
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-namaJenis">Volume (kwintal)</CLabel>
                <Field
                  className="textInput pabrik"
                  name="volume"
                  component="input"
                  type="number"
                />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-namaJenis">Quality of Sugar</CLabel>
                <CRow>
                  <CCol sm={4} md={4} xl={4} >
                    <NumberFormat 
                      className="textInput pabrik" 
                      isAllowed={formatIcumsa}
                      maxLength={3}
                      defaultValue={icumsa === 0 ? '' : icumsa}
                      onChange={(val) => setIcumsa(val)}
                      placeholder="Icumsa" 
                      name='icumsa'
                    />
                  </CCol>
                  <CCol sm={4} md={4} xl={4} >
                    <NumberFormat 
                      format="#.##" 
                      className="textInput pabrik" 
                      isAllowed={withValueBJBLimit}
                      onChange={(val) => setBjb(val)}
                      name="bjb" 
                      placeholder="BJB 0.00" 
                    />
                  </CCol>
                  <CCol sm={4} md={4} xl={4} >
                    <NumberFormat 
                      format="#.##"
                      className="textInput pabrik"
                      isAllowed={withValueKALimit}
                      onChange={(val) => setKA(val)}
                      name="kadar_air"
                      placeholder="Water Content 0.00" 
                    />
                  </CCol>
                </CRow>
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
  form: "daftarProduction", // a unique identifier for this form
})(DaftarProductionForm);
