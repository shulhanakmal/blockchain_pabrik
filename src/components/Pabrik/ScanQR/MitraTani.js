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

const DetailMitraTaniView = (props) => {
    const { id } = useParams();
    const [collapse, setCollapse] = useState(false)
    const [data, setData] = useState([]);
    const [kebun, setKebun] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [collapseMulti, setCollapseMulti] = useState([]);
    const [lokasi, setLokasi] = useState();

    // get data
    useEffect(() => {
        getData();
        getLokasi();
    }, []);

    const getData = () => {
        UserService.getDetailMitraTani(id).then(
        (response) => {
            console.log("cek response", response)
            setData(response.data.petani);
            setKebun(response.data.kebun);
            
            
            let y = []
            response.data.kebun && response.data.kebun.map((value, index) => {
                let x = {}

                x['lat'] = parseFloat(value.lahan_latitude)
                x['lng'] = parseFloat(value.lahan_longitud)
                x['label'] = value.lahan_inisial
                x['draggable'] = false
                x['title'] = value.lahan_name
                y[index] = x
            })
            
            setLokasi(y)
        },
        (error) => {}
        );
    };
    // end get data

    const getLokasi = () => {

        console.log("Cek Kebun", kebun);
        let y = []
        kebun && kebun.map((value, index) => {
            let x = {}

            x['lat'] = parseFloat(value.lahan_latitude)
            x['lng'] = parseFloat(value.lahan_longitud)
            x['label'] = value.lahan_inisial
            x['draggable'] = false
            x['title'] = value.lahan_name
            y[index] = x
        })
        
        setLokasi(y)
    }

    // collapse
    const toggle = (e) => {
        setCollapse(!collapse)
        e.preventDefault()
    }

    const toggleMulti = async (type) => {
        let newCollapse = collapseMulti.slice()

        kebun && kebun.map((value, index) => {
            if(value.lahan_name === type) {
                newCollapse[index] = !collapseMulti[index];
            }
        })

        setCollapseMulti(newCollapse)
    }
    // end collapse

    // google maps
    const apiKey = 'AIzaSyCwO-uMs8PcFmBON8gqQAVK8EdX1NRUnOU' // api google punya akmal

    const defaultZoom = 5
    const defaultCenter = { lat: -7.4491301, lng: 110.3810213 }
    // const defaultCenter = { lat: parseFloat(lokasi_lat), lng: parseFloat(lokasi_lng) }

    console.log("CEK INI", lokasi);
    
    const locations = lokasi

    const MarkerList = () => {
        return locations.map((location, index) => {
            return (
                <MarkerWithInfoWindow key={index.toString()} location={location}/>
            )
        })
    }

    const MarkerWithInfoWindow = ({location}) => {
        return (
            <Marker 
                onClick={() => setIsOpen(!isOpen)} 
                position={location} 
                title={location.title} 
                label={location.label}
            >
            { isOpen &&
                <InfoWindow onCloseClick={() => setIsOpen(false)}>
                <CNavLink >{location.title}</CNavLink>
                </InfoWindow>
            }
            </Marker>
        )
    }

    const GoogleMapsComponent = withScriptjs(withGoogleMap(() => {
        return (
        <GoogleMap defaultZoom={defaultZoom} defaultCenter={defaultCenter}>
        {/* <GoogleMap defaultZoom={defaultZoom} defaultCenter={locations}> */}
            {<MarkerList />}
        </GoogleMap>
        )
    }))

    const ReactGoogleMaps = () => {
        return (
            <CCard>
                <GoogleMapsComponent
                    key="map"
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`}
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{height: `400px`}}/>}
                    mapElement={<div style={{height: `100%`}}/>}
                />
            </CCard>
        )
    }
    // end google maps

    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">
                    <CCard>
                        <CCardHeader>
                            <CRow>
                                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                                    <h4 style={{ margin: "auto" }}>Detail Farmer Partner</h4>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs={6} md={6} lg={6}>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Nama</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="nama"
                                            component="input"
                                            type="text"
                                            defaultValue={data.nama_petani}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Kontak</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="kontak"
                                            component="input"
                                            type="text"
                                            defaultValue={data.kontak}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Email</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="email"
                                            component="input"
                                            type="email"
                                            defaultValue={data.email}
                                            disabled
                                        />
                                    </CFormGroup>
                                </CCol>
                                <CCol xs={6} md={6} lg={6}>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Luas Lahan</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="luas_lahan"
                                            component="input"
                                            type="number"
                                            defaultValue={data.luas_lahan}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Status</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="status"
                                            component="input"
                                            type="text"
                                            defaultValue={data.status}
                                            disabled
                                        />
                                    </CFormGroup>
                                </CCol>
                            </CRow>

                            <CCardBody>
                                <div>
                                    <p>
                                        {kebun && 
                                        kebun.map((value, index) => {
                                            return (
                                                <>
                                                <CButton color="info" onClick={()=>{toggleMulti(`${value.lahan_name}`)}}>
                                                {value.lahan_name}</CButton>{' '}
                                                </>
                                            );
                                        })}
                                        {/* <CButton color="primary" onClick={()=>{toggleMulti('All')}}>
                                        All</CButton>{' '} */}
                                    </p>
                                    <CRow>
                                        {kebun && 
                                        kebun.map((value, index) => {
                                            return (
                                               <CCol xs={12} md={12} lg={12}>
                                                    <CCollapse show={collapseMulti[index]}>
                                                        <CCard>
                                                            <CCardBody>
                                                                <div>
                                                                    <CLabel htmlFor="nf-namaJenis">Mitra Tani : {value.nama_petani}</CLabel>
                                                                </div>
                                                                <div>
                                                                    <CLabel htmlFor="nf-namaJenis">Luas Lahan : {value.luas_lahan}</CLabel>
                                                                </div>
                                                                <div>
                                                                    <CLabel htmlFor="nf-namaJenis">Alamat Lahan : {value.alamat_petani}</CLabel>
                                                                </div>
                                                            </CCardBody>
                                                        </CCard>
                                                    </CCollapse>
                                                </CCol>
                                            );
                                        })}
                                    </CRow>
                                </div>
                            </CCardBody>

                            <CCardBody><ReactGoogleMaps /></CCardBody>

                        </CCardBody>
                    </CCard>
                </div>
            </main>
        </Fragment>
    );
};

export default DetailMitraTaniView