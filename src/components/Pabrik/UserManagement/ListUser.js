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

export default class ListUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getUser().then(
      (response) => {
        this.setState({
          content: response.data,
        });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  render() {
    const listUser = [
      { key: "username", label: "Username", _style: { width: "25%" } },
      { key: "email", label: "Email", _style: { width: "25%" } },
      { key: "role", label: "Role", _style: { width: "15%" } },
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
            <CCard>
              <CCardBody>
                <CCol xs="12">
                    <CCardHeader>
                        <CRow>
                            <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                                <h4 style={{ margin: "auto" }}>List User</h4>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={this.state.content.listUser}
                            fields={listUser}
                            itemsPerPage={10}
                            pagination
                            scopedSlots={{
                            show_details: (item) => {
                                return (
                                <td className="py-2">
                                    <CButton size="sm" color="info">Edit</CButton>
                                    <CButton size="sm" color="danger" className="ml-1" onClick={() => {}}>Delete</CButton>
                                </td>
                                );
                            },
                            }}
                        />
                    </CCardBody>
                </CCol>
              </CCardBody>
            </CCard>
          </div>
        </main>
      </Fragment>
    );
  }
}
