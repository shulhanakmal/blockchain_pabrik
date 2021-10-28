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
    CChartLine,
  } from '@coreui/react-chartjs'
import UserService from "../../../services/user.service";

export default class SummaryProduction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
    };
  }

  componentDidMount() {
    UserService.getSummaryProduction().then(
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
    const summaryProduction = [
      { key: "date", label: "Date", _style: { width: "20%" } },
      { key: "milled_sugar_cane", label: "Milled Sugar Cane", _style: { width: "20%" } },
      { key: "processed_rs", label: "Processed RS", _style: { width: "20%" } },
      { key: "sugar_cane", label: "Sugar Cane", _style: { width: "20%" } },
      { key: "sugar_from_rs", label: "Sugar From RS", _style: { width: "20%" } },
    ];
    console.log(this.state.content);
    console.log(this.state.content.date);
    // ['milled sugar cane', 'processed rs', 'sugar cane', 'sugar from rs']
    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">
                    <CRow>
                        <CCol xs="12">
                            <CCardGroup cols="1">
                                <CCard>
                                    <CCardHeader>
                                        Production - Milled Raw and Cane Sugar (ku)
                                    </CCardHeader>
                                    <CCardBody>
                                        <CChartLine
                                            datasets={[
                                                {
                                                    label: 'milled sugar cane',
                                                    backgroundColor: 'rgb(228,102,81,0.9)',
                                                    data: this.state.content.msc
                                                },
                                                {
                                                    label: 'milled raw sugar',
                                                    backgroundColor: 'rgb(0,216,255,0.9)',
                                                    data: this.state.content.prs
                                                }
                                            ]}
                                            labels={this.state.content.date}
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
                                        />
                                    </CCardBody>
                                </CCard>

                                <CCard md={6}>
                                <CCardHeader>
                                    Production - Sugar From Cane and RS
                                </CCardHeader>
                                <CCardBody>
                                    <CChartLine
                                        datasets={[
                                        {
                                            label: 'Sugar From Cane',
                                            backgroundColor: 'rgb(228,102,81,0.9)',
                                            data: this.state.content.sc
                                        },
                                        {
                                            label: 'Sugar From RS',
                                            backgroundColor: 'rgb(0,216,255,0.9)',
                                            data: this.state.content.sfrs
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
                            </CCardGroup>

                            <CCardGroup>
                                <CCard>
                                    <CCardHeader>
                                        <CRow>
                                            <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }} >
                                                <h4 style={{ textAlign: "center" }}>Production Summary</h4>
                                            </CCol>
                                        </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CDataTable
                                            items={this.state.content.summaryProduction}
                                            fields={summaryProduction}
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
