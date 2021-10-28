import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarProductionForm from "./DaftarProductionForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3 from "web3";
import { AddProduct } from "../../../abi/productionMsc";
import { AddProduct as AddCane} from "../../../abi/productionSfc";
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
  const [tanggal, setDate] = useState("");

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  const handleSubmit = (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('date',tanggal);
    formData.append('volume',values.volume);
    formData.append('status','normal');
    formData.append('param','milledSugarCane');
    console.log(formData);

    UserService.addProduction(formData).then(
      async (response) => {
        console.log('response', response);
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        // input production msc
          const storageContract = new web3.eth.Contract(AddProduct, "0xA2E320F53a57EFe583A3ddfB5a29bacDa944f4fd");
          const gas = await storageContract.methods.addProductionMsc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString).estimateGas();
          var post = await storageContract.methods.addProductionMsc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString).send({
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
          updateData.append('flag', 'milledSugarCane');
          UserService.addProdcutionTransactionHash(updateData);
          setHash("");
          // end input msc

          // input sugar cane
          const storageContractInput = new web3.eth.Contract(AddCane, "0xF7e31a64761a538413333812EC150184fC42b475");
          const gasInput = await storageContractInput.methods.addProductionSfc(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString).estimateGas();
          var postSC = await storageContractInput.methods.addProductionSfc(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString).send({
            from: akun,
            gasInput,
          }, (error, transactionHash) => {
            console.log([error, transactionHash]);
            setHash(transactionHash);
          });

          const updateDataInput = new FormData();
          updateDataInput.append('id', response.data.input.id);
          updateDataInput.append('transaction', postSC.transactionHash);
          updateDataInput.append('wallet', postSC.from);
          updateDataInput.append('flag', 'sugarCane');
          UserService.addProdcutionTransactionHash(updateDataInput);
          setHash("");
          // end input sugar cane

          // input logistik cane
          const storageContractLogistik = new web3.eth.Contract(AddLogistics, "0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9");
          const gasLogistik = await storageContractLogistik.methods.addLogisticsSbsfc(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString).estimateGas();
          var postLogistik = await storageContractLogistik.methods.addLogisticsSbsfc(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString).send({
            from: akun,
            gasLogistik,
          }, (error, transactionHash) => {
            console.log([error, transactionHash]);
            setHash(transactionHash);
          });

          const updateDataLogistik = new FormData();
          updateDataLogistik.append('id', response.data.logistik.id);
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