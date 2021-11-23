import { Fragment, useState, useCallback } from "react";
import "./Pabrik.css";
import "./PabrikMedia.css";
import AddLokasiKebunForm from "./AddLokasiKebunForm";
import UserService from "../services/user.service";
import showResults from "./showResults/showResults";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";
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

const AddLokasiKebun = () => {
  // Can be a string as well. Need to ensure each key-value pair ends with ;
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `
  ;

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#3c4b64");

  let [TxnHash, setHash] = useState("");

  const [balance, setBalance] = useState(0);
  const [akun, setAkun] = useState("");
//   const [data, setData] = useState([]);
//   const [statusData, setStatusData] = useState(false);
  const [walletSigner, setWalletSigner] = useState('');

//   const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
//   const web3 = new Web3(provider);

//   provider.engine.stop();

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log("Value nya nih :", values);

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
        UserService.AddLokasiKebun(formData).then(
          async (response) => {
            if(response.success === false) {
              setLoading(false);
              showResults(`Gagal, ${response.data}`);
            } else {
              setLoading(false);
              showResults("Data Berhasil Disimpan");
            }
          },
          (error) => {
            console.log(error);
            setLoading(false);
            showResults(`${error}`);
          }
        );
    } catch (err) {
        console.log(err);
        setLoading(false);
        showResults(`${err}`);
    }
  };

  return (
    <Fragment>
        {(() => {
            if (loading === true) {
                return (
                    <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                    <div className="sweet-loading">
                        <h5>Membuat Data Petani</h5><br></br>
                        {/* <h5>{TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + TxnHash} target="_blank" >Detail</a>}</h5> */}
                        <br></br>
                            <Loader color={color} loading={loading} css={override} size={150} />
                        <br></br>
                        <br></br>
                        <h5>Mohon Tunggu...</h5>
                    </div>
                    </div>
                )
            } else {
                return(
                  <AddLokasiKebunForm onSubmit={handleSubmit} />
                )
            }
        }
        )()}
    </Fragment>
  );
};
export default AddLokasiKebun;