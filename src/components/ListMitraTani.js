import { Fragment, React, Component } from "react";
import "./Pabrik.css";
import "./PabrikMedia.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton
} from "@coreui/react";
import UserService from '../services/user.service';
import showResults from './showResults/showResults';

export default class ListMitraTani extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      loading: false,
      color: "#3c4b64"
    };
  }

  componentDidMount() {
    UserService.getDataMitraTani().then(
      (response) => {
        this.setState({
          content: response.data.petani,
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

  changeStatus = async (item) => {
    this.setState({
      loading: true,
    });

    await UserService.changeStatusMitraTani(item.id).then(
      async (response) => {
        console.log(response);
        this.setState({
          loading: false,
        });
        showResults("Data Berhasil Diupdate");
      },
      (error) => {
      }
    );

    await UserService.getDataMitraTani().then(
      (response) => {
        this.setState({
          content: response.data.petani,
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
  };

  render() {

    const Data = [
      { key: "nama_petani", label: "Nama"},
      { key: "kontak", label: "Kontak"},
      { key: "luas_lahan", label: "Lahan (Hektar)"},
      { key: "status", label: "Status"},
      {
        key: "dataControl",
        label: "Aksi",
        filter: false,
      },
    ];

    return (
      <Fragment>
        <main className="c-main">
            <div className="container-fluid">
                <CCard>
                <CCardBody>
                    <CRow>
                        <CCol xs="12">
                            <CCardHeader>
                                <CRow>
                                    <CCol
                                        xs={6}
                                        md={7}
                                        lg={10}
                                        style={{ margin: "auto" }}
                                    >
                                        <h4 style={{ margin: "auto" }}>Farmer</h4>
                                    </CCol>
                                    <CCol>
                                        <CButton
                                            block
                                            color="dark"
                                            to="/Add-mitra-petani"
                                            >
                                            Add Farmer Partner
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                              <CDataTable
                                  items={this.state.content}
                                  fields={Data}
                                  itemsPerPage={10}
                                  tableFilter
                                  cleaner
                                  itemsPerPageSelect
                                  hover
                                  sorter
                                  pagination
                                  scopedSlots={{
                                      dataControl: (item) => {
                                        return (
                                          <td className="py-2">
                                            <div>
                                              {(() => {
                                                  if(item.status === 'Active') {
                                                    return(
                                                      <CButton size="sm" color="danger" onClick={() => this.changeStatus(item)}>Deactivate</CButton>
                                                    )
                                                  } else {
                                                    return (
                                                      <CButton size="sm" color="warning" onClick={() => this.changeStatus(item)}>Activate</CButton>
                                                    )
                                                  }
                                              })()}
                                              <CButton size="sm" color="info" className="ml-1" to={`Detail-mitra-petani/${item.id}`} >Detail</CButton>
                                            </div>
                                          </td>
                                        );
                                      },
                                  }}
                              />
                            </CCardBody>
                        </CCol>
                    </CRow>
                </CCardBody>
                </CCard>
            </div>
        </main>
      </Fragment>
    );
  }
}
