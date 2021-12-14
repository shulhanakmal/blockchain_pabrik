import { Fragment, useState, React, useEffect } from "react";
// import { Field } from "redux-form";
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
  CInput
} from "@coreui/react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps'
import moment from 'moment';
import UserService from "../services/user.service";

const DetailKebun = (props) => {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [lokasi_lat, setLat] = useState('');
    const [lokasi_lng, setLng] = useState('');
    const [lokasi_label, setLabel] = useState('');
    const [lokasi_title, setTitle] = useState('');

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        UserService.getDetailKebun(id).then(
        (response) => {
            console.log("datanya nih", response);
            setData(response.data.data);
            setLat(response.data.data.lahan_latitude);
            setLng(response.data.data.lahan_longitud);
            setLabel(response.data.data.lahan_inisial);
            setTitle(response.data.data.lahan_name);
        },
        (error) => {}
        );
    };

    const apiKey = 'AIzaSyCwO-uMs8PcFmBON8gqQAVK8EdX1NRUnOU' // api google punya akmal

    const defaultZoom = 11
    // const defaultCenter = { lat: -7.4491301, lng: 110.3810213 }
    const defaultCenter = { lat: parseFloat(lokasi_lat), lng: parseFloat(lokasi_lng) }
    const locations = [{
        lat: parseFloat(lokasi_lat),
        lng: parseFloat(lokasi_lng),
        label: lokasi_label,
        draggable: false,
        title: lokasi_title,
    }]

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

    return (
        <Fragment>
            <main className="c-main">
                <div className="container-fluid">
                    <CCard>
                        <CCardHeader>
                            <CRow>
                                <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                                    <h4 style={{ margin: "auto" }}>Detail Kebun</h4>
                                </CCol>
                                <CCol>
                                    <CButton block color="dark" to="/List-lokasi-kebun">
                                        <span style={{ color: "white" }}>X</span>
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs={5} md={6} lg={6}>
                                    <div>
                                        <h5 style={{ margin: "auto" }}>Mandatory</h5>
                                        &nbsp;
                                    </div>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Mitra Tani</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="luas_lahan"
                                            component="input"
                                            type="text"
                                            defaultValue={data.nama_petani}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Luas Lahan</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="luas_lahan"
                                            component="input"
                                            type="text"
                                            defaultValue={`${data.nama_petani} Hektar`}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Alamat Lahan</CLabel>
                                        <CInput
                                            className="textAreaInput pabrik"
                                            name="alamat_lahan"
                                            component="textarea"
                                            defaultValue={data.alamat_petani}
                                            disabled
                                        />
                                    </CFormGroup>
                                </CCol>
                                <CCol xs={5} md={6} lg={6}>
                                    <div>
                                        <h5 style={{ margin: "auto" }}>Optional</h5>
                                        &nbsp;
                                    </div>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Latitude</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="latitude"
                                            component="input"
                                            type="text"
                                            defaultValue={data.lahan_latitude}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Longitude</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="longitude"
                                            component="input"
                                            type="text"
                                            defaultValue={data.lahan_longitud}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Nama Lahan</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="nama_lahan"
                                            component="input"
                                            type="text"
                                            placeholder="Lahan Pak Nurjamin"
                                            defaultValue={data.lahan_name}
                                            disabled
                                        />
                                    </CFormGroup>
                                    <CFormGroup>
                                        <CLabel htmlFor="nf-namaJenis">Inisial Lahan</CLabel>
                                        <CInput
                                            className="textInput pabrik"
                                            name="inisial_lahan"
                                            component="input"
                                            type="text"
                                            maxLength="3"
                                            placeholder="N01"
                                            defaultValue={data.lahan_inisial}
                                            disabled
                                        />
                                    </CFormGroup>
                                </CCol>
                            </CRow>

                            <CCardBody><ReactGoogleMaps /></CCardBody>

                        </CCardBody>
                    </CCard>
                </div>
            </main>
        </Fragment>
    );
};

export default DetailKebun