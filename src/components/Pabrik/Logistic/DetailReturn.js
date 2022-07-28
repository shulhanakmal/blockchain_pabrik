import { Fragment, useState, React, useEffect } from "react";
import { useParams } from "react-router";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CCardFooter,
  CRow,
  CCol,
  CDataTable,
  CNavLink,
  CInput,
  CImg,
  CCollapse
} from "@coreui/react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps'
import moment from 'moment';
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";

const DetailReturn = (props) => {
    const { dok } = useParams();
    const [collapse, setCollapse] = useState(false)
    const [sales, setSales] = useState([]);
    const [produksi, setProduksi] = useState([]);
    const [rbs, setReturn] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [collapseMulti, setCollapseMulti] = useState([]);

    // get data
    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        UserService.getDetailReturn(dok).then(
        (response) => {
            console.log("cek response", response)
            setSales(response.data.sales);
            setReturn(response.data.return);
            setProduksi(response.data.produksi);
        },
        (error) => {}
        );
    };
    // end get data

    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">
                    <CCard style={{ backgroundColor: "#636f83", color: "white" }}>
                        <CCardBody style={{ padding: "5%" }}>

                            <CRow>
                                <CCol xs="2" lg="2">
                                <h1
                                    style={{
                                    transform: "rotate(180deg)",
                                    transformOrigin: "20% 80%",
                                    writingMode: "vertical-lr",
                                    color: "darkBlue",
                                    textAlign: "center",
                                    }}
                                >
                                    <strong>Sales</strong>
                                </h1>

                                </CCol>
                                <CCol xs="2" lg="3">
                                <CImg
                                    src={process.env.REACT_APP_BACKEND_URL +'images/scan/Image-01.png'}
                                    style={{
                                        textAlign: "center",
                                        transformOrigin: "20% 80%",
                                        height: "100px",
                                        width: "100px",
                                        marginTop: "40px",
                                    }}
                                    // className="d-block w-100"
                                    // alt={this.state.product.product_id}
                                    />
                                </CCol>
                                <CCol xs="8" lg="7">
                                <p>
                                    <strong>Document Number:</strong> {sales.no_do}
                                </p>
                                <p>
                                    <strong>Sugar:</strong> {sales.mount_sugar_sold_cane === 0 ? 'Raw Sugar' : 'Cane Sugar'}
                                </p>
                                <p>
                                    <strong>Buyer:</strong> {sales.buyer}
                                </p>
                                <p>
                                    <strong>Price:</strong> Rp. {sales.price}
                                </p>
                                <p>
                                    <strong>Total Volume:</strong> {sales.mount_sugar_sold_cane === 0 ? sales.mount_sugar_sold_rs : sales.mount_sugar_sold_cane}
                                </p>
                                <p>
                                    <strong>Blockchain Hash:</strong> <a size="sm" style={{ color:"#ffffff" }} target="_blank" href={"https://ropsten.etherscan.io/tx/" + sales.transaction_hash} > {sales.transaction_hash} </a>
                                </p>

                                <hr
                                    style={{
                                    marginTop: "60px",
                                    color: "#ffffff",
                                    backgroundColor: "#ffffff",
                                    height: 2,
                                    }}
                                />
                                </CCol>
                            </CRow>

                            <CRow style={{ marginTop: "40px" }}>
                                <CCol xs="2" lg="2">
                                <h1
                                    style={{
                                    transform: "rotate(180deg)",
                                    transformOrigin: "20% 70%",
                                    writingMode: "vertical-lr",
                                    color: "darkBlue",
                                    textAlign: "center",
                                    }}
                                >
                                    <strong>Production</strong>
                                </h1>
                                </CCol>
                                <CCol xs="2" lg="3">
                                <CImg
                                    src={process.env.REACT_APP_BACKEND_URL +'images/scan/Image-02.png'}
                                    style={{
                                        textAlign: "center",
                                        transformOrigin: "20% 80%",
                                        height: "100px",
                                        width: "100px",
                                        marginTop: "40px",
                                    }}
                                    // className="d-block w-100"
                                    // alt={this.state.product.product_id}
                                    />
                                </CCol>
                                <CCol xs="8" lg="7">
                                    {/* loop produk */}
                                    {produksi && produksi.map((prod, index) => {
                                        if(prod != null) {
                                            return (
                                                <Fragment key={index}>
                                                    <p>
                                                        <strong>Product :</strong> {prod.product_id}
                                                    </p>
                                                    <p>
                                                        <strong>Production Date :</strong> {moment(prod.date).format('DD-MMM-YYYY')}
                                                    </p>
                                                    <p>
                                                        <strong>Volume :</strong> {prod.volume}
                                                    </p>
                                                    <p>
                                                        <strong>Icumsa :</strong> {prod.icumsa}
                                                    </p>
                                                    <p>
                                                        <strong>Berat Jenis :</strong> {prod.bjb}
                                                    </p>
                                                    <p>
                                                        <strong>Kadar Air :</strong> {prod.ka}
                                                    </p>
                                                    <p>
                                                        <strong>Brix :</strong> {prod.brix}
                                                    </p>
                                                    <p>
                                                        <strong>Trash :</strong> {prod.trash}
                                                    </p>
                                                    <p>
                                                        <strong>Blockchain Hash :</strong> <a size="sm" style={{ color:"#ffffff" }} target="_blank" href={"https://ropsten.etherscan.io/tx/" + prod.transaction_hash} > {prod.transaction_hash} </a>
                                                    </p>

                                                    <hr
                                                    style={{
                                                        marginTop: "60px",
                                                        color: "#ffffff",
                                                        backgroundColor: "#ffffff",
                                                        height: 2,
                                                    }}
                                                    />
                                                </Fragment>
                                            )
                                        }
                                    })}
                                    {/* end loop */}
                                </CCol>
                            </CRow>

                            <CRow style={{ marginTop: "40px" }}>
                                <CCol xs="2" lg="2">
                                <h1
                                    style={{
                                    transform: "rotate(180deg)",
                                    transformOrigin: "20% 70%",
                                    writingMode: "vertical-lr",
                                    color: "darkBlue",
                                    textAlign: "center",
                                    }}
                                >
                                    {/* <strong>Product Dan Mitra</strong> */}
                                    <strong>Return</strong>
                                </h1>
                                </CCol>
                                <CCol xs="2" lg="3">
                                <CImg
                                    src={process.env.REACT_APP_BACKEND_URL +'images/scan/Image-03.png'}
                                    style={{
                                        textAlign: "center",
                                        transformOrigin: "20% 80%",
                                        height: "100px",
                                        width: "100px",
                                        marginTop: "40px",
                                    }}
                                    // className="d-block w-100"
                                    // alt={this.state.product.product_id}
                                    />
                                </CCol>
                                <CCol xs="8" lg="7">
                                    {rbs && rbs.map((r, index) => {
                                        if(r != null && r.transaction_hash != null) {
                                            return (
                                                <Fragment key={index}>
                                                    <hr></hr>
                                                    {/* <p>
                                                        <strong>Return</strong>
                                                    </p> */}
                                                    <p>
                                                        <strong><b> Date Return :</b></strong> {moment(r.date).format('DD-MMM-YYYY')}
                                                    </p>
                                                    <p>
                                                        <strong><b> Volume :</b></strong> {r.volume}
                                                    </p>
                                                    <p>
                                                        <strong><b> Return Product :</b></strong> {r.product_id}
                                                    </p>
                                                    <p>
                                                        <strong><b> Blockchain Hash :</b></strong> <a size="sm" style={{ color:"#ffffff" }} target="_blank" href={"https://ropsten.etherscan.io/tx/" + r.transaction_hash} > {r.transaction_hash} </a>
                                                    </p>
                                                </Fragment>
                                            )
                                        }
                                    })}
                                </CCol>
                            </CRow>

                        </CCardBody>
                    </CCard>
                </div>
            </main>
        </Fragment>

        // <Fragment>
        //     <main className="c-main">
        //         <div className="container-fluid">
        //             <CCard>
        //                 <CCardHeader>
        //                     <CRow>
        //                         <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
        //                             <h4 style={{ margin: "auto" }}>Detail Return</h4>
        //                         </CCol>
        //                         <CCol>
        //                             <CButton block color="dark" to="/Logistic">
        //                                 <span style={{ color: "white" }}>X</span>
        //                             </CButton>
        //                         </CCol>
        //                     </CRow>
        //                 </CCardHeader>
        //                 <CCardBody>
        //                     <h5>Sales</h5>
        //                     <CRow>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Dokumen</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={sales.no_do}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Buyer</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={sales.buyer}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                     </CRow>
        //                     <CRow>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Price</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={sales.price}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Sugar</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={sales.mount_sugar_sold_cane === 0 ? 'Raw Sugar' : 'Cane Sugar'}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                     </CRow>
        //                     <CRow>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Volume</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={sales.mount_sugar_sold_cane === 0 ? sales.mount_sugar_sold_rs : sales.mount_sugar_sold_cane}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">BLockchain Hash</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={sales.transaction_hash}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                     </CRow>
        //                     <CCol style={{textAlign:"center"}}>
        //                         <CImg
        //                             src={'http://209.97.160.154:8002/' + sales.qrcode}
        //                             // className="d-block w-100"
        //                             style={{width:"250px", height:"250px"}}
        //                         />
        //                     </CCol>
        //                     <hr></hr>

        //                     <h5>Production</h5>
        //                     { produksi && produksi.map((prod, index) => {
        //                         return (
        //                             <CCard className="container-fluid">
        //                                 <CRow>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Product</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.product_id}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                 </CRow>
        //                                 <CRow>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Production Date</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={moment(prod.date).format('DD-MMM-YYYY')}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Volume</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.volume}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                 </CRow>
        //                                 <CRow>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Icumsa</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.icumsa}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Berat Jenis</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.bjb}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                 </CRow>
        //                                 <CRow>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Kadar Air</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.ka}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Brix</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.brix}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                 </CRow>
        //                                 <CRow>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Trash</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.trash}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                     <CCol>
        //                                         <CFormGroup>
        //                                             <CLabel htmlFor="nf-namaJenis">Blockchain Hash</CLabel>
        //                                             <CInput
        //                                                 className="textInput pabrik"
        //                                                 name="nama"
        //                                                 component="input"
        //                                                 type="text"
        //                                                 defaultValue={prod.transaction_hash}
        //                                                 disabled
        //                                             />
        //                                         </CFormGroup>
        //                                     </CCol>
        //                                 </CRow>
        //                             </CCard>
        //                         );
        //                     })}

        //                     <hr></hr>

        //                     <h5>Return</h5>
        //                     <CRow>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Date Return</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={moment(rbs.date).format('DD-MMM-YYYY')}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                         <CCol>
        //                             <CFormGroup>
        //                                 <CLabel htmlFor="nf-namaJenis">Volume</CLabel>
        //                                 <CInput
        //                                     className="textInput pabrik"
        //                                     name="nama"
        //                                     component="input"
        //                                     type="text"
        //                                     defaultValue={rbs.volume}
        //                                     disabled
        //                                 />
        //                             </CFormGroup>
        //                         </CCol>
        //                     </CRow>

        //                 </CCardBody>
        //             </CCard>
        //         </div>
        //     </main>
        // </Fragment>
    );
};

export default DetailReturn