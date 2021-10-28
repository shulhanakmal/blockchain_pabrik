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

const DaftarSalesForm = (props) => {
  const { handleSubmit, reset } = props;
  const [tgl, setStartDate] = useState('');
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState('');
  const [vol, setVol] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let id = props.dataID;
    UserService.getDataSales(id).then(
      (response) => {
        setData(response.data.data);
        setFlag(response.data.flag);
        
        if (response.data.data.mount_sugar_sold_cane < 1) {  
          let valVol = response.data.data.mount_sugar_sold_rs;
          setVol(valVol.replace(".00", ""));
        } else {
            let valVol = response.data.data.mount_sugar_sold_cane;
            setVol(valVol.replace(".00", ""));
        }
        let valPrc = response.data.data.price;
        if (response.data.data.price) {  
            setPrice(valPrc.replace(".00", ""));
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
                  <h4 style={{ margin: "auto" }}>Edit Sales</h4>
                </CCol>
                <CCol>
                  <CButton block color="dark" to="/Sales">
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
                  <CLabel htmlFor="nf-date">Document Number</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="no_do"
                    component="input"
                    placeholder={data.no_do}
                    type="text"
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-date">Buyer</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="buyer"
                    component="input"
                    type="text"
                    placeholder={data.buyer}
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-date">Price</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="price"
                    component="input"
                    type="text"
                    placeholder={price}
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Sugar</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="sugar"
                    component="select"
                    placeholderText={flag}
                    selected={flag}
                    required
                  >
                    <option value="">Please Select Sugar</option>
                    <option value="rs">Raw Sugar</option>
                    <option value="cane">Cane Sugar</option>
                  </Field>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-namaJenis">Volume(kwintal)</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="volume"
                    component="input"
                    type="text"
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
  form: "daftarSales", // a unique identifier for this form
})(DaftarSalesForm);
