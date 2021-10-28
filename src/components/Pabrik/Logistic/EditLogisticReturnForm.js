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

const EditLogisticsReturnForm = (props) => {
  const { handleSubmit, reset } = props;
  const [tgl, setStartDate] = useState('');
  const [buyer, setBuyer] = useState([]);
  const [buyerValue, setBuyerVal] = useState('');
  const [data, setData] = useState([]);
  const [date, setDate] = useState('');
  const [max, setMax] = useState(0);
  const [sugar, setSugar] = useState([]);
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

  const onChangeDate = async (e) => {
    setStartDate(e);
    setDate(e);
    UserService.getLogisticsReturnBuyer(moment(e).format('YYYY-MM-DD')).then(
      (response) => {
        console.log('data', response.data.buyer);
        setBuyer(response.data.buyer);
      },
      (error) => {}
    );
  };

  const onChangeBuyer = async (e) => {
    console.log('e', e.target.value);
    setBuyerVal(e.target.value);
    UserService.getSugar(e.target.value, moment(date).format('YYYY-MM-DD')).then(
      (response) => {
        console.log('sugar', response.data);
        setSugar(response.data.sugar);
      },
      (error) => {}
    );
  };

  const onChangeSugar = async (e) => {
    console.log('valBuyer', buyerValue);
    UserService.getMax(buyerValue, moment(date).format('YYYY-MM-DD'), e.target.value).then(
      (response) => {
        setMax(response.data.max);
        console.log('max', response)
      },
      (error) => {}
    );
  };

  const cekVolume = (e) => {
    console.log(e.target.value);
    var value = e.target.value;
    if(value > max){
        setVol(max);
    }
  };

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
              <CForm action="" method="post">
                <CFormGroup>
                    {console.log('tanggal', data)}
                  <CLabel htmlFor="nf-date">Date</CLabel>
                  <DatePicker
                    selected={tgl}
                    className="textInput pabrik"
                    onChange={onChangeDate}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    name="date"
                    placeholderText={(moment(data.date).format('DD/MM/yyyy'))}
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Buyer</CLabel>
                  {/* <Field className="textInput pabrik" name="role" component="select"> */}
                  <Field
                    className="textInput pabrik"
                    name="buyer"
                    component="select"
                    onChange={onChangeBuyer}
                    required
                  >
                    <option value="">Please Select Buyer</option>
                    {buyer &&
                      buyer.map((value) => {
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                    })}
                  </Field>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Sugar</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="sugar"
                    component="select"
                    onChange={onChangeSugar}
                    required
                  >
                    <option value="">Please Select Sugar</option>
                    {sugar &&
                      sugar.map((value) => {
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        );
                    })}
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
                    onKeyUp={cekVolume}
                    max={max}
                    placeholder={vol}
                    required
                  />
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
  form: "daftarReturnBulkSugar", // a unique identifier for this form
})(EditLogisticsReturnForm);
