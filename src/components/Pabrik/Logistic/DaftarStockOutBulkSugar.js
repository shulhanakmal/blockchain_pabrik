import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarLogisticSOBSForm from "./DaftarLogisticSOBSForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { AddLogistics } from "../../../abi/logisticsSobs";
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

  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState( '' );
  const [tanggal, setDate] = useState("");
  const [catchErr, setErr] = useState(false);
  const [proses, setProses] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const [data, setData] = useState(null);

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = process.env.REACT_APP_ADDRESS_SOBS;

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
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
    setLoading(true);
    const formData = new FormData();
    formData.append('date',tanggal);
    formData.append('volume', values.volume);
    formData.append('sugar', values.sugar);
    formData.append('status','normal');
    formData.append('param','stockOutBulkSugar');
    console.log(formData);

    UserService.addLogistic(formData).then(
      async (response) => {

        const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
        const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const {chainId} = await provider.getNetwork();
        const signer = provider.getSigner();

        await UserService.getProsesBlockchain('sobs', response.data.data.id).then(
          (response) => {
            console.log("datanya nih", response.data.data);
            setData(response.data.data);
          },
          (error) => {}
        );

        // input logistik sobs
        if(chainId === parseInt(process.env.REACT_APP_CHAIN_ID)) {
          setProses('Stock Out Bulk Sugar');
          try{
            const updateData = new FormData();
            let contract = new ethers.Contract(contractAddress, AddLogistics, signer)
            let transaction = await contract.addLogisticsSobs(response.data.data.id, json, 'normal', dateString, {
              gasPrice: 7909680,
            })
              updateData.append('transaction', transaction.hash);
              updateData.append('wallet', transaction.from);
              setHash(transaction.hash);
            await transaction.wait()

            updateData.append('id', response.data.data.id);
            updateData.append('flag', 'stockOutBulkSugar');
            UserService.addLogisticsTransactionHash(updateData);
            setHash("");
          } catch(e) {
            console.log(e);
            setErr(true);
          }
          // end input sobs

          await UserService.getProsesBlockchain('sobs', response.data.data.id).then(
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
              let contractStok = new ethers.Contract(process.env.REACT_APP_ADDRESS_STOCK, AddStock, signer)
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
          // end input stok

          await UserService.getProsesBlockchain('sobs', response.data.data.id).then(
            (response) => {
              console.log("datanya nih", response.data.data);
              setData(response.data.data);
            },
            (error) => {}
          );

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

        // input stok
        // if(response.data.stok) {
        //   setProses('Input Stok');
        //   try{
        //     const updateDataStock = new FormData();
        //     let contractStok = new ethers.Contract(process.env.REACT_APP_ADDRESS_STOCK, AddStock, signer)
        //     let transactionStok = await contractStok.addStock(response.data.stok.id, jsonStok, 'normal', dateString)
        //       setHash(transactionStok.hash);
        //       updateDataStock.append('transaction', transactionStok.hash);
        //       updateDataStock.append('wallet', transactionStok.from);
        //     await transactionStok.wait()

        //     updateDataStock.append('id', response.data.stok.id);
        //     updateDataStock.append('flag', 'Stock');
        //     UserService.addStockTransactionHash(updateDataStock);
        //     setHash("");
        //   } catch(e) {
        //     console.log(e);
        //     setErr(true);
        //   }
        // }
        // end input stok
      },
      (error) => {
      }
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  if(redirect) {
    return <Redirect to='/Logistic' />
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
              <DaftarLogisticSOBSForm 
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
