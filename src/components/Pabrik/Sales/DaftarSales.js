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
import { AddStock } from "../../../abi/addStock";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";
import { Redirect } from "react-router-dom";
import QRcode from "qrcode.react";
import moment from 'moment';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";

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
  const [proses, setProses] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [data, setData] = useState(null);

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = process.env.REACT_APP_ADDRESS_SALES;
  const contractAddressLogistics = process.env.REACT_APP_ADDRESS_SOBS;
  const contractAddressStock = process.env.REACT_APP_ADDRESS_STOCK;

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
        setLoading(true);

        console.log("CEK RESPONSE DATANYA MAL :", response);

        const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
        const jsonLogistickOut = JSON.stringify(response.data.logistik, null, 4).replace(/[",\\]]/g, "")
        const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const {chainId} = await provider.getNetwork();
        const signer = provider.getSigner();

        await UserService.getProsesBlockchain('sales', response.data.data.id).then(
          (response) => {
            console.log("datanya nih", response.data.data);
            setData(response.data.data);
          },
          (error) => {}
        );

// input sales into blockchain
        if(chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
          setProses('Sales');
          try{
            const updateData = new FormData();
            let contract = new ethers.Contract(contractAddress, AddSales, signer)
            let transaction = await contract.addSales(response.data.data.id, json, 'normal', dateString, {
              gasPrice: 7909680,
            })
              updateData.append('transaction', transaction.hash);
              updateData.append('wallet', transaction.from);
              setHash(transaction.hash);
            await transaction.wait()

            updateData.append('id', response.data.data.id);
            UserService.addSalesTransactionHash(updateData);
          } catch(e) {
            console.log(e);
            setErr(true);
          }
// end sales

          await UserService.getProsesBlockchain('sales', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );

// input logistik sobs into blockchain
        setProses('Stock Out Bulk Sugar');
          try{
            const updateDataL = new FormData();
            let contractL = new ethers.Contract(contractAddressLogistics, AddLogistics, signer)
            let transactionL = await contractL.addLogisticsSobs(response.data.logistik.id, jsonLogistickOut, 'normal', dateString)
              updateDataL.append('transaction', transactionL.hash);
              updateDataL.append('wallet', transactionL.from);
              setHash(transactionL.hash);
            await transactionL.wait()

            updateDataL.append('id', response.data.logistik.id);
            updateDataL.append('flag', 'stockOutBulkSugar');
            UserService.addLogisticsTransactionHash(updateDataL);
          } catch(e) {
            console.log(e);
            setErr(true);
          }
// end input sobs

          await UserService.getProsesBlockchain('sales', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );

// input stok into blockchain
        setProses('Input Stok');
          try{
            const updateDataStok = new FormData();
            let contractStok = new ethers.Contract(contractAddressStock, AddStock, signer)
            let transactionStok = await contractStok.addStock(response.data.stok.id, jsonStok, 'normal', dateString)
              updateDataStok.append('transaction', transactionStok.hash);
              updateDataStok.append('wallet', transactionStok.from);
              setHash(transactionStok.hash);
            await transactionStok.wait()

            updateDataStok.append('id', response.data.stok.id);
            updateDataStok.append('flag', 'Stock');
            UserService.addStockTransactionHash(updateDataStok);
          } catch(e) {
            console.log(e);
            setErr(true);
          }
// end input stok

          await UserService.getProsesBlockchain('sales', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );

          const salesId = response.data.data.id;
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

          if(catchErr) {
            setLoading(false);
            console.log(catchErr);
          } else {
            setLoading(false);
            showResults("Data berhasil dimasukan");
          }
          setHash("");
          setLoading(false);
        } else {
          setLoading(false);
          alert('Anda tidak terhubung ke jaringan ethereum ropsten, harap hubungkan metamask ke jaringan ethereum ropsten');
          setRedirect(true);
        }

      },
      (error) => {
      }
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  if(redirect) {
    return <Redirect to='/Sales' />
  } else {
    return (
      <Fragment>
        {(() => {
          if (loading === true) {
            return (
              <Fragment>
                <CCard color="secondary">
                  <CRow>
                    <CCol md="7">
                      <div>
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
                                  <br></br>
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
                    </CCol>

                    <CCol md="5">
                      <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                        <div className="sweet-loading">
                          <h5>Transaksi <b>{proses}</b> akan ditulis ke Blockchain</h5><br></br>
                          {/* <h5>{TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + TxnHash} target="_blank" >Detail</a>}</h5> */}
                          <br></br>
                          <Loader color={color} loading={loading} css={override} size={150} />
                          <br></br>
                          <br></br>
                          <h5>Mohon Tunggu...</h5>
                          <br></br>

                        </div>
                      </div>
                    </CCol>
                  </CRow>
                </CCard>
                <div style={{ visibility: "hidden" }}>
                  {qr ? (
                    <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
                  ) : (
                    <p>No QR code preview</p>
                  )}
                </div>
              </Fragment>
              // <>
              //   <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
              //     <div className="sweet-loading">
              //       <h5>Transaksi <b>{proses}</b> akan ditulis ke Blockchain</h5><br></br>
              //       {/* <h5>{TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + TxnHash} target="_blank" >Detail</a>}</h5> */}
              //       <br></br>
              //       <Loader color={color} loading={loading} css={override} size={150} />
              //       <br></br>
              //       <br></br>
              //       <h5>Mohon Tunggu...</h5>
              //     </div>
              //   </div>
              //   <div style={{ visibility: "hidden" }}>
              //     {qr ? (
              //       <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
              //     ) : (
              //       <p>No QR code preview</p>
              //     )}
              //   </div>
              // </>
            )
          } else {
            return (
              <DaftarSalesForm 
                onSubmit={handleSubmit} 
                onSelectDate={handleDate}
              />
            )
          }
        })()}
        </Fragment>
    );
  }
};
export default DaftarSales;
