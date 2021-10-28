import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarProductionForm from "./DaftarProductionForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import { AddProduct } from "../../../abi/productionSfc";
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
    formData.append('param','sugarCane');
    console.log(formData);

    UserService.addProduction(formData).then(
      async (response) => {
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContract = new web3.eth.Contract(AddProduct, "0xF7e31a64761a538413333812EC150184fC42b475");
        const gas = await storageContract.methods.addProductionSfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString).estimateGas();
        var post = await storageContract.methods.addProductionSfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString).send({
          from: akun,
          gas,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          setHash(transactionHash);
        });
        const updateData = new FormData();
        updateData.append('id', response.data.data.id);
        updateData.append('transaction', post.transactionHash);
        updateData.append('wallet', post.from);
        updateData.append('flag', 'sugarCane');
        UserService.addProdcutionTransactionHash(updateData);
        setHash("");

        // input logistik cane
        const storageContractLogistik = new web3.eth.Contract(AddLogistics, "0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9");
        const gasLogistik = await storageContractLogistik.methods.addLogisticsSbsfc(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString).estimateGas();
        var postLogistik = await storageContractLogistik.methods.addLogisticsSbsfc(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString).send({
          from: akun,
          gasLogistik,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          setHash(transactionHash);
        });

        const updateDataLogistik = new FormData();
        updateDataLogistik.append('id', response.data.input.id);
        updateDataLogistik.append('transaction', postLogistik.transactionHash);
        updateDataLogistik.append('wallet', postLogistik.from);
        updateDataLogistik.append('flag', 'stockBulkSugarFromCane');
        UserService.addLogisticsTransactionHash(updateDataLogistik);
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