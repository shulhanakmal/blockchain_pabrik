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
} from "@coreui/react";
import DatePicker from "react-datepicker";
import UserService from "../../../services/user.service";
import "../react-datepicker.css";
import moment from 'moment';
// import { formatValue } from 'react-currency-input-field';
// import CurrencyInput from 'react-currency-input-field';
import NumberFormat from 'react-number-format';

const DaftarMSCForm = (props) => {
  const { handleSubmit, reset, param } = props;
  const [tgl, setStartDate] = useState('');
  const [mt, setMT] = useState(1);
  const [dataMitra, setMitra] = useState([]);
  const [totalVol, setTVol] = useState(0);

  const MAX_VAL = parseFloat(0.10).toFixed(2);
  const withValueKALimit = ({ formattedValue }) => formattedValue <= MAX_VAL;

  const MAX_BJB = parseFloat(1.20).toFixed(2);
  const withValueBJBLimit = ({ formattedValue }) => formattedValue <= MAX_BJB;

  function limit(val, max) {
    if (val.length === 1 && val[0] > max[0]) {
      val = '0' + val;
    }

    if (val.length === 2) {
      if (Number(val) === 0) {
        val = '01';

        //this can happen when user paste number
      } else if (val > max) {
        val = max;
      }
    }

    return val;
  }

  function prosesGiling(val) {
    let hour = limit(val.substring(0, 2), '24');
    let minute = val.substring(2, 4);

    if(parseInt(hour) === 24) {
      return hour + ':' + 0 + 0;
    } else {
      return hour + (minute < 61 ? ':' + minute : ':' + 60);
    }
  }

  function TotalVolume() {
    console.log('test');
    if(totalVol === 0) {
      return ;
    } else {
      return totalVol;
    }
  }

  const MAX_ICUMSA = 300;
  const formatIcumsa = ({ formattedValue }) => formattedValue <= MAX_ICUMSA;

  const MAX_SCQ = 100;
  const SCQ = ({ formattedValue }) => formattedValue <= MAX_SCQ;
  
  const AddMitra = async (e) => {
      setMT(parseInt(e) + 1);
  };

  props.onSelectDate(moment(tgl).format('YYYY-MM-DD'));

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
        setMitra((error.response && error.response.data && error.response.data.message) || error.message || error.toString())
      }
    );
  }

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
                <NumberFormat
                  className="textInput pabrik"
                  name={`${mitra}.persentase`}
                  onValueChange={ async (values) => {
                    const { formattedValue, value } = values;
                    console.log("cek ini",values)
                    // setTVol( parseInt(totalVol) + parseInt(values.value) )
                  }}
                />
            </CFormGroup>
          </Fragment>
        </li>
      ))}
      
        <li>
            <CButton
              type="button"
              size="sm"
              color="success"
              className="btn-pill"
              onClick={() => fields.push({})}
            >
            Add Mitra
            </CButton>
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
              <CForm action="" method="post">
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
                  <CLabel htmlFor="nf-namaJenis">Volume Total (kwintal)</CLabel>
                  <NumberFormat
                    className="textInput pabrik"
                    name="volume_total"
                  />
                </CFormGroup>
                <CFormGroup>
                    <FieldArray name="mitra" component={renderMitra} />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Milling Process</CLabel>
                  <NumberFormat 
                    className="textInput pabrik" 
                    format={prosesGiling} 
                    placeholder="H:m" 
                    name="jam_giling"
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Sugarcane Quality</CLabel>
                  <CRow>
                    <CCol sm={6} md={6} xl={6} >
                      <NumberFormat
                        className="textInput pabrik"
                        name="brix"
                        isAllowed={SCQ}
                        placeholder="Brix ...%"
                      />
                    </CCol>
                    <CCol sm={6} md={6} xl={6} >
                      <NumberFormat
                        className="textInput pabrik"
                        name="trash"
                        isAllowed={SCQ}
                        placeholder="Trash ...%"
                      />
                    </CCol>
                  </CRow>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Quality of Sugar</CLabel>
                  <CRow>
                    <CCol sm={4} md={4} xl={4} >
                      <NumberFormat 
                        className="textInput pabrik" 
                        isAllowed={formatIcumsa}
                        maxLength={3}
                        placeholder="Icumsa" 
                        name='icumsa'
                      />
                    </CCol>
                    <CCol sm={4} md={4} xl={4} >
                      <NumberFormat 
                        format="#.##" 
                        className="textInput pabrik" 
                        isAllowed={withValueBJBLimit}
                        name="bjb" 
                        placeholder="BJB 0.00" 
                      />
                    </CCol>
                    <CCol sm={4} md={4} xl={4} >
                      <NumberFormat 
                        format="#.##"
                        className="textInput pabrik"
                        isAllowed={withValueKALimit}
                        name="kadar_air"
                        placeholder="Water Content 0.00" 
                      />
                    </CCol>
                  </CRow>
                </CFormGroup>
              </CForm>
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
})(DaftarMSCForm);
