import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import "../react-datepicker.css";
import DaftarProductionForm from "./DaftarProductionForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
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
        setLoading(true);
        // insert rs
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContract = new web3.eth.Contract(AddProduct, "0xEBd34C9958E1e921a2359DEd83b9e7945Af720E4");
        const gas = await storageContract.methods.addProductionPrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString).estimateGas();
        var post = await storageContract.methods.addProductionPrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString).send({
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
        updateData.append('flag', 'processedRs');
        UserService.addProdcutionTransactionHash(updateData);
        setHash("");
        // end insert rs

        // insert sugar rs
        const storageContractRs = new web3.eth.Contract(AddRs, "0x855DeEff0EC2169F3798075e7c402389B88bFF11");
        const gasRs = await storageContractRs.methods.addProductionSfrs(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString).estimateGas();
        var postRs = await storageContractRs.methods.addProductionSfrs(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString).send({
          from: akun,
          gasRs,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          setHash(transactionHash);
        });
        const updateDataRs = new FormData();
        updateDataRs.append('id', response.data.data.id);
        updateDataRs.append('transaction', postRs.transactionHash);
        updateDataRs.append('wallet', postRs.from);
        updateDataRs.append('flag', 'sugarFromRs');
        UserService.addProdcutionTransactionHash(updateDataRs);
        setHash("");
        // end insert sugar rs

        // insert logistik
        const storageContractLogistik = new web3.eth.Contract(AddLogistics, "0x8fdb2D0eaD144FAc0f977747C5AB93Ad03eC2904");
        const gasLogistik = await storageContractLogistik.methods.addLogisticsSbsfrs(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString).estimateGas();
        var postLogistik = await storageContractLogistik.methods.addLogisticsSbsfrs(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString).send({
          from: akun,
          gasLogistik,
        }, (error, transactionHash) => {
          console.log([error, transactionHash]);
          setHash(transactionHash);
        });
        const updateDataLogistik = new FormData();
        updateDataLogistik.append('id', response.data.data.id);
        updateDataLogistik.append('transaction', postLogistik.transactionHash);
        updateDataLogistik.append('wallet', postLogistik.from);
        updateDataLogistik.append('flag', 'stockBulkSugarFromRs');
        UserService.addLogisticsTransactionHash(updateDataLogistik);
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
