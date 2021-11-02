import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import "../react-datepicker.css";
import DaftarProductionForm from "./DaftarProductionForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import { AddProduct } from "../../../abi/productionPrs";
import { AddProduct as AddRs} from "../../../abi/productionSfrs";
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

  const handleDate = (date) => {
    setDate(date);
  };

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

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
    const formData = new FormData();
    formData.append('date',tanggal);
    formData.append('volume',values.volume);
    formData.append('status','normal');
    formData.append('param','processedRs');
    console.log(formData);

    UserService.addProduction(formData).then(
      async (response) => {

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        setLoading(true);
        // insert rs

        const updateData = new FormData();
        // input production prs
          let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_PRS, AddProduct, signer)
          let transaction = await contract.addProductionPrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString)
            updateData.append('transaction', transaction.hash);
            updateData.append('wallet', transaction.from);
            setHash(transaction.hash);
          await transaction.wait()

          updateData.append('id', response.data.data.id);
          updateData.append('flag', 'processedRs');
          UserService.addProdcutionTransactionHash(updateData);
          setHash("");
        // end insert prs

        // insert sugar rs
        const updateDataRS = new FormData();
          let contractRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFRS, AddRs, signer)
          let transactionRS = await contractRS.addProductionSfrs(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString)
            updateDataRS.append('transaction', transactionRS.hash);
            updateDataRS.append('wallet', transactionRS.from);
            setHash(transactionRS.hash);
          await transactionRS.wait()

          updateDataRS.append('id', response.data.input.id);
          updateDataRS.append('flag', 'sugarFromRs');
          UserService.addProdcutionTransactionHash(updateDataRS);
          setHash("");
        // end insert sugar rs

        // insert logistik
        const updateDataL = new FormData();
          let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, AddLogistics, signer)
          let transactionL = await contractL.addLogisticsSbsfrs(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString)
            updateDataL.append('transaction', transactionL.hash);
            updateDataL.append('wallet', transactionL.from);
            setHash(transactionL.hash);
          await transactionL.wait()

          updateDataL.append('id', response.data.logistik.id);
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
