import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarSalesForm from "./DaftarSalesForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { AddSales } from "../../../abi/sales";
import { AddLogistics } from "../../../abi/logisticsSobs";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

import QRcode from "qrcode.react";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

// get date today
var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);


const DaftarSales = () => {
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
  const [qr, setQr] = useState("test");

  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState( '' );
  const [tanggal, setDate] = useState("");
  const [catchErr, setErr] = useState(false);

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = process.env.REACT_APP_ADDRESS_SALES;
  const contractAddressLogistics = process.env.REACT_APP_ADDRESS_SOBS;

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  const handleChange = (value) => {
    setQr(value);
  };

  const downloadQR = (salesId) => {
    const canvas = document.getElementById("myqr");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "" + salesId + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const getWallet = async () => {
    web3.eth.getAccounts(function(err, accounts){
        if (err != null) {
          alert("An error occurred: "+err);
        } else if (accounts.length == 0) {
          alert("User is not logged in to MetaMask");
        } else {
          setAccount(accounts[0])
        }
    });
  };

  const handleSubmit = (values) => {
    // setLoading(true);
    const formData = new FormData();
    formData.append('date',tanggal);
    formData.append('no_do',values.no_do);
    formData.append('buyer',values.buyer);
    formData.append('price',values.price);
    formData.append('sugar',values.sugar);
    formData.append('volume',values.volume);
    formData.append('status','normal');

    const sugar = values.sugar;
    const volume = values.volume;
    UserService.addSales(formData).then(
      async (response) => {

        console.log("CEK RESPONSE DATANYA MAL :", response);

        const salesId = response.data.data.id;
        // const docNumber = response.data.data.no_do;
        // const linkQRCode = "http://127.0.0.1:3000/detailProduk/" + product_id;
        const linkQRCode =
          process.env.REACT_APP_PROD_URL +
          "detailProduk/" +
          sugar +
          "/" +
          salesId;
        await handleChange(linkQRCode);

        const canvas = document.getElementById("myqr");
        let imageBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );

        let formDataQR = new FormData();
        formDataQR.append("files_qr", imageBlob, "" + salesId + ".png");
        console.log("gambar qr", imageBlob, "" + salesId + ".png");
        formDataQR.append("fileName_qr", "" + salesId + ".png");

        downloadQR(salesId);

        UserService.pushQRCodeImage(salesId, formDataQR);

        showResults("Data berhasil dimasukan");

        // setLoading(false);

        // const web3Modal = new Web3Modal();
        // const connection = await web3Modal.connect();
        // const provider = new ethers.providers.Web3Provider(connection);
        // const signer = provider.getSigner();

        // // input sales
        //   try{
        //     const updateData = new FormData();
        //     let contract = new ethers.Contract(contractAddress, AddSales, signer)
        //     let transaction = await contract.addSales(response.data.data.id, response.data.data.date, response.data.data.no_do, response.data.data.buyer, response.data.data.price, sugar, volume, 'normal')
        //       updateData.append('transaction', transaction.hash);
        //       updateData.append('wallet', transaction.from);
        //       setHash(transaction.hash);
        //     await transaction.wait()

        //     updateData.append('id', response.data.data.id);
        //     UserService.addSalesTransactionHash(updateData);
        //   } catch(e) {
        //     console.log(e);
        //     setErr(true);
        //   }
        // // end sales

        // // input logistik sobs
        //   try{
        //     const updateDataL = new FormData();
        //     let contractL = new ethers.Contract(contractAddressLogistics, AddLogistics, signer)
        //     let transactionL = await contractL.addLogisticsSobs(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, response.data.logistik.sugar, 'normal', dateString)
        //       updateDataL.append('transaction', transactionL.hash);
        //       updateDataL.append('wallet', transactionL.from);
        //       setHash(transactionL.hash);
        //     await transactionL.wait()

        //     updateDataL.append('id', response.data.logistik.id);
        //     updateDataL.append('flag', 'stockOutBulkSugar');
        //     UserService.addLogisticsTransactionHash(updateDataL);
        //   } catch(e) {
        //     console.log(e);
        //     setErr(true);
        //   }
        // // end input sobs

        // if(catchErr) {
        //   setLoading(false);
        //   console.log(catchErr);
        // } else {
        //   setLoading(false);
        //   showResults("Dimasukkan");
        // }
        // setHash("");
      },
      (error) => {
      }
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

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
            <>
            <DaftarSalesForm 
              onSubmit={handleSubmit} 
              onSelectDate={handleDate}
            />
            <div style={{ visibility: "hidden" }}>
              {qr ? (
                <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
              ) : (
                <p>No QR code preview</p>
              )}
            </div>
            </>
          )
        }
      })()}
      </Fragment>
  );
};
export default DaftarSales;
