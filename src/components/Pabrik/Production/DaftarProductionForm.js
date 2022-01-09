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
import UserService from "../../../services/user.service";

const DaftarProductionForm = (props) => {
  const { handleSubmit, reset, param } = props;
  const [tgl, setStartDate] = useState('');
  const [dataMitra, setMitra] = useState([]);
  const [icumsa, setIcumsa] = useState(0);
  const [bjb, setBjb] = useState(0);
  const [ka, setKA] = useState(0);

  const [brix, setBrix] = useState(0);
  const [tras, setTras] = useState(0);

  const [milling, setMilling] = useState(0);

  const [AM, setAddMitra] = useState(false);

  const MAX_VAL = parseFloat(0.10).toFixed(2);
  const withValueKALimit = ({ formattedValue }) => formattedValue <= MAX_VAL;

  const MAX_BJB = parseFloat(1.20).toFixed(2);
  const withValueBJBLimit = ({ formattedValue }) => formattedValue <= MAX_BJB;

  const MAX_ICUMSA = 300;
  const formatIcumsa = ({ formattedValue }) => formattedValue <= MAX_ICUMSA;

  const MAX_SUGARCANE_QUALITY = 100
  const formatQuality = ({ formattedValue }) => formattedValue <= MAX_SUGARCANE_QUALITY;

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

  props.onSelectDate(moment(tgl).format('YYYY-MM-DD'));
  if(props.PRSID === 0 || props.MSCID === 0) {
    props.Milling(milling);
  }
  props.Icumsa(icumsa);
  props.BJB(bjb);
  props.KA(ka);
  props.TRAS(tras);
  props.BRIX(brix);
  props.AddMitra(AM);

  console.log('cek propsnya nih', props);

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
                  require="true"
                />
              </CFormGroup>
              {/* <CFormGroup>
                <CLabel htmlFor="nf-namaJenis">Volume (kwintal)</CLabel>
                <Field
                  className="textInput pabrik"
                  name="volume"
                  component="input"
                  type="number"
                />
              </CFormGroup> */}
              {(() => {
                if(props.PRSID || props.PRSID === 0) {
                  console.log('Processed');
                  return (
                    <CFormGroup>
                      <CLabel htmlFor="nf-namaJenis">Milling Process</CLabel>
                      <NumberFormat 
                        className="textInput pabrik" 
                        format={prosesGiling}
                        onChange={(val) => setMilling(val)}
                        placeholder="H:m"
                        name="jam_giling"
                        require="true"
                      />
                    </CFormGroup>
                  )
                }
              })()}

              {(() => {
                if((props.PRSID || props.PRSID === 0) || (props.SFRSID || props.SFRSID === 0) || (props.SCID || props.SCID === 0)) {
                  console.log('RAW SUGAR');
                  return(
                    <CFormGroup>
                      <CLabel htmlFor="nf-namaJenis">Sugarcane Quality (Optional)</CLabel>
                      <CRow>
                        <CCol sm={6} md={6} xl={6} >
                          <NumberFormat
                            className="textInput pabrik"
                            name="brix"
                            component="input"
                            isAllowed={formatQuality}
                            maxLength={3}
                            defaultValue={brix === 0 ? '' : brix}
                            onChange={(val) => setBrix(val)}
                            // max={100}
                            // min={0}
                            placeholder="Brix ...%"
                          />
                        </CCol>
                        <CCol sm={6} md={6} xl={6} >
                          <NumberFormat
                            className="textInput pabrik"
                            name="trash"
                            isAllowed={formatQuality}
                            component="input"
                            maxLength={3}
                            defaultValue={tras === 0 ? '' : tras}
                            onChange={(val) => setTras(val)}
                            // max={100}
                            // min={0}
                            placeholder="Tras ...%"
                          />
                        </CCol>
                      </CRow>
                    </CFormGroup>
                  )
                } else {
                  console.log('CANE SUGAR');
                  return(
                    <CFormGroup>
                      <CLabel htmlFor="nf-namaJenis">Sugarcane Quality</CLabel>
                      <CRow>
                        <CCol sm={6} md={6} xl={6} >
                          <NumberFormat
                            className="textInput pabrik"
                            name="brix"
                            component="input"
                            isAllowed={formatQuality}
                            maxLength={3}
                            defaultValue={brix === 0 ? '' : brix}
                            onChange={(val) => setBrix(val)}
                            // max={100}
                            // min={0}
                            placeholder="Brix ...%"
                            require="true"
                          />
                        </CCol>
                        <CCol sm={6} md={6} xl={6} >
                          <NumberFormat
                            className="textInput pabrik"
                            name="trash"
                            isAllowed={formatQuality}
                            component="input"
                            maxLength={3}
                            defaultValue={tras === 0 ? '' : tras}
                            onChange={(val) => setTras(val)}
                            // max={100}
                            // min={0}
                            placeholder="Tras ...%"
                            require="true"
                          />
                        </CCol>
                      </CRow>
                    </CFormGroup>
                  )
                }
              })()}
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
                      require="true"
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
                      require="true"
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
                      require="true"
                    />
                  </CCol>
                </CRow>
              </CFormGroup>
            </CCardBody>
            <CCardFooter>
               {(() => {
                if(props.SCID) {
                  return (
                    <>
                      <CButton type="button" to={`/Production/add-mitra/sc/${props.SCID}`} size="sm" color="info" > Add Mitra </CButton>{" "}
                    </>
                  )
                } else if(props.PRSID) {
                  return (
                    <>
                      <CButton type="button" to={`/Production/add-mitra/prs/${props.PRSID}`} size="sm" color="info" > Add Mitra </CButton>{" "}
                    </>
                  )
                } else if(props.SFRSID) {
                  return (
                    <>
                      <CButton type="button" to={`/Production/add-mitra/sfrs/${props.SFRSID}`} size="sm" color="info" > Add Mitra </CButton>{" "}
                    </>
                  )
                } else {
                  return (
                    <>
                      <CButton type="submit" size="sm" color="primary" onClick={() => setAddMitra(true)}> Submit </CButton>{" "}
                    </>
                  )
                }
              })()}

              {/* <CButton type="submit" size="sm" color="primary">
                Submit
              </CButton>{" "} */}
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
