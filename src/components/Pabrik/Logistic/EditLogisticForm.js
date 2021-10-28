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

const EditLogisticForm = (props) => {
  const { handleSubmit, reset } = props;
  const [tgl, setStartDate] = useState('');
  const [data, setData] = useState([]);
  const [vol, setVol] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let flag = props.dataFlag;
    let id = props.dataID;
    UserService.getLogistic(flag, id).then(
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

  return (
    <form onSubmit={handleSubmit}>
      <main className="c-main">
        <div className="container-fluid">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                  <h4 style={{ margin: "auto" }}>Edit Logistics</h4>
                </CCol>
                <CCol>
                  <CButton block color="dark" to="/Logistic">
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
};

export default reduxForm({
  form: "EditLogistic", // a unique identifier for this form
})(EditLogisticForm);
