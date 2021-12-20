import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import DaftarMSCForm from "./DaftarMSCForm";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
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
  // const [TVolume, setTotalVolume] = useState("");
  const [Vicumsa, setIcumsa] = useState("");
  const [Vbjb, setBJB] = useState("");
  const [Vka, setKA] = useState("");
  const [Vbrix, setBRIX] = useState("");
  const [Vtras, setTRAS] = useState("");
  const [milling, setLamaGiling] = useState("");

  const [productId, setProductId] = useState('');

  const [catchErr, setErr] = useState(false);
  const [mscId, setMscId] = useState(null);
  const [AddMitra, setAddMitra] = useState(false);
  const [data, setData] = useState("");

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

  const handleDate = (date) => {
    setDate(date);
  };

  const handleMilling = (proses) => {
    setLamaGiling(proses);
  };

  // const handleTotalVolume = (vol) => {
  //   setTotalVolume(vol);
  // };

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

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    UserService.getListProductionForIDProduct('msc', dateString).then(
      (response) => {
        console.log('cek response', response.data);
        // setData(response.data.data.length)

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
          var product_id = "Cane-" + year + month + date + '01';
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

  // const handleIDProduct = () => {
    

    
  // };

  const handleSubmit = (values) => {
    // setLoading(true);

    if(tanggal && 
      milling &&
      Vbrix &&
      Vtras &&
      Vicumsa &&
      Vbjb &&
      Vka
    ) {    

      const formData = new FormData();
      formData.append('product',productId);
      formData.append('date',tanggal);
      formData.append('lama_proses',milling.target.value);
      formData.append('brix',Vbrix.target.value);
      formData.append('trash',Vtras.target.value);
      // formData.append('brix',values.brix);
      // formData.append('trash',values.trash);
      formData.append('icumsa',Vicumsa.target.value);
      formData.append('bjb',Vbjb.target.value);
      formData.append('ka',Vka.target.value);

      // if(TVolume === '') {
      //   formData.append('volume', null);
      //   formData.append('mitra', null);
      //   formData.append('mscid', null);
      // } else {
      //   formData.append('mscid', mscId);
      //   formData.append('volume',TVolume);
      //   formData.append('mitra', JSON.stringify(values.mitra));
      // }

      formData.append('status','normal');
      formData.append('param','milledSugarCane');
      console.log('form data', formData);

      UserService.addProduction(formData).then(
        async (response) => {

          if(response.data.message) {
            showResults(response.data.message);
          } else {
            setMscId(response.data.data.id)
            console.log('response', response);
            setAddMitra(true);

            showResults("Data berhasil disimpan, silahkan untuk mengisi data mitra!");
          }
          
          // insert to blockchain
          // if(mscId) {
          //   const web3Modal = new Web3Modal();
          //   const connection = await web3Modal.connect();
          //   const provider = new ethers.providers.Web3Provider(connection);
          //   const signer = provider.getSigner();

          //   const accounts = await window.ethereum.enable();
          //   const akun = accounts[0];

          //   // input production msc
          //     try{
          //       const updateData = new FormData();
          //       let contract = new ethers.Contract(process.env.REACT_APP_ADDRESS_MSC, AddProduct, signer)
          //       let transaction = await contract.addProductionMsc(response.data.data.id, response.data.data.date, response.data.data.volume, 'normal', dateString)
          //         updateData.append('transaction', transaction.hash);
          //         updateData.append('wallet', transaction.from);
          //         setHash(transaction.hash);
          //       await transaction.wait()

          //       updateData.append('id', response.data.data.id);
          //       updateData.append('flag', 'milledSugarCane');
          //       UserService.addProdcutionTransactionHash(updateData);
          //       setHash("");
          //     } catch(e) {
          //       console.log(e);
          //       setErr(true);
          //     }
          //   // end input msc

          //   // input sugar cane
          //     try{
          //       const updateDataInput = new FormData();
          //       let contractSC = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFC, AddCane, signer)
          //       let transactionSC = await contractSC.addProductionSfc(response.data.input.id, response.data.input.date, response.data.input.volume, 'normal', dateString)
          //         updateDataInput.append('transaction', transactionSC.hash);
          //         updateDataInput.append('wallet', transactionSC.from);
          //         setHash(transactionSC.hash);
          //       await transactionSC.wait()

          //       updateDataInput.append('id', response.data.input.id);
          //       updateDataInput.append('flag', 'sugarCane');
          //       UserService.addProdcutionTransactionHash(updateDataInput);
          //       setHash("");
          //     } catch(e) {
          //       console.log(e);
          //       setErr(true);
          //     }
          //   // end input sugar cane

          //   // input logistik cane
          //   try{
          //     const updateDataLogistik = new FormData();
          //     let contractL = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, AddLogistics, signer)
          //     let transactionL = await contractL.addLogisticsSbsfc(response.data.logistik.id, response.data.logistik.date, response.data.logistik.volume, 'normal', dateString)
          //       setHash(transactionL.hash);
          //       updateDataLogistik.append('transaction', transactionL.hash);
          //       updateDataLogistik.append('wallet', transactionL.from);
          //     await transactionL.wait()

          //     updateDataLogistik.append('id', response.data.logistik.id);
          //     updateDataLogistik.append('flag', 'stockBulkSugarFromCane');
          //     UserService.addLogisticsTransactionHash(updateDataLogistik);
          //     setHash("");
          //   } catch(e) {
          //     console.log(e);
          //     setErr(true);
          //   }

          //   if(catchErr) {
          //     setLoading(false);
          //     console.log(catchErr);
          //   } else {
          //     setLoading(false);
          //     showResults("Data Berhasil Dimasukkan");
          //   }

          // } else {

          //   setMscId(response.data.data.id)
          //   console.log('response', response);

          //   showResults("Data berhasil disimpan, silahkan untuk mengisi data mitra!");
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
            <DaftarMSCForm 
              onSubmit={handleSubmit}
              onSelectDate={handleDate}
              Milling={handleMilling}
              Icumsa={handleIcumsa}
              BJB={handleBJB}
              KA={handleKA}
              BRIX={handleBRIX}
              TRAS={handleTRAS}
              AddMitra={handleAddMitra}
              MSCID={mscId}
              // TOTALV={handleTotalVolume}
            />
          )
        }
      })()}
    </Fragment>
  );
};
export default DaftarProduction;