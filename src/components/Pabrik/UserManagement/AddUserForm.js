import { React } from "react";
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
  CSelect,
} from "@coreui/react";

const AddUserForm = (props) => {
  const { handleSubmit, reset } = props;  

  return (
    <form onSubmit={handleSubmit}>
      <main className="c-main">
        <div className="container-fluid">
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                  <h4 style={{ margin: "auto" }}>Add User</h4>
                </CCol>
                <CCol>
                  <CButton block color="dark" to="/">
                    <span style={{ color: "white" }}>X</span>
                  </CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CForm action="" method="post">
                <CFormGroup>
                  <CLabel htmlFor="nf-date">Username</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="username"
                    component="input"
                    type="text"
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-date">Email</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="email"
                    component="input"
                    type="email"
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-date">Password</CLabel>
                  <Field
                    className="textInput pabrik"
                    name="password"
                    component="input"
                    type="password"
                  />
                </CFormGroup>
                <CFormGroup>
                    <CLabel htmlFor="nf-date">Role</CLabel>
                    <Field className="textInput pabrik" name="role" component="select">
                        <option value="">Please Select</option>
                        <option value="2">Production</option>
                        <option value="3">Logistics</option>
                        <option value="4">Sales</option>
                  </Field>
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
  form: "addUser", // a unique identifier for this form
})(AddUserForm);
