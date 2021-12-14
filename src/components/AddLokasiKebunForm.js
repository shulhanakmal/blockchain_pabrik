import { Fragment, useState, React, useEffect } from "react";
import { Field, reduxForm } from "redux-form";
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
  CNavLink
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

const AddLokasiKebunForm = (props) => {
    var { handleSubmit } = props;
    console.log("handleSubmit",handleSubmit);
    const [isOpen, setIsOpen] = useState(false);
    const [lokasi_lat, setLat] = useState('');
    const [lokasi_lng, setLng] = useState('');
    const [lokasi_label, setLabel] = useState('');
    const [lokasi_title, setTitle] = useState('');
    const [mt, setMitraTani] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        UserService.getDataMitraTani().then(
        (response) => {
            console.log('response', response);
            setMitraTani(response.data.petani);
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
      <form onSubmit={handleSubmit}>
        <main className="c-main">
            <div className="container-fluid">
                <CCard>
                    <CCardHeader>
                        <CRow>
                            <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                                <h4 style={{ margin: "auto" }}>Add Field</h4>
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
                                    <Field
                                        className="textInput pabrik"
                                        name="mitra"
                                        component="select"
                                        required
                                    >
                                        <option value="">Please Select</option>
                                        {mt && 
                                        mt.map((value, index) => {
                                            return (
                                                <option key={index} value={value.nama_petani}>
                                                    {value.nama_petani}
                                                </option>
                                            );
                                        })}
                                    </Field>
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="nf-namaJenis">Luas Lahan</CLabel>
                                    <Field
                                        className="textInput pabrik"
                                        name="luas_lahan"
                                        component="input"
                                        type="number"
                                        placeholder="hektar"
                                        required
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="nf-namaJenis">Alamat Lahan</CLabel>
                                    <Field
                                        className="textAreaInput pabrik"
                                        name="alamat_lahan"
                                        component="textarea"
                                        type="text"
                                        required
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
                                    <Field
                                        className="textInput pabrik"
                                        name="latitude"
                                        component="input"
                                        type="text"
                                        onChange={(lat) => setLat(lat.currentTarget.value)}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="nf-namaJenis">Longitude</CLabel>
                                    <Field
                                        className="textInput pabrik"
                                        name="longitude"
                                        component="input"
                                        type="text"
                                        onChange={(lng) => setLng(lng.currentTarget.value)}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="nf-namaJenis">Nama Lahan</CLabel>
                                    <Field
                                        className="textInput pabrik"
                                        name="nama_lahan"
                                        component="input"
                                        type="text"
                                        placeholder="Lahan Pak Nurjamin"
                                        onChange={(lahan) => setTitle(lahan.currentTarget.value)}
                                    />
                                </CFormGroup>
                                <CFormGroup>
                                    <CLabel htmlFor="nf-namaJenis">Inisial Lahan</CLabel>
                                    <Field
                                        className="textInput pabrik"
                                        name="inisial_lahan"
                                        component="input"
                                        type="text"
                                        maxLength="3"
                                        placeholder="N01"
                                        onChange={(initial) => setLabel(initial.currentTarget.value)}
                                    />
                                </CFormGroup>
                            </CCol>
                        </CRow>

                        <CCardBody><ReactGoogleMaps /></CCardBody>

                    </CCardBody>
                    <CCardFooter>
                        <CButton type="submit" size="sm" color="primary">Submit</CButton>
                    </CCardFooter>
                </CCard>
            </div>
        </main>
      </form>
    </Fragment>
  );
};

export default reduxForm({
  form: "AddLokasiKebun", // a unique identifier for this form
})(AddLokasiKebunForm);