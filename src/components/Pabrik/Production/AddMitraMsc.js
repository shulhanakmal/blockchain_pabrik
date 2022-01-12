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
import { AddProduct as AddMSC } from "../../../abi/productionMsc";
import { AddProduct as AddSFC } from "../../../abi/productionSfc";
import { AddProduct as AddPRS } from "../../../abi/productionPrs";
import { AddProduct as AddSFRS } from "../../../abi/productionSfrs";
import { AddLogistics as AddSBSFC } from "../../../abi/logisticsSbsfc";
import { AddLogistics as AddSBSFRS } from "../../../abi/logisticsSbsfrs";
import { AddStock } from "../../../abi/addStock";
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

  const [produkId, setProdukId] = useState("");

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  // const handleImportir = (value) => {
  //   setImportir(value);
  // };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    UserService.getDataForAddMitra(flag, id).then(
      async (response) => {
        console.log('cek response', response);
        setProdukId(response.data.data.product_id);
      }
    )
  }

  const handleSubmit = (values) => {
    console.log('jenis', jenis);
    console.log('dataId', dataId);
    console.log('values', values);
    setLoading(true);


    const formData = new FormData();
    formData.append('product',produkId);
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
    } else if(jenis === 'sbsfc') {
      formData.append('sbsfcid', dataId);
      formData.append('param','stockBulkSugarFromCane');
    } else if(jenis === 'sbsfrs') {
      formData.append('sbsfrsid', dataId);
      formData.append('param','stockBulkSugarFromRs');
    } else {
      formData.append('mscid', null);
    }
    // formData.append('volume',TVolume);
    formData.append('mitra', JSON.stringify(values.mitra));
    formData.append('status','normal');

    if(values.mitra.length > 0) {
// jika yang diinput adalah dara logistic
      if(jenis === 'sbsfc' || jenis === 'sbsfrs'){
        UserService.addLogistic(formData).then(
          async (response) => {

            if(jenis === 'sbsfc') {
              const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
              const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();

              // input logistik sbsfc
              try{
                const updateData = new FormData();
                let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, AddSBSFC, signer)
                let transaction = await contract.addLogisticsSbsfc(response.data.data.id, json, 'normal', dateString)
                  updateData.append('transaction', transaction.hash);
                  updateData.append('wallet', transaction.from);
                  setHash(transaction.hash);
                await transaction.wait()

                updateData.append('id', response.data.data.id);
                updateData.append('flag', 'stockBulkSugarFromCane');
                UserService.addLogisticsTransactionHash(updateData);
                setHash("");
              } catch(e) {
                console.log(e);
                setErr(true);
              }
              // end input sbsfc

              // input stok
                if(response.data.stok) {
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

              if(catchErr) {
                setLoading(false);
                console.log(catchErr);
              } else {
                setLoading(false);
                showResults("Data Berhasil Dimasukkan");
              }

            } else if(jenis === 'sbsfrs') {

                const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
                const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

                const web3Modal = new Web3Modal();
                const connection = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner();

                // input logistik sbsfrs
                try{
                  const updateData = new FormData();
                  let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, AddSBSFRS, signer)
                  let transaction = await contract.addLogisticsSbsfrs(response.data.data.id, json, 'normal', dateString)
                    updateData.append('transaction', transaction.hash);
                    updateData.append('wallet', transaction.from);
                    setHash(transaction.hash);
                  await transaction.wait()

                  updateData.append('id', response.data.data.id);
                  updateData.append('flag', 'stockBulkSugarFromRs');
                  UserService.addLogisticsTransactionHash(updateData);
                  setHash("");
                } catch(e) {
                  console.log(e);
                  setErr(true);
                }
                // end input sbsfrs

              // input stok
                if(response.data.stok) {
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

                if(catchErr) {
                  setLoading(false);
                  console.log(catchErr);
                } else {
                  setLoading(false);
                  showResults("Data Berhasil Dimasukkan");
                }

            } else {

            }

            setLoading(false) 

          },(error) => { 
              console.log(error) 
              setLoading(false) 
          }
        );
      } else {
// jika yang diinput adalah data production      
        UserService.addProduction(formData).then(
          async (response) => {

// jika data production adalah milled sugar cane
            if(jenis === 'msc') {

              const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
              const jsonInput = JSON.stringify(response.data.input, null, 4).replace(/[",\\]]/g, "")
              const jsonLogistik = JSON.stringify(response.data.input, null, 4).replace(/[",\\]]/g, "")
              const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

              console.log('cek responsenya', response);
              
              // insert to blockchain
              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();

              const accounts = await window.ethereum.enable();
              const akun = accounts[0];

              // input production msc
              try{
                const updateData = new FormData();
                let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_MSC, AddMSC, signer)
                let transaction = await contract.addProductionMsc(response.data.data.id, json, 'normal', dateString)
                  updateData.append('transaction', transaction.hash);
                  updateData.append('wallet', transaction.from);
                  setHash(transaction.hash);
                await transaction.wait()

                updateData.append('id', response.data.data.id);
                updateData.append('flag', 'milledSugarCane');
                UserService.addProdcutionTransactionHash(updateData);
                setHash("");
              } catch(e) {
                console.log(e);
                setErr(true);
              }
              // end input msc

              // input sugar cane
              try{
                const updateDataInput = new FormData();
                let contractSC = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFC, AddSFC, signer)
                let transactionSC = await contractSC.addProductionSfc(response.data.input.id, jsonInput, 'normal', dateString)
                  updateDataInput.append('transaction', transactionSC.hash);
                  updateDataInput.append('wallet', transactionSC.from);
                  setHash(transactionSC.hash);
                await transactionSC.wait()

                updateDataInput.append('id', response.data.input.id);
                updateDataInput.append('flag', 'sugarCane');
                UserService.addProdcutionTransactionHash(updateDataInput);
                setHash("");
              } catch(e) {
                console.log(e);
                setErr(true);
              }
              // end input sugar cane

              // input logistik cane
              try{
                const updateDataLogistik = new FormData();
                let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, AddSBSFC, signer)
                let transactionL = await contractL.addLogisticsSbsfc(response.data.logistik.id, jsonLogistik, 'normal', dateString)
                  setHash(transactionL.hash);
                  updateDataLogistik.append('transaction', transactionL.hash);
                  updateDataLogistik.append('wallet', transactionL.from);
                await transactionL.wait()

                updateDataLogistik.append('id', response.data.logistik.id);
                updateDataLogistik.append('flag', 'stockBulkSugarFromCane');
                UserService.addLogisticsTransactionHash(updateDataLogistik);
                setHash("");
              } catch(e) {
                console.log(e);
                setErr(true);
              }
              // end input logistik cane

              // input stok
              if(response.data.stok) {
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

              if(catchErr) {
                setLoading(false);
                console.log(catchErr);
              } else {
                setLoading(false);
                showResults("Data Berhasil Dimasukkan");
              }

            } else if(jenis === 'prs') {
              console.log('cek response submit nih', response);

              const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
              const jsonInput = JSON.stringify(response.data.input, null, 4).replace(/[",\\]]/g, "")
              const jsonLogistik = JSON.stringify(response.data.input, null, 4).replace(/[",\\]]/g, "")
              const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();

              // input production prs
                try{
                  const updateData = new FormData();
                  let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_PRS, AddPRS, signer)
                  let transaction = await contract.addProductionPrs(response.data.data.id, json, 'normal', dateString)
                    updateData.append('transaction', transaction.hash);
                    updateData.append('wallet', transaction.from);
                    setHash(transaction.hash);
                  await transaction.wait()

                  updateData.append('id', response.data.data.id);
                  updateData.append('flag', 'processedRs');
                  UserService.addProdcutionTransactionHash(updateData);
                  setHash("");
                } catch (e) {
                  console.log(e);
                  setErr(true);
                }
              // end insert prs

              // insert sugar rs
                try{
                  const updateDataRS = new FormData();
                  let contractRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFRS, AddSFRS, signer)
                  let transactionRS = await contractRS.addProductionSfrs(response.data.input.id, jsonInput, 'normal', dateString)
                    updateDataRS.append('transaction', transactionRS.hash);
                    updateDataRS.append('wallet', transactionRS.from);
                    setHash(transactionRS.hash);
                  await transactionRS.wait()

                  updateDataRS.append('id', response.data.input.id);
                  updateDataRS.append('flag', 'sugarFromRs');
                  UserService.addProdcutionTransactionHash(updateDataRS);
                  setHash("");
                } catch (e) {
                  console.log(e);
                  setErr(true);
                }
              // end insert sugar rs

              // insert logistik
                try{
                  const updateDataL = new FormData();
                  let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, AddSBSFRS, signer)
                  let transactionL = await contractL.addLogisticsSbsfrs(response.data.logistik.id, jsonLogistik, 'normal', dateString)
                    updateDataL.append('transaction', transactionL.hash);
                    updateDataL.append('wallet', transactionL.from);
                    setHash(transactionL.hash);
                  await transactionL.wait()

                  updateDataL.append('id', response.data.logistik.id);
                  updateDataL.append('flag', 'stockBulkSugarFromRs');
                  UserService.addLogisticsTransactionHash(updateDataL);
                  setHash("");
                } catch (e) {
                  console.log(e);
                  setErr(true);
                }
              // end insert logistik

              // input stok
              if(response.data.stok) {
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

              if(catchErr) {
                setLoading(false);
                console.log(catchErr);
              } else {
                setLoading(false);
                showResults("Data Berhasil Dimasukkan");
              }
            } else if(jenis === 'sc') {

              const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
              const jsonInput = JSON.stringify(response.data.input, null, 4).replace(/[",\\]]/g, "")
              const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")
              
              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();

              const accounts = await window.ethereum.enable();
              const akun = accounts[0];

              // input production sc
                try{
                  const updateData = new FormData();
                  let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFC, AddSFC, signer)
                  let transaction = await contract.addProductionSfc(response.data.data.id, json, 'normal', dateString)
                    updateData.append('transaction', transaction.hash);
                    updateData.append('wallet', transaction.from);
                    setHash(transaction.hash);
                  await transaction.wait()

                  updateData.append('id', response.data.data.id);
                  updateData.append('flag', 'sugarCane');
                  UserService.addProdcutionTransactionHash(updateData);
                  setHash("");
                } catch (e) {
                  console.log(e);
                  setErr(true);
                }
              // end input sc

              // input logistik cane
                try{
                  const updateDataL = new FormData();
                  let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, AddSBSFC, signer)
                  let transactionL = await contractL.addLogisticsSbsfc(response.data.input.id, jsonInput, 'normal', dateString)
                    updateDataL.append('transaction', transactionL.hash);
                    updateDataL.append('wallet', transactionL.from);
                    setHash(transactionL.hash);
                  await transactionL.wait()

                  updateDataL.append('id', response.data.input.id);
                  updateDataL.append('flag', 'stockBulkSugarFromCane');
                  UserService.addLogisticsTransactionHash(updateDataL);
                  setHash("");
                } catch (e) {
                  console.log(e);
                  setErr(true);
                }
              // end input logistic sc

              // input stok
              if(response.data.stok) {
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

              if(catchErr) {
                setLoading(false);
                console.log(catchErr);
              } else {
                setLoading(false);
                showResults("Data Berhasil Dimasukkan");
              }

            } else if(jenis === 'sfrs') {

              const json = JSON.stringify(response.data.data, null, 4).replace(/[",\\]]/g, "")
              const jsonInput = JSON.stringify(response.data.input, null, 4).replace(/[",\\]]/g, "")
              const jsonStok = JSON.stringify(response.data.stok, null, 4).replace(/[",\\]]/g, "")

              const web3Modal = new Web3Modal();
              const connection = await web3Modal.connect();
              const provider = new ethers.providers.Web3Provider(connection);
              const signer = provider.getSigner();

              const accounts = await window.ethereum.enable();
              const akun = accounts[0];

              // input sugar rs
              try{
                const updateDataRS = new FormData();
                let contractRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFRS, AddSFRS, signer)
                let transaction = await contractRS.addProductionSfrs(response.data.data.id, json, 'normal', dateString)
                  updateDataRS.append('transaction', transaction.hash);
                  updateDataRS.append('wallet', transaction.from);
                  setHash(transaction.hash);
                await transaction.wait()

                updateDataRS.append('id', response.data.data.id);
                updateDataRS.append('flag', 'sugarFromRs');
                UserService.addProdcutionTransactionHash(updateDataRS);
                setHash("");
              } catch (e) {
                console.log(e);
                setErr(true);
              }
              // end input sugar rs

              // input logistik
              try{
                const updateDataL = new FormData();
                let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, AddSBSFRS, signer)
                let transactionL = await contractL.addLogisticsSbsfrs(response.data.input.id, jsonInput, 'normal', dateString)
                  updateDataL.append('transaction', transactionL.hash);
                  updateDataL.append('wallet', transactionL.from);
                  setHash(transactionL.hash);
                await transactionL.wait()

                updateDataL.append('id', response.data.input.id);
                updateDataL.append('flag', 'stockBulkSugarFromRs');
                UserService.addLogisticsTransactionHash(updateDataL);
                setHash("");
              } catch (e) {
                console.log(e);
                setErr(true);
              }
              // end insert logistik

              // input stok
              if(response.data.stok) {
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

              if(catchErr) {
                setLoading(false);
                console.log(catchErr);
              } else {
                setLoading(false);
                showResults("Data Berhasil Dimasukkan");
              }

            } else {
              showResults("Data Tidak Berhasil Ditulis Ke Blockchain");
            }

            setLoading(false) 

          },(error) => { 
              console.log(error) 
              setLoading(false) 
          }
        );
      }
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