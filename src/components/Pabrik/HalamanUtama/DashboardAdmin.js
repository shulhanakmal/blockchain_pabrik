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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CTabs,
} from "@coreui/react";
import {
  CChartPie,
  CChartLine,
} from '@coreui/react-chartjs'
import UserService from "../../../services/user.service";
import moment from 'moment';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      userRole: "",
      pieFlagProduction: "",
      pieVolProduction: "",
      lineDateProduction: "",
      lineVolProduction: "",
      pieFlagLogistics: "",
      pieVolLogistics: "",
      lineDateLogistics: "",
      lineVolLogistics: "",
      pieFlagSales: "",
      pieVolSales: "",
      lineDateSales: "",
      lineVolSales: "",
    };
  }

  componentDidMount() {
    UserService.getDashboard().then(
      (response) => {
        this.setState({
          content: response.data,
          userRole: response.data.userRole,
          pieChart: response.data.pieChart,
          lineChart: response.data.lineChart,
          pieFlag:response.data.pieFlag,
          pieVol:response.data.pieVol,
          lineDate:response.data.valLineDate,
          lineVol:response.data.valLineVol
        });
        console.log('data',response.data);
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
      // { key: "user", label: "User", _style: { width: "20%" } },
      { key: "wallet", label: "Wallet"},
      { key: "jenis_transaksi", label: "transaksi"},
      { key: "transaksi_hash", label: "transaksi Hash"},
      { key: "created_at", label: "Created"},
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const logisticsData = [
      // { key: "user", label: "User", _style: { width: "20%" } },
      { key: "wallet", label: "Wallet"},
      { key: "jenis_transaksi", label: "transaksi"},
      { key: "transaksi_hash", label: "transaksi Hash"},
      { key: "created_at", label: "Created"},
      {
        key: "show_details",
        label: "",
        _style: { width: "10%" },
        filter: false,
      },
    ];
    const salesData = [
      // { key: "user", label: "User", _style: { width: "20%" } },
      { key: "wallet", label: "Wallet"},
      { key: "jenis_transaksi", label: "transaksi"},
      { key: "transaksi_hash", label: "transaksi Hash"},
      { key: "created_at", label: "Created"},
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
                <CTabs>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink>Production</CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>Logistics</CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink>Sales</CNavLink>
                  </CNavItem>
                </CNav>
                  <CTabContent>
                    <CTabPane>
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
                                    data: this.state.content.valAdminPieVolProduction
                                }
                                ]}
                                labels={this.state.content.valAdminPieFlagProduction}
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
                                    data: this.state.content.valAdminLineVolProduction
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
                                labels={this.state.valAdminLineDateProduction}
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
                              tableFilter
                              cleaner
                              itemsPerPageSelect
                              hover
                              sorter
                              pagination
                              scopedSlots={{
                                created_at: (item) => {
                                  return (
                                    <td className="py-2" align="center">
                                      {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                  );
                                },
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
                    </CTabPane>



                    <CTabPane>
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
                                    data: this.state.content.valAdminPieVolLogistics
                                }
                                ]}
                                labels={this.state.content.valAdminPieFlagLogistics}
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
                                    data: this.state.content.valAdminLineVolLogistics
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
                                labels={this.state.valAdminLineDateLogistics}
                            />
                            </CCardBody>
                          </CCard>
                        </CCardGroup>
                      </CCard>
                      <CRow>
                        <CCol xs="12">
                          <CCardBody>
                            <CDataTable
                              items={this.state.content.logisticsData}
                              fields={logisticsData}
                              itemsPerPage={10}
                              tableFilter
                              cleaner
                              itemsPerPageSelect
                              hover
                              sorter
                              pagination
                              scopedSlots={{
                                created_at: (item) => {
                                  return (
                                    <td className="py-2" align="center">
                                      {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                  );
                                },
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
                    </CTabPane>



                    <CTabPane>
                    <CCard>
                        <CCardGroup cols="1">
                          <CCard >
                            <CCardBody>
                              <CChartLine
                                datasets={[
                                {
                                    label: 'Transaksi',
                                    backgroundColor: 'rgb(228,102,81,0.9)',
                                    data: this.state.content.valAdminLineVolSales
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
                                labels={this.state.valAdminLineDateSales}
                            />
                            </CCardBody>
                          </CCard>
                        </CCardGroup>
                      </CCard>
                      <CRow>
                        <CCol xs="12">
                          <CCardBody>
                            <CDataTable
                              items={this.state.content.salesData}
                              fields={salesData}
                              itemsPerPage={10}
                              tableFilter
                              cleaner
                              itemsPerPageSelect
                              hover
                              sorter
                              pagination
                              scopedSlots={{
                                created_at: (item) => {
                                  return (
                                    <td className="py-2" align="center">
                                      {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                  );
                                },
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
                    </CTabPane>
                  </CTabContent>
                </CTabs>
              </CCardBody>
            </CCard>
          </div>
        </main>
      </Fragment>
    );
  }
}