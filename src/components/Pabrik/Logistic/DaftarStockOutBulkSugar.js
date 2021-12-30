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
        const signer = provider.getSigner();

        // input logistik sobs
        try{
          const updateData = new FormData();
          let contract = new ethers.Contract(contractAddress, AddLogistics, signer)
          let transaction = await contract.addLogisticsSobs(response.data.data.id, json, 'normal', dateString)
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
            <DaftarLogisticSOBSForm 
              onSubmit={handleSubmit} 
              onSelectDate={handleDate}
            />
          )
        }
      })()}
    </Fragment>
  );
};
export default DaftarLogistic;
