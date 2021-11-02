import { Fragment, useState, useEffect, useCallback } from "react";
import "./Pabrik.css";
import "./PabrikMedia.css";
import RequestDataForm from "./RequestDataForm";
import RequestDataListExt from "./RequestDataListExt";
import UserService from "../services/user.service";
import showResults from "./showResults/showResults";
// import Web3Modal from "web3modal"
import Web3 from "web3";
// import { ethers } from 'ethers'
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

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

const RequestData = () => {
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
        const accounts = await window.ethereum.enable();
        const signer = accounts[0];
        setWalletSigner(accounts[0]);

        try{
            const formData = new FormData();
            formData.append('nama',values.nama);
            formData.append('alamat',values.alamat);
            formData.append('email',values.email);
            formData.append('data',values.data);
            formData.append('signer', signer);

            // insert data ke mysel
            UserService.RequestData(formData).then(
                async (response) => {
                        console.log('response', response);
                        showResults("Disimpan, menunggu approval");
                },
                (error) => {
                }
            );
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

  return (
    <Fragment>
        {(() => {
            if (loading === true) {
                return (
                    <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                    <div className="sweet-loading">
                        <h5>Mengajukan Permintaan Data</h5><br></br>
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
                    <RequestDataForm onSubmit={handleSubmit} />
                )
            }
        }
        )()}
    </Fragment>
  );
};
export default RequestData;