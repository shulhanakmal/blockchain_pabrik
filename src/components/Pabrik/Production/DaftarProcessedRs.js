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

  const [Vicumsa, setIcumsa] = useState("");
  const [Vbjb, setBJB] = useState("");
  const [Vka, setKA] = useState("");

  const [Vbrix, setBRIX] = useState("");
  const [Vtras, setTRAS] = useState("");

  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState( '' );
  const [tanggal, setDate] = useState("");
  const [catchErr, setErr] = useState(false);

  const [milling, setLamaGiling] = useState("");
  const [productId, setProductId] = useState("");

  const [data, setData] = useState("");
  const [prsId, setPrsId] = useState(0);
  const [AddMitra, setAddMitra] = useState(false);

  const handleDate = (date) => {
    setDate(date);
  };

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    UserService.getListProductionForIDProduct('prs', dateString).then(
      (response) => {
        console.log(response.data.data);
        // setData(response.data.data)

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear().toString().substr(-2);

        if (date < 10) {
          date = "0" + date;
        }
        if (month < 10) {
          month = "0" + month;
        }

        if(response.data.data.length === 0) {
          var product_id = "Raw-" + year + month + date + '01';
          setProductId(product_id);
        } else {
          // setProductId(resultIDBatch)
          const dataBaru = response.data.data.sort().reverse();

          var product_id = dataBaru[0];
          var count = product_id.match(/\d*$/);

          // Take the substring up until where the integer was matched
          // Concatenate it to the matched count incremented by 1
          product_id = product_id.substr(0, count.index) + (++count[0]);

          setProductId(product_id)

        }
        console.log('cek productId', product_id);
      },
      (error) => {
        setErr((error.response && error.response.data && error.response.data.message) || error.message || error.toString())
      }
    );
  }

  const handleMilling = (proses) => {
    console.log('proses', proses);
    setLamaGiling(proses);
  };

  const handleIcumsa = (icumsa) => {
    setIcumsa(icumsa);
  };

  const handleBJB = (bjb) => {
    setBJB(bjb);
  };

  const handleKA = (ka) => {
    setKA(ka);
  };

  const handleTRAS = (tras) => {
    setTRAS(tras);
  };

  const handleBRIX = (brix) => {
    setBRIX(brix);
  };

  const handleAddMitra = (mitra) => {
    setAddMitra(AddMitra)
    // return AddMitra;
  };

  const handleSubmit = (values) => {
    if(tanggal &&
      milling &&
      Vicumsa &&
      Vbjb &&
      Vka
    ) {

      const formData = new FormData();
      formData.append('product',productId);
      formData.append('date',tanggal);
      if(Vbrix) {
        formData.append('brix',Vbrix.target.value);
      }
      if(Vtras){
        formData.append('trash',Vtras.target.value);
      }
      formData.append('icumsa',Vicumsa.target.value);
      formData.append('bjb',Vbjb.target.value);
      formData.append('ka',Vka.target.value);
      formData.append('lama_proses',milling.target.value);
      formData.append('status','normal');
      formData.append('param','processedRs');
      console.log(formData);

      UserService.addProduction(formData).then(
        async (response) => {

          if(response.data.message) {
              showResults(response.data.message);
          } else {
            setPrsId(response.data.data.id)
            console.log('response', response);
            setAddMitra(true);

            showResults("Data berhasil disimpan, silahkan untuk mengisi data mitra!");
          }

          // const web3Modal = new Web3Modal();
          // const connection = await web3Modal.connect();
          // const provider = new ethers.providers.Web3Provider(connection);
          // const signer = provider.getSigner();

          // setLoading(true);
          // // insert rs

          // const updateData = new FormData();
          // // input production prs
          //   try{
          //     let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_PRS, AddProduct, signer)
          //     let transaction = await contract.addProductionPrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString)
          //       updateData.append('transaction', transaction.hash);
          //       updateData.append('wallet', transaction.from);
          //       setHash(transaction.hash);
          //     await transaction.wait()

          //     updateData.append('id', response.data.data.id);
          //     updateData.append('flag', 'processedRs');
          //     UserService.addProdcutionTransactionHash(updateData);
          //     setHash("");
          //   } catch (e) {
          //     console.log(e);
          //     setErr(true);
          //   }
          // // end insert prs

          // // insert sugar rs
          //   try{
          //     const updateDataRS = new FormData();
          //     let contractRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFRS, AddRs, signer)
          //     let transactionRS = await contractRS.addProductionSfrs(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString)
          //       updateDataRS.append('transaction', transactionRS.hash);
          //       updateDataRS.append('wallet', transactionRS.from);
          //       setHash(transactionRS.hash);
          //     await transactionRS.wait()

          //     updateDataRS.append('id', response.data.input.id);
          //     updateDataRS.append('flag', 'sugarFromRs');
          //     UserService.addProdcutionTransactionHash(updateDataRS);
          //     setHash("");
          //   } catch (e) {
          //     console.log(e);
          //     setErr(true);
          //   }
          // // end insert sugar rs

          // // insert logistik
          //   try{
          //     const updateDataL = new FormData();
          //     let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, AddLogistics, signer)
          //     let transactionL = await contractL.addLogisticsSbsfrs(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString)
          //       updateDataL.append('transaction', transactionL.hash);
          //       updateDataL.append('wallet', transactionL.from);
          //       setHash(transactionL.hash);
          //     await transactionL.wait()

          //     updateDataL.append('id', response.data.logistik.id);
          //     updateDataL.append('flag', 'stockBulkSugarFromRs');
          //     UserService.addLogisticsTransactionHash(updateDataL);
          //     setHash("");
          //   } catch (e) {
          //     console.log(e);
          //     setErr(true);
          //   }
          // // end insert logistik

          // if(catchErr) {
          //   setLoading(false);
          //   console.log(catchErr);
          // } else {
          //   setLoading(false);
          //   showResults("Dimasukkan");
          // }
        },
        (error) => {
        }
      );
    } else {
      showResults("Data belum lengkap, harap isi semua data!");
    }
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
              Milling={handleMilling}
              Icumsa={handleIcumsa}
              BJB={handleBJB}
              KA={handleKA}
              AddMitra={handleAddMitra}
              BRIX={handleBRIX}
              TRAS={handleTRAS}
              PRSID={prsId}
            />
          )
        }
      })()}
    </Fragment>
  );
};
export default DaftarProduction;
