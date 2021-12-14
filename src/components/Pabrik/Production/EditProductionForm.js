import { React, useState, useEffect } from "react";
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
import UserService from "../../../services/user.service";
import "../react-datepicker.css";
import moment from 'moment';
import NumberFormat from 'react-number-format';

const EditProductionForm = (props) => {
  const { handleSubmit, reset } = props;
  const [tgl, setStartDate] = useState('');
  const [data, setData] = useState([]);
  const [vol, setVol] = useState(0);
  const [milling, setMilling] = useState(0);
  const [icumsa, setIcumsa] = useState(0);
  const [bjb, setBjb] = useState(0);
  const [ka, setKA] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  let flag = props.dataFlag;
  let id = props.dataID;

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

  const MAX_ICUMSA = 300;
  const formatIcumsa = ({ formattedValue }) => formattedValue <= MAX_ICUMSA;

  const getData = async () => {
    // let flag = props.dataFlag;
    // let id = props.dataID;
    UserService.getProduction(flag, id).then(
      (response) => {
        console.log('response', response);
        setData(response.data.data);
        
        let valVol = response.data.data.volume;
        if (response.data.data.volume) {  
          setVol(valVol.replace(".00", ""));
        }
      },
      (error) => {}
    );
  };

  props.onSelectDate(moment(tgl).format('YYYY-MM-DD'));

  console.log(data);

  if(flag === 'msc') {
    return (
      <form onSubmit={handleSubmit}>
        <main className="c-main">
          <div className="container-fluid">
            <CCard>
              <CCardHeader>
                <CRow>
                  <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                    <h4 style={{ margin: "auto" }}>Edit Production</h4>
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
                    className="textInput pabrik"
                    onChange={(date) => setStartDate(date)}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    name="date"
                    placeholderText={(moment(data.date).format('DD/MM/YYYY'))}
                    selected={tgl}
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Milling Process</CLabel>
                  <NumberFormat 
                    className="textInput pabrik" 
                    format={prosesGiling}
                    onChange={(val) => setMilling(val)}
                    placeholder={data.lama_proses}
                    name="jam_giling"
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Sugarcane Quality</CLabel>
                  <CRow>
                    <CCol sm={6} md={6} xl={6} >
                      <Field
                        className="textInput pabrik"
                        name="brix"
                        component="input"
                        type="number"
                        max={100}
                        min={0}
                        placeholder={data.brix}
                      />
                    </CCol>
                    <CCol sm={6} md={6} xl={6} >
                      <Field
                        className="textInput pabrik"
                        name="trash"
                        component="input"
                        type="number"
                        max={100}
                        min={0}
                        placeholder={data.trash}
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
                        defaultValue={icumsa === 0 ? '' : icumsa}
                        onChange={(val) => setIcumsa(val)}
                        placeholder={data.icumsa}
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
                        placeholder={data.bjb}
                      />
                    </CCol>
                    <CCol sm={4} md={4} xl={4} >
                      <NumberFormat 
                        format="#.##"
                        className="textInput pabrik"
                        isAllowed={withValueKALimit}
                        onChange={(val) => setKA(val)}
                        name="kadar_air"
                        placeholder={data.ka}
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
    )
  } else {
    return (
      <form onSubmit={handleSubmit}>
        <main className="c-main">
          <div className="container-fluid">
            <CCard>
              <CCardHeader>
                <CRow>
                  <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                    <h4 style={{ margin: "auto" }}>Edit Production</h4>
                  </CCol>
                  <CCol>
                    <CButton block color="dark" to="/Production">
                      <span style={{ color: "white" }}>X</span>
                    </CButton>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                {/* <CForm action="" method="post"> */}
                  <CFormGroup>
                    <CLabel htmlFor="nf-date">Date</CLabel>
                    <DatePicker
                      className="textInput pabrik"
                      onChange={(date) => setStartDate(date)}
                      maxDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      name="date"
                      placeholderText={(moment(data.date).format('DD/MM/YYYY'))}
                      selected={tgl}
                      required
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="nf-namaJenis">Volume (kwintal)</CLabel>
                    <Field
                      className="textInput pabrik number"
                      name="volume"
                      component="input"
                      defaultValue={vol}
                      placeholder={vol}
                      type="number"
                      required
                    />
                  </CFormGroup>
                {/* </CForm> */}
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
  }
};

export default reduxForm({
  form: "EditProduction", // a unique identifier for this form
})(EditProductionForm);
