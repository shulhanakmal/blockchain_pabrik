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
} from "@coreui/react";
import moment from 'moment';
import UserService from "../../../services/user.service";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const ProsesBlockchain = () => {
    const { flag } = useParams();
    const { productId } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        UserService.getProsesBlockchain(flag, productId).then(
            (response) => {
                console.log("datanya nih", response.data.data);
                setData(response.data.data);
            },
            (error) => {}
        );
    };

    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">

                    <CCard color="secondary">
                        <CCardHeader>
                            <CRow>
                                <CCol
                                    xs={6}
                                    md={7}
                                    lg={10}
                                    style={{ margin: "auto" }}
                                >
                                    <h4 style={{ margin: "auto" }}>Proses Blockchain</h4>
                                </CCol>
                                <CCol>
                                    {(() => {
                                        if(flag === 'sales') {
                                            return(
                                                <CButton
                                                    // block
                                                    color="dark"
                                                    to="/Sales"
                                                >
                                                    Kembali
                                                </CButton>
                                            )
                                        } else if(flag === 'sbsfc' || flag === 'sbsfrs' || flag === 'sobs' || flag === 'rbs') {
                                            return(
                                                <CButton
                                                    // block
                                                    color="dark"
                                                    to="/Logistic"
                                                >
                                                    Kembali
                                                </CButton>
                                            )
                                        } else {
                                            return(
                                                <CButton
                                                    // block
                                                    color="dark"
                                                    to="/Production"
                                                >
                                                    Kembali
                                                </CButton>
                                            )
                                        }
                                    })()}
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <div style={{width:'50%'}}>
                                <VerticalTimeline layout={'1-column-left'}>

                                    {data && data.map((value, index) => {
                                        if(value.Data && value.Data.transaction_hash){
                                            return (
                                                <VerticalTimelineElement key={index}
                                                    className="vertical-timeline-element--work"
                                                    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                                                    date={moment(value.Data.updated_at).format('DD, MMMM, YYYY HH:mm')}
                                                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                                    // icon={cil3d}
                                                >
                                                    <p>
                                                        {value.flag}
                                                    </p>
                                                    <hr></hr>
                                                    <i>{value.Data.transaction_hash}</i>
                                                    <hr></hr>
                                                </VerticalTimelineElement>
                                            );
                                        } else {
                                            return (
                                                <VerticalTimelineElement key={index}
                                                    className="vertical-timeline-element--work"
                                                    contentStyle={{ background: 'grey', color: '#fff' }}
                                                    contentArrowStyle={{ borderRight: '7px solid  grey' }}
                                                    // date="03 Agustus 2022 : 15:34"
                                                    iconStyle={{ background: 'grey', color: '#fff' }}
                                                    // icon={cil3d}
                                                >
                                                    <p>
                                                        {value.flag}
                                                    </p>
                                                </VerticalTimelineElement>
                                            );
                                        }
                                    })}
                                    <VerticalTimelineElement
                                        iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
                                        // icon={<StarIcon />}
                                    />
                                </VerticalTimeline>
                            </div>
                        </CCardBody>
                    </CCard>

                </div>
            </main>
        </Fragment>
    );
};

export default ProsesBlockchain