import { Fragment, React, useState, useEffect, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardGroup,
  CRow,
  CCol,
  CDataTable,
} from "@coreui/react";
import {
    CChartPie,
    CChartLine,
  } from '@coreui/react-chartjs'
import UserService from "../../../services/user.service";

export default class SummaryLogistic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getSummarySales().then(
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
    const sales = [
        { key: "date", label: "Date", _style: { width: "25%" } },
        { key: "price", label: "Price", _style: { width: "25%" } },
        { key: "cane", label: "Cane", _style: { width: "10%" } },
        { key: "rs", label: "RS", _style: { width: "10%" } },
        { key: "provenue", label: "Provenue", _style: { width: "20%" } },
      ];
    console.log(this.state.content);
    // ['milled sugar cane', 'processed rs', 'sugar cane', 'sugar from rs']
    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">
                    <CRow>
                        <CCol xs="12">
                            <CCard>
                                <CCardHeader>
                                    Sales - The amount of ex-cane and ex-RS bulk sugar sold
                                </CCardHeader>
                                <CCardBody>
                                    <CChartLine
                                        datasets={[
                                        {
                                            label: 'Cane',
                                            backgroundColor: 'rgb(228,102,81,0.9)',
                                            data: this.state.content.cane
                                        },
                                        {
                                            label: 'RS',
                                            backgroundColor: 'rgb(0,216,255,0.9)',
                                            data: this.state.content.rs
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
                                        labels={this.state.content.date}
                                    />
                                </CCardBody>
                            </CCard>

                            <CCard>
                                <CCardHeader>
                                    Sales Pie Chart
                                </CCardHeader>
                                <CCardBody>
                                    <CChartPie
                                        datasets={[
                                        {
                                            backgroundColor: [
                                            '#41B883',
                                            '#DD1B16',
                                            'cyan',
                                            'blue',
                                            'purple'
                                            ],
                                            data: this.state.content.pieVal
                                        }
                                        ]}
                                        labels={this.state.content.pieBuyer}
                                        options={{
                                        tooltips: {
                                            enabled: true
                                        }
                                        }}
                                    />
                                </CCardBody>
                            </CCard>

                            <CCardGroup>
                                <CCard>
                                    <CCardHeader>
                                        <CRow>
                                            <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }}>
                                                <h4 style={{ textAlign: "center" }}>Summary Sales</h4>
                                            </CCol>
                                        </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CDataTable
                                            items={this.state.content.summarySales}
                                            fields={sales}
                                            itemsPerPage={10}
                                            pagination
                                        />
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </div>
            </main>
        </Fragment>
      )
    
  }
}
