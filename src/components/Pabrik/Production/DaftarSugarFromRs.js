import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarProductionForm from "./DaftarProductionForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { AddProduct } from "../../../abi/productionSfrs";
import { AddLogistics } from "../../../abi/logisticsSbsfrs";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

const DaftarProduction = () => {
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

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

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
    formData.append('volume',values.volume);
    formData.append('status','normal');
    formData.append('param','sugarFromRs');
    console.log(formData);

    UserService.addProduction(formData).then(
      async (response) => {

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const accounts = await window.ethereum.enable();
        const akun = accounts[0];

        const updateDataRS = new FormData();
        let contractRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFRS, AddProduct, signer)
        let transaction = await contractRS.addProductionSfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString)
          updateDataRS.append('transaction', transaction.hash);
          updateDataRS.append('wallet', transaction.from);
          setHash(transaction.hash);
        await transaction.wait()

        updateDataRS.append('id', response.data.data.id);
        updateDataRS.append('flag', 'sugarFromRs');
        UserService.addProdcutionTransactionHash(updateDataRS);
        setHash("");

        // input logistik

        const updateDataL = new FormData();
          let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, AddLogistics, signer)
          let transactionL = await contractL.addLogisticsSbsfrs(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString)
            updateDataL.append('transaction', transactionL.hash);
            updateDataL.append('wallet', transactionL.from);
            setHash(transactionL.hash);
          await transactionL.wait()

          updateDataL.append('id', response.data.input.id);
          updateDataL.append('flag', 'stockBulkSugarFromRs');
          UserService.addLogisticsTransactionHash(updateDataL);
        // end insert logistik
        setLoading(false);
        showResults("Dimasukkan");
        setHash("");
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
            <DaftarProductionForm 
              onSubmit={handleSubmit} 
              onSelectDate={handleDate}
            />
          )
        }
      })()}
    </Fragment>
  );
};
export default DaftarProduction;