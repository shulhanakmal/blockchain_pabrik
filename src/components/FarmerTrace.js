import { Fragment, useState, React, useEffect } from "react";
// import { Field } from "redux-form";
import { useParams } from "react-router";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CButton,
  CRow,
  CCol,
  CDataTable,
} from "@coreui/react";
import moment from 'moment';
import Loader from "react-spinners/DotLoader";
import UserService from "../services/user.service";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const override = `
        display: block;
        margin: 0 auto;
        border-color: red;
        `
    ;

const FarmerTrace = () => {
    const { petaniId } = useParams();
    const [data, setData] = useState(null);
    const [color, setColor] = useState("#3c4b64");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {

            await UserService.TraceTransaksiPetani(petaniId).then(
                (response) => {
                    console.log("datanya nih", response.data);
                    setData(response.data);
                },
                (error) => {}
            );

        } catch (e) {

            alert(e.message);

        }
    };

    const productData = [
        // { key: "user", label: "User", _style: { width: "20%" } },
        { key: "product_id", label: "Product"},
        { key: "flag", label: "Flag"},
        { key: "volume", label: "Volume"},
        { key: "created_at", label: "Created"},
        {
          key: "show_details",
          label: "Trace",
          _style: { width: "10%" },
          filter: false,
        },
    ];

    console.log('cek data petani', petaniId);


    if(data) {

        return (
            <Fragment>
                <main className="c-main">
                    <div className="container-fluid">

                        <CCard >
                            <CCardHeader>
                                <CRow>
                                    <CCol
                                        xs={6}
                                        md={7}
                                        lg={10}
                                        style={{ margin: "auto" }}
                                    >
                                        <h4 style={{ margin: "auto" }}>Product</h4>
                                    </CCol>
                                </CRow>
                            </CCardHeader>
                            <CCardBody>
                                <CCol>
                                    <CDataTable
                                        items={data.produk}
                                        fields={productData}
                                        itemsPerPage={10}
                                        tableFilter
                                        cleaner
                                        itemsPerPageSelect
                                        hover
                                        sorter
                                        pagination
                                        scopedSlots={{
                                            flag: (item) => {
                                                return(
                                                    <td className="py-2">
                                                        {(() => {
                                                            if(item.flag === 'msc') {
                                                                return(
                                                                    'Milled Sugar Cane'
                                                                )
                                                            } else if(item.flag === 'sc') {
                                                                return (
                                                                    'Sugar Cane'
                                                                )
                                                            } else if(item.flag === 'prs') {
                                                                return (
                                                                    'Processed Raw Sugar'
                                                                )
                                                            } else if(item.flag === 'sfrs') {
                                                                return (
                                                                    'Sugar From Raw Sugar'
                                                                )
                                                            } else if(item.flag === 'sbsfc') {
                                                                return (
                                                                    'Stock Bulk Sugar From Cane'
                                                                )
                                                            } else if(item.flag === 'sbsfrs') {
                                                                return (
                                                                    'Stock Bulk Sugar From Raw Sugar'
                                                                )
                                                            }
                                                        })()}
                                                    </td>
                                                )
                                            },
                                            created_at: (item) => {
                                                return (
                                                    <td className="py-2">
                                                        {moment(item.updated_at).format('DD, MMMM, YYYY HH:mm')}
                                                    </td>
                                                );
                                            },
                                            show_details: (item, i) => {
                                                return (
                                                    <td className="py-2">
                                                        {(() => {
                                                            if(item.product_id === (data.sDetail[i] && data.sDetail[i].product_id)) {
                                                                return(
                                                                    <CButton size="sm" color="info" className="ml-1" to={`/detailTracePetani/${petaniId}/${data.sDetail[i].sales_id}/${item.product_id}`} style={{ color: "white" }}>Trace</CButton>
                                                                )
                                                            } else {
                                                                return(
                                                                    'Belum Terjual'
                                                                )
                                                            }
                                                        })()}
                                                    </td>
                                                );
                                            },
                                        }}
                                    />
                                </CCol>
                            </CCardBody>
                        </CCard>

                    </div>
                </main>
            </Fragment>
        );
    } else {
        return (
            <>
            <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                <div className="sweet-loading">
                    <h5>Loading</h5><br></br>
                    {/* <h5>{this.state.TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + this.state.TxnHash} target="_blank" >Detail</a>}</h5> */}
                    <br></br>
                        <Loader color={color} loading={loading} css={override} size={150} />
                    <br></br>
                    <br></br>
                    <h5>Mohon Tunggu...</h5>
                </div>
            </div>
            </>
        )
    }

};

export default FarmerTrace