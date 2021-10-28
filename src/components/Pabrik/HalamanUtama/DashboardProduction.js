import { Fragment, React, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
} from "@coreui/react";
import {
  CChartPie,
  CChartLine,
} from '@coreui/react-chartjs'
import UserService from "../../../services/user.service";

export default class DashboardProductin extends Component {
  constructor(props) {
    super(props);    

    this.state = {
      content: "",
      userRole: "",
      pieFlag: "",
      pieVol: "",
      lineDate: "",
      lineVol: "",
      lineChart: ""
    };
  }

  componentDidMount() {
    UserService.getDashboard().then(
      (response) => {
        this.setState({
          content: response.data,
          userRole: response.data.userRole,
          // pieChart: response.data.pieChart,
          // lineChart: response.data.lineChart,
          pieFlag:response.data.pieFlag,
          pieVol:response.data.pieVol,
          lineDate:response.data.valLineDate,
          lineVol:response.data.valLineVol
        });
        console.log(response.data);
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
    const productionData = [
      { key: "user", label: "User", _style: { width: "20%" } },
      { key: "wallet", label: "Wallet", _style: { width: "25%" } },
      { key: "jenis_transaksi", label: "transaksi", _style: { width: "20%" } },
      { key: "transaksi_hash", label: "transaksi Hash", _style: { width: "25%" } },
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
              <CCardHeader>
                <CRow>
                  <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                    <h4 style={{ margin: "auto" }}>Dashboard</h4>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CCard>
                    <CCardGroup cols="2">
                        <CCard height="100%">
                            <CCardBody>
                                <CChartPie
                                datasets={[
                                {
                                    backgroundColor: [
                                    '#41B883',
                                    'cyan',
                                    'blue',
                                    'purple'
                                    ],
                                    data: this.state.content.valPieVol
                                }
                                ]}
                                labels={this.state.content.valPieFlag}
                                options={{
                                tooltips: {
                                    enabled: true
                                }
                                }}
                                />
                            </CCardBody>
                        </CCard>
                        <CCard >
                            <CCardBody>
                                <CChartLine
                                datasets={[
                                {
                                    label: 'Transaksi',
                                    backgroundColor: 'rgb(228,102,81,0.9)',
                                    data: this.state.content.valLineVol
                                }
                                ]}
                                options={{
                                    tooltips: {
                                        enabled: true
                                    },
                                    scales: {
                                        yAxes: [{
                                            display: true,
                                            ticks: {
                                                beginAtZero: true,
                                                min: 0
                                            }
                                        }]
                                    }
                                    }}
                                labels={this.state.lineDate}
                            />
                            </CCardBody>
                        </CCard>
                    </CCardGroup>
                </CCard>
                <CRow>
                    <CCol xs="12">
                        <CCardBody>
                        <CDataTable
                            items={this.state.content.productionData}
                            fields={productionData}
                            itemsPerPage={10}
                            pagination
                            scopedSlots={{
                            show_details: (item) => {
                                return (
                                <td className="py-2" align="center">
                                    <CButton size="sm" color="info" target="_blank" href={"https://ropsten.etherscan.io/tx/" + item.transaksi_hash} >transaksi</CButton>
                                    <CButton size="sm" color="light" target="_blank" href={"https://ropsten.etherscan.io/address/" + item.wallet} >wallet</CButton>
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