import { Fragment, React, useState, useEffect, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import showResults from "../../showResults/showResults";
import UserService from "../../../services/user.service";

export default class Logistic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getLogistic().then(
      response => {
        this.setState({
          content: response.data
        });
        
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    const fields = [
      { key: "nama_jenis", _style: { width: "40%" } },
      { key: "deskripsi_jenis", _style: { width: "30%" } },
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    return (
      <Fragment>
        <main className="c-main">
          <div className="container-fluid">
            <CRow>
              <CCol xs="12">
                <CCard>
                  <CCardHeader>
                    <CRow>
                      <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                        <h4 style={{ margin: "auto" }}>Logistic</h4>
                      </CCol>
                      <CCol>
                        <CButton block color="dark" to="/Logistic/daftar">
                          Tambah Jenis
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardHeader>
                  <CCardBody>
                    <CDataTable
                      items={ this.state.content.jenis }
                      fields={fields}
                      itemsPerPage={10}
                      pagination
                      scopedSlots={{
                        show_details: (item) => {
                          return (
                            <td className="py-2">
                              <CButton size="sm" color="info">
                                Edit
                              </CButton>
                              <CButton
                                size="sm"
                                color="danger"
                                className="ml-1"
                                onClick={() => {
                                  
                                }}
                              >
                                Delete
                              </CButton>
                            </td>
                          );
                        },
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>
        </main>
      </Fragment>
    );
  }
}