import { Fragment, useState, useEffect, useCallback } from "react";
import "./Pabrik.css";
import "./PabrikMedia.css";
import EditLokasiKebunForm from "./EditLokasiKebunForm";
import UserService from "../services/user.service";
import showResults from "./showResults/showResults";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";
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
} from "@coreui/react";

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

const EditLokasiKebun = () => {

  const { id } = useParams();
  // Can be a string as well. Need to ensure each key-value pair ends with ;
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `
  ;

  let [color, setColor] = useState("#3c4b64");

  const [loading, setLoading] = useState(0);
  const [data, setData] = useState(0);
  const [akun, setAkun] = useState("");

  const getData = () => {

    UserService.getDetailKebun(id).then(
        (response) => {
            setData(response.data.data);
        },
    );

  }

    useEffect(() => {
        getData();
    }, []);

  const handleSubmit = async (values) => {
    setLoading(true);

    try{
        const formData = new FormData();
        formData.append('mitra_tani',values.mitra);
        formData.append('luas_lahan',values.luas_lahan);
        formData.append('alamat_lahan',values.alamat_lahan);
        formData.append('latitude',values.latitude);
        formData.append('longitude', values.longitude);
        formData.append('nama_lahan', values.nama_lahan);
        formData.append('inisial_lahan', values.inisial_lahan);

        // insert data ke mysel
        await UserService.EditLokasiKebun(id, formData).then(
          async (response) => {
            if(response.data.message) {
              setLoading(false);
              showResults(response.data.message);
            } else {
              setLoading(false);
              showResults("Data Berhasil Disimpan");
            }
          },
          (error) => {
            console.log(error);
            setLoading(false);
            showResults(`${error.message}`);
          }
        );
    } catch (err) {
        console.log(err);
        setLoading(false);
        showResults(`${err.message}`);
    }

  };

  return (
    <Fragment>
        {(() => {
            if (loading === true) {
                return (
                    <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                        <div className="sweet-loading">
                            <h5>Processing...</h5><br></br>
                            {/* <h5>{TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + TxnHash} target="_blank" >Detail</a>}</h5> */}
                            <br></br>
                                <Loader color={color} loading={loading} css={override} size={150} />
                            <br></br>
                            <br></br>
                            <h5>Please Wait...</h5>
                        </div>
                    </div>
                )
            } else {
                if(data) {
                    return(
                        <EditLokasiKebunForm onSubmit={handleSubmit} DATA={data} />
                    )
                } else {
                    return (
                        <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                            <div className="sweet-loading">
                                <br></br>
                                <br></br>
                                <br></br>
                                <h5>Please Wait...</h5>
                            </div>
                        </div>
                    )
                }
            }
        }
        )()}
    </Fragment>
  );
};
export default EditLokasiKebun;