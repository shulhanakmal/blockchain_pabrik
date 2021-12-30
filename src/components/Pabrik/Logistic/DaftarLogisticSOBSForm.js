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
import UserService from "../../../services/user.service";
import DatePicker from "react-datepicker";
import "../react-datepicker.css";
import moment from 'moment';

const DaftarStockOutBulkSugarForm = (props) => {
  const { handleSubmit, reset } = props;
  const [tgl, setStartDate] = useState('');
  const [date, setDate] = useState('');
  const [sugar, setSugar] = useState([]);

  props.onSelectDate(moment(tgl).format('YYYY-MM-DD'));

  return (
    <form onSubmit={handleSubmit}>
      <main className="c-main">
        <div className="container-fluid">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                  <h4 style={{ margin: "auto" }}>Add Logistics</h4>
                </CCol>
                <CCol>
                  <CButton block color="dark" to="/Logistic">
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
                <CLabel htmlFor="nf-namaJenis">Sugar</CLabel>
                <Field
                  className="textInput pabrik"
                  name="sugar"
                  component="select"
                >
                  <option value="">Please Select Sugar</option>
                  <option value="cane">Sugar Cane</option>
                  <option value="rs">Raw Sugar</option>
                </Field>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-namaJenis">Volume (kwintal)</CLabel>
                <Field
                  className="textInput pabrik number"
                  name="volume"
                  id="volume"
                  component="input"
                  type="number"
                  placeholder="Input volume"
                />
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
  form: "daftarStockOutBulkSugar", // a unique identifier for this form
})(DaftarStockOutBulkSugarForm);
