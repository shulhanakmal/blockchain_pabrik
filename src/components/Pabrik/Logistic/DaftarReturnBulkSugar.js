import { Fragment, useState, useEffect } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarReturnBulkSugarForm from "./DaftarReturnBulkSugarForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { AddLogistics } from "../../../abi/logisticsRbs";
import { AddLogistics as AddStockCane } from "../../../abi/logisticsSbsfc";
import { AddLogistics  as AddStockRS } from "../../../abi/logisticsSbsfrs";
import { AddStock } from "../../../abi/addStock";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";
import { Redirect } from "react-router-dom";
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

const DaftarLogistic = () => {
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

  const [account, setAccount] = useState( '' );
  const [tanggal, setDate] = useState("");
  const [catchErr, setErr] = useState(false);
  const [proses, setProses] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [data, setData] = useState(null);

  const [productId, setProductId] = useState("");

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = process.env.REACT_APP_ADDRESS_RBS;
  const contractAddressSBSFC = process.env.REACT_APP_ADDRESS_SBSFC;
  const contractAddressSBSFRS = process.env.REACT_APP_ADDRESS_SBSFRS;
  const contractAddressSTOCK = process.env.REACT_APP_ADDRESS_STOCK;

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    UserService.getListLogisticForIDProduct('rbs', dateString).then(
      (response) => {
        console.log(response.data);
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear().toString().substr(-2);

        if (date < 10) {
          date = "0" + date;
        }
        if (month < 10) {
          month = "0" + month;
        }

        if(response.data.data.length === 0) {
          var product_id = "Return-" + year + month + date + '01';
          setProductId(product_id);
        } else {
          // setProductId(resultIDBatch)
          const dataBaru = response.data.data.sort().reverse();

          var product_id = dataBaru[0];
          var count = product_id.match(/\d*$/);

          // Take the substring up until where the integer was matched
          // Concatenate it to the matched count incremented by 1
          product_id = product_id.substr(0, count.index) + (++count[0]);

          setProductId(product_id)

        }
        console.log('cek productId', product_id);
      },
      (error) => {
        setErr((error.response && error.response.data && error.response.data.message) || error.message || error.toString())
      }
    );
  };

  // const getWallet = async () => {
  //   web3.eth.getAccounts(function(err, accounts){
  //       if (err != null) {
  //         alert("An error occurred: "+err);
  //       } else if (accounts.length == 0) {
  //         alert("User is not logged in to MetaMask");
  //       } else {
  //         setAccount(accounts[0])
  //       }
  //   });
  // };

  const handleSubmit = (values) => {
    setLoading(true);
    const formData = new FormData();
    console.log(values);
    formData.append('product',productId);
    formData.append('date',tanggal);
    formData.append('buyer',values.buyer);
    formData.append('sugar',values.sugar);
    formData.append('no_do',values.transaksi);
    formData.append('volume',values.volume);
    formData.append('status','normal');
    formData.append('param','returnBulkSugar');

    UserService.addLogistic(formData).then(
      async (response) => {

        console.log('cek response', response);

        const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
        const jsonLogistic = JSON.stringify(response.data.stock, null, 4).replace(/[",\\]]/g, "")
        const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const {chainId} = await provider.getNetwork();
        const signer = provider.getSigner();

        await UserService.getProsesBlockchain('rbs', response.data.data.id).then(
          (response) => {
            console.log("datanya nih", response.data.data);
            setData(response.data.data);
          },
          (error) => {}
        );

        // input logistik rbs
        if(chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
          setProses('Return Bulk Sugar');
          try{
            const updateData = new FormData();
            console.log("CEK ADDRESS MAL :", contractAddress);
            let contract = new ethers.Contract(contractAddress, AddLogistics, signer)
            let transaction = await contract.addLogisticsRbs(response.data.data.id, json, 'normal', dateString, {
              gasPrice: 7909680,
            })
              updateData.append('transaction', transaction.hash);
              updateData.append('wallet', transaction.from);
              setHash(transaction.hash);
            await transaction.wait()

            updateData.append('id', response.data.data.id);
            updateData.append('flag', 'returnBulkSugar');
            UserService.addLogisticsTransactionHash(updateData);
          } catch(e) {
            console.log(e);
            setErr(true);
          }
          // end input rbs

          await UserService.getProsesBlockchain('rbs', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );

          // post ke blockchain data return ke stock (stok menambah dari return)
          if(values.sugar === 'cane'){
            setProses('Stock Bulk Sugar From Cane');
            try{
              const txnCane = new FormData();
              let contractC = new ethers.Contract(contractAddressSBSFC, AddStockCane, signer)
              let transactionC = await contractC.addLogisticsSbsfc(response.data.stock.id, jsonLogistic, 'normal', dateString)
                txnCane.append('transaction', transactionC.hash);
                txnCane.append('wallet', transactionC.from);
                setHash(transactionC.hash);
              await transactionC.wait()

              txnCane.append('id', response.data.stock.id);
              txnCane.append('flag', 'stockBulkSugarFromCane');
              UserService.addLogisticsTransactionHash(txnCane);
            } catch(e) {
              console.log(e);
              setErr(true);
            }

          } else {
            setProses('Stock Bulk Sugar From Raw Sugar');
            try{
              const txnRS = new FormData();
              let contractRS = new ethers.Contract(contractAddressSBSFRS, AddStockRS, signer)
              let transactionRS = await contractRS.addLogisticsSbsfrs(response.data.stock.id, jsonLogistic, 'normal', dateString)
                txnRS.append('transaction', transactionRS.hash);
                txnRS.append('wallet', transactionRS.from);
                setHash(transactionRS.hash);
              await transactionRS.wait()

              txnRS.append('id', response.data.stock.id);
              txnRS.append('flag', 'stockBulkSugarFromRs');
              UserService.addLogisticsTransactionHash(txnRS);
            } catch(e) {
              console.log(e);
              setErr(true);
            }
          }

          await UserService.getProsesBlockchain('rbs', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );

          // input stok
          if(response.data.stok) {
            setProses('Input Stok');
            try{
              const updateDataStock = new FormData();
              let contractStok = new ethers.Contract(contractAddressSTOCK, AddStock, signer)
              let transactionStok = await contractStok.addStock(response.data.stok.id, jsonStok, 'normal', dateString)
                setHash(transactionStok.hash);
                updateDataStock.append('transaction', transactionStok.hash);
                updateDataStock.append('wallet', transactionStok.from);
              await transactionStok.wait()

              updateDataStock.append('id', response.data.stok.id);
              updateDataStock.append('flag', 'Stock');
              UserService.addStockTransactionHash(updateDataStock);
              setHash("");
            } catch(e) {
              console.log(e);
              setErr(true);
            }
          }

          await UserService.getProsesBlockchain('rbs', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );
          // end input stok

          setHash("");

          if(catchErr) {
            setLoading(false);
            console.log(catchErr);
          } else {
            setLoading(false);
            showResults("Data Berhasil Dimasukkan");
          }
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

  if(redirect) {
    return <Redirect to="/Logistic" />
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
              </Fragment>
              // <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
              //   <div className="sweet-loading">
              //     <h5>Transaksi <b>{proses}</b> akan ditulis ke Blockchain</h5><br></br>
              //     {/* <h5>{TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + TxnHash} target="_blank" >Detail</a>}</h5> */}
              //     <br></br>
              //     <Loader color={color} loading={loading} css={override} size={150} />
              //     <br></br>
              //     <br></br>
              //     <h5>Mohon Tunggu...</h5>
              //   </div>
              // </div>
            )
          } else {
            return (
              <DaftarReturnBulkSugarForm 
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
export default DaftarLogistic;