import { Fragment, useState, useEffect } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarReturnBulkSugarForm from "./DaftarReturnBulkSugarForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import { AddLogistics } from "../../../abi/logisticsRbs";
import { AddLogistics as AddStockCane } from "../../../abi/logisticsSbsfc";
import { AddLogistics  as AddStockRS } from "../../../abi/logisticsSbsfrs";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

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

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = "0x0731b010C9AAEb70B9340a9Edeb555119d600C2f";
  const contractAddressSBSFC = "0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9";
  const contractAddressSBSFRS = "0x8fdb2D0eaD144FAc0f977747C5AB93Ad03eC2904";

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
    console.log(values);
    formData.append('date',tanggal);
    formData.append('buyer',values.buyer);
    formData.append('sugar',values.sugar);
    formData.append('volume',values.volume);
    formData.append('status','normal');
    formData.append('param','returnBulkSugar');

    UserService.addLogistic(formData).then(
      async (response) => {
        console.log('liat response', response);
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContract = new web3.eth.Contract(AddLogistics, contractAddress);
        const gas = await storageContract.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'normal', dateString).estimateGas();
        var post = await storageContract.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'normal', dateString).send({
          from: akun,
          gas,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          setHash(transactionHash);
        });

        // simpan hash
        const updateData = new FormData();
        updateData.append('id', response.data.data.id);
        updateData.append('transaction', post.transactionHash);
        updateData.append('wallet', post.from);
        updateData.append('flag', 'returnBulkSugar');
        UserService.addLogisticsTransactionHash(updateData);
        console.log(post);

        // post ke blockchain data return ke stock (stok menambah dari return)
        if(values.sugar === 'cane'){
          const storageContractSBSFC = new web3.eth.Contract(AddStockCane, contractAddressSBSFC);
          const gasSBSFC = await storageContractSBSFC.methods.addLogisticsSbsfc(response.data.stock.id, response.data.stock.date, response.data.stock.volume, 'normal', dateString).estimateGas();
          var postSBSFC = await storageContractSBSFC.methods.addLogisticsSbsfc(response.data.stock.id, response.data.stock.date, response.data.stock.volume, 'normal', dateString).send({
            from: akun,
            gasSBSFC,
          }, (error, transactionHash) => {
            console.log([error, transactionHash]);
          });
          console.log(postSBSFC);
          
          // simpan hash
          const txnCane = new FormData();
          txnCane.append('id', response.data.data.id);
          txnCane.append('transaction', postSBSFC.transactionHash);
          txnCane.append('wallet', postSBSFC.from);
          txnCane.append('flag', 'stockBulkSugarFromCane');
          UserService.addLogisticsTransactionHash(txnCane);
        } else {
          const storageContractSBSFRS = new web3.eth.Contract(AddStockRS, contractAddressSBSFRS);
          const gasSBSFRS = await storageContractSBSFRS.methods.addLogisticsSbsfrs(response.data.stock.id, response.data.stock.date, response.data.stock.volume, 'normal', dateString).estimateGas();
          var postSBSFRS = await storageContractSBSFRS.methods.addLogisticsSbsfrs(response.data.stock.id, response.data.stock.date, response.data.stock.volume, 'normal', dateString).send({
            from: akun,
            gasSBSFRS,
          }, (error, transactionHash) => {
            console.log([error, transactionHash]);
          });
          console.log(postSBSFRS);

          // simpan hash
          const txnRS = new FormData();
          txnRS.append('id', response.data.data.id);
          txnRS.append('transaction', postSBSFRS.transactionHash);
          txnRS.append('wallet', postSBSFRS.from);
          txnRS.append('flag', 'stockBulkSugarFromRs');
          UserService.addLogisticsTransactionHash(txnRS);
        }

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
            <DaftarReturnBulkSugarForm 
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