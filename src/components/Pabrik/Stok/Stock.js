import { Fragment, React, Component } from "react";
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
} from "@coreui/react";
import UserService from "../../../services/user.service";

export default class Stock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getStock().then(
      (response) => {
          console.log(response.data);
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
    const stock = [
      { key: "date", label: "Date", _style: { width: "15%" } },
      { key: "cane", label: "Cane", _style: { width: "15%" } },
      { key: "rs", label: "Raw", _style: { width: "15%" } },
      { key: "proses", label: "Process", _style: { width: "40%" } },
      { key: "volume", label: "Volume", _style: { width: "15%" } },
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
                                <h4 style={{ margin: "auto" }}>Stock</h4>
                            </CCol>
                        </CRow>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={this.state.content.stock}
                            fields={stock}
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
