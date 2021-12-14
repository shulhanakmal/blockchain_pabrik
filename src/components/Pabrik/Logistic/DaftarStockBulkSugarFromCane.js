import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarLogisticForm from "./DaftarLogisticForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
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
  let [data, setData] = useState("");

  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState( '' );
  const [tanggal, setDate] = useState("");
  const [catchErr, setErr] = useState(false);

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = process.env.REACT_APP_ADDRESS_SBSFC;

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  const handleIDProduct = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear().toString().substr(-2);

    if (date < 10) {
      date = "0" + date;
    }
    if (month < 10) {
      month = "0" + month;
    }

    let increment = 1;
    let incrementalResultIDProduct = "0" + increment;
    let resultIDProduct = "Cane-" + year + month + date + incrementalResultIDProduct;

    for (let i = 0; i < data.length; i++) {
      if (this.state.content[i].Product_id == resultIDProduct) {
        increment += 1;
        if (increment < 10) {
          incrementalResultIDProduct = "0" + increment;
        }
        else {
          incrementalResultIDProduct = increment;
        }
        resultIDProduct = "Cane-" + year + month + date + incrementalResultIDProduct;
      }
    }

    return resultIDProduct;
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

    UserService.getListLogisticForIDProduct('stockBulkSugarFromRs', dateString).then(
      (response) => {
        console.log(response.data);
        setData(response.data)
      },
      (error) => {
        setErr((error.response && error.response.data && error.response.data.message) || error.message || error.toString())
      }
    );
  };

  const handleSubmit = (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('date',tanggal);
    formData.append('volume',values.volume);
    formData.append('product',handleIDProduct());
    formData.append('status','normal');
    formData.append('param','stockBulkSugarFromCane');
    console.log(formData);

    UserService.addLogistic(formData).then(
      async (response) => {

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        // input logistik sbsfc
        try{
          const updateData = new FormData();
          let contract = new ethers.Contract(contractAddress, AddLogistics, signer)
          let transaction = await contract.addLogisticsSbsfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString)
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
        
        if(catchErr) {
          setLoading(false);
          console.log(catchErr);
        } else {
          setLoading(false);
          showResults("Dimasukkan");
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
            <DaftarLogisticForm 
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
