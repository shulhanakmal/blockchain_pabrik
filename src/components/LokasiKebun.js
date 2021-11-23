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

export default class LokasiKebun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      loading: false,
      color: "#3c4b64"
      
    };
  }

  componentDidMount() {
    UserService.getDataKebun().then(
      (response) => {
        this.setState({
          content: response.data.kebun,
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

    const Data = [
      { key: "nama_petani", label: "Nama"},
      { key: "alamat_petani", label: "Alamat"},
      { key: "luas_lahan", label: "Lahan"},
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
                                        <h4 style={{ margin: "auto" }}>Farmer's Garden</h4>
                                    </CCol>
                                    <CCol>
                                        <CButton
                                            block
                                            color="dark"
                                            to="/Add-lokasi-kebun"
                                            >
                                            Add
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
                                            <CButton size="sm" color="info" to={`/Detail-kebun/${item.id}`} >Detail</CButton>
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
