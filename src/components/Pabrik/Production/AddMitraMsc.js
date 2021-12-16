import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import AddMitraMscForm from "./AddMitraMscForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import { useParams } from "react-router";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Web3 from "web3";
import { AddProduct } from "../../../abi/productionMsc";
import { AddProduct as AddCane} from "../../../abi/productionSfc";
import { AddLogistics } from "../../../abi/logisticsSbsfc";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

const AddMitraMsc = () => {
  const { flag } = useParams();
  const { id } = useParams();

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
  const [tanggal, setDate] = useState("");
  const [importir, setImportir] = useState("");
  const [TVolume, setTotalVolume] = useState("");
  // const [dataId, setDataId] = useState(null);
  const [catchErr, setErr] = useState(false);
  const [dataId, setDataId] = useState(id);
  const [jenis, setflag] = useState(flag);

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  // const handleImportir = (value) => {
  //   setImportir(value);
  // };

  const handleSubmit = (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('date',tanggal);
    if(jenis === 'msc') {
      formData.append('mscid', dataId);
      formData.append('param','milledSugarCane');
    } else if(jenis === 'sc') {
      formData.append('scid', dataId);
      formData.append('param','sugarCane');
    } else if(jenis === 'prs') {
      formData.append('prsid', dataId);
      formData.append('param','processedRs');
    } else if(jenis === 'sfrs') {
      formData.append('sfrsid', dataId);
      formData.append('param','sugarFromRs');
    } else {
      formData.append('mscid', null);
    }
    // formData.append('volume',TVolume);
    formData.append('mitra', JSON.stringify(values.mitra));
    formData.append('status','normal');

    console.log('cek Data Mitra', JSON.stringify(values.mitra));
    console.log('cek form', formData);

    if(values.mitra.length > 0) {
      UserService.addProduction(formData).then(
        async (response) => {
          console.log('cek response', response)

          // if(mscId) {
          //   const web3Modal = new Web3Modal();
          //   const connection = await web3Modal.connect();
          //   const provider = new ethers.providers.Web3Provider(connection);
          //   const signer = provider.getSigner();

          //   const accounts = await window.ethereum.enable();
          //   const akun = accounts[0];

          //   // input production msc
          //   try{
          //     const updateData = new FormData();
          //     let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_MSC, AddProduct, signer)
          //     let transaction = await contract.addProductionMsc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString)
          //       updateData.append('transaction', transaction.hash);
          //       updateData.append('wallet', transaction.from);
          //       setHash(transaction.hash);
          //     await transaction.wait()

          //     updateData.append('id', response.data.data.id);
          //     updateData.append('flag', 'milledSugarCane');
          //     UserService.addProdcutionTransactionHash(updateData);
          //     setHash("");
          //   } catch(e) {
          //     console.log(e);
          //     setErr(true);
          //   }
          //   // end input msc

          //   // input sugar cane
          //   try{
          //     const updateDataInput = new FormData();
          //     let contractSC = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFC, AddCane, signer)
          //     let transactionSC = await contractSC.addProductionSfc(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString)
          //       updateDataInput.append('transaction', transactionSC.hash);
          //       updateDataInput.append('wallet', transactionSC.from);
          //       setHash(transactionSC.hash);
          //     await transactionSC.wait()

          //     updateDataInput.append('id', response.data.input.id);
          //     updateDataInput.append('flag', 'sugarCane');
          //     UserService.addProdcutionTransactionHash(updateDataInput);
          //     setHash("");
          //   } catch(e) {
          //     console.log(e);
          //     setErr(true);
          //   }
          //   // end input sugar cane

          //   // input logistik cane
          //   try{
          //     const updateDataLogistik = new FormData();
          //     let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, AddLogistics, signer)
          //     let transactionL = await contractL.addLogisticsSbsfc(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString)
          //       setHash(transactionL.hash);
          //       updateDataLogistik.append('transaction', transactionL.hash);
          //       updateDataLogistik.append('wallet', transactionL.from);
          //     await transactionL.wait()

          //     updateDataLogistik.append('id', response.data.logistik.id);
          //     updateDataLogistik.append('flag', 'stockBulkSugarFromCane');
          //     UserService.addLogisticsTransactionHash(updateDataLogistik);
          //     setHash("");
          //   } catch(e) {
          //     console.log(e);
          //     setErr(true);
          //   }

          //   if(catchErr) {
          //     setLoading(false);
          //     console.log(catchErr);
          //   } else {
          //     setLoading(false);
          //     showResults("Data Berhasil Dimasukkan");
          //   }

          // } else {
          //     console.log('Failed')
          //     setLoading(true);
          // }

          setLoading(false) 

        },(error) => { 
            console.log(error) 
            setLoading(false) 
        }
      );
    } else {
      console.log('failed, Data mitra harus ada');
    }

  }  

  return (
    <Fragment>
      {(() => {
        if (loading === true) {
          return (
            <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
              <div className="sweet-loading">
                <h5>Transaksi akan ditulis ke Blockchain</h5><br></br>
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
          return (
            <AddMitraMscForm 
              onSubmit={handleSubmit}
              FLAG={flag}
            />
          )
          // if(flag === 'prs' || flag === 'sfrs') {
          //   return (
          //     <AddMitraMscForm 
          //       onSubmit={handleSubmit}
          //       FLAG={flag}
          //     />
          //   )
          // } else {
          //   return (
          //     <AddMitraMscForm 
          //       onSubmit={handleSubmit}
          //       FLAG={flag}
          //     />
          //   )
          // }
        }
      })()}
    </Fragment>
  );
};
export default AddMitraMsc;