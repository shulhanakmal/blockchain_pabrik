import { Fragment, React, useState, useEffect, Component } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

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
    CChartBar,
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
    UserService.getSummaryLogistic().then(
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
    const summaryLogistic = [
      { key: "date", label: "Date", _style: { width: "20%" } },
      { key: "stock_bulk_sugar_from_cane", label: "Stock Bulk Sugar From Cane", _style: { width: "20%" } },
      { key: "stock_bulk_sugar_from_rs", label: "Stock Bulk Sugar From RS", _style: { width: "20%" } },
      { key: "stock_out_bulk_sugar", label: "Stock Out Bulk Sugar", _style: { width: "20%" } },
      { key: "return_bulk_sugar", label: "Return Bulk Sugar", _style: { width: "20%" } },
    ];
    console.log(this.state.content);
    
    // chart code
    // Themes begin
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
    // Themes end
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.data = this.state.content.stacked;
    
    chart.dateFormatter.inputDateFormat = "dd-mm-yyyy";
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.baseInterval = {
        timeUnit: "date",
        count: 1
    }
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.name = "Stock Bulk Sugar From Cane";
    series.dataFields.valueY = "stock_bulk_sugar_from_cane";
    series.tooltipHTML = "<span style='font-size:14px; color:#4571f7;'><b>Stock Bulk Sugar From Cane - {valueY.value}</b></span>";
    series.tooltipText = "[#000]{valueY.value}[/]";
    series.tooltip.background.fill = am4core.color("#FFF");
    series.tooltip.getStrokeFromObject = true;
    series.tooltip.background.strokeWidth = 3;
    series.tooltip.getFillFromObject = false;
    series.fillOpacity = 0.6;
    series.strokeWidth = 2;
    series.stacked = true;
    
    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.name = "Stock Bulk Sugar From RS";
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "stock_bulk_sugar_from_rs";
    series2.tooltipHTML = "<span style='font-size:14px; color:#4571f7;'><b>Stock Bulk Sugar From RS - {valueY.value}</b></span>";
    series2.tooltipText = "[#000]{valueY.value}[/]";
    series2.tooltip.background.fill = am4core.color("#FFF");
    series2.tooltip.getFillFromObject = false;
    series2.tooltip.getStrokeFromObject = true;
    series2.tooltip.background.strokeWidth = 3;
    series2.sequencedInterpolation = true;
    series2.fillOpacity = 0.6;
    series2.stacked = true;
    series2.strokeWidth = 2;
    
    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.name = "Stock Out Bulk Sugar";
    series3.dataFields.dateX = "date";
    series3.dataFields.valueY = "stock_out_bulk_sugar";
    series3.tooltipHTML = "<span style='font-size:14px; color:#4571f7;'><b>Stock Out Bulk Sugar - {valueY.value}</b></span>";
    series3.tooltipText = "[#000]{valueY.value}[/]";
    series3.tooltip.background.fill = am4core.color("#FFF");
    series3.tooltip.getFillFromObject = false;
    series3.tooltip.getStrokeFromObject = true;
    series3.tooltip.background.strokeWidth = 3;
    series3.sequencedInterpolation = true;
    series3.fillOpacity = 0.6;
    series3.defaultState.transitionDuration = 1000;
    series3.stacked = true;
    series3.strokeWidth = 2;

    let series4 = chart.series.push(new am4charts.LineSeries());
    series4.name = "Return Bulk Sugar";
    series4.dataFields.dateX = "date";
    series4.dataFields.valueY = "return_bulk_sugar";
    series4.tooltipHTML = "<span style='font-size:14px; color:#4571f7;'><b>Return Bulk Sugar - {valueY.value}</b></span>";
    series4.tooltipText = "[#000]{valueY.value}[/]";
    series4.tooltip.background.fill = am4core.color("#FFF");
    series4.tooltip.getFillFromObject = false;
    series4.tooltip.getStrokeFromObject = true;
    series4.tooltip.background.strokeWidth = 3;
    series4.sequencedInterpolation = true;
    series4.fillOpacity = 0.6;
    series4.defaultState.transitionDuration = 1000;
    series4.stacked = true;
    series4.strokeWidth = 2;
    
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.scrollbarX = new am4core.Scrollbar();
    
    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";

    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">
                    <CRow>
                        <CCol xs="12">
                            <CCard>
                                <CCardHeader>
                                    Logistics - Stacked Diagram
                                </CCardHeader>
                                <CCardBody>
                                    <div id="chartdiv"></div>
                                </CCardBody>
                            </CCard>

                            <CCardGroup cols="2">
                                <CCard >
                                    <CCardHeader>
                                        Logisgtics - Cane and rs bulk sugar supplies
                                    </CCardHeader>
                                    <CCardBody>
                                        <CChartBar
                                            datasets={[
                                                {
                                                    label: 'Stock Bulk Sugar From Cane',
                                                    backgroundColor: '#41B883',
                                                    data: this.state.content.sbsfc
                                                },
                                                {
                                                    label: 'Stock Bulk Sugar From RS',
                                                    backgroundColor: '#E46651',
                                                    data: this.state.content.sbsfrs
                                                },
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

                                <CCard>
                                    <CCardHeader>
                                        Logistics - Leftover Sugar in The Warehouse
                                    </CCardHeader>
                                    <CCardBody>
                                    <CChartLine
                                            datasets={[
                                                {
                                                    label: 'Leftover Sugar in The Warehouse',
                                                    backgroundColor: '#41B883',
                                                    data: this.state.content.line
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
                            </CCardGroup>

                            <CCardGroup>
                                <CCard>
                                    <CCardHeader>
                                        <CRow>
                                            <CCol xs={6} md={7} lg={10} style={{ margin: "auto" }} >
                                                <h4 style={{ textAlign: "center" }}>Logistic Summary</h4>
                                            </CCol>
                                        </CRow>
                                    </CCardHeader>
                                    <CCardBody>
                                        <CDataTable
                                            items={this.state.content.summaryLogistic}
                                            fields={summaryLogistic}
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
