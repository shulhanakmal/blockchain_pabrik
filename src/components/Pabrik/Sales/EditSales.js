import { Fragment, useState, useEffect } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import EditSalesForm from "./EditSalesForm";
import { useParams } from "react-router";
import Web3 from "web3";
import { AddSales } from "../../../abi/sales";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");


const EditSales = () => {
  const { flag } = useParams();
  const { id } = useParams();
  // Can be a string as well. Need to ensure each key-value pair ends with ;
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `
  ;

  let [bendera, setFlag] = useState(flag);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#3c4b64");
  let [TxnHash, setHash] = useState("");

  const [balance, setBalance] = useState(0);
  const [account, setAccount] = useState( '' );
  const [tanggal, setDate] = useState("");

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);
  const contractAddress = "0xC974bc711392Faa384C633Eb0b941DbAA133d382";

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
    console.log(values);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('date',tanggal);
    formData.append('no_do',values.no_do);
    formData.append('buyer',values.buyer);
    formData.append('price',values.price);
    formData.append('sugar',values.sugar);
    formData.append('volume',values.volume);
    formData.append('status','normal');

    const sugar = values.sugar;
    const volume = values.volume;
    UserService.editSales(formData).then(
      async (response) => {
        const accounts = await window.ethereum.enable();
        const akun = accounts[0];
        const storageContract = new web3.eth.Contract(AddSales, contractAddress);
        const gas = await storageContract.methods.addSales(response.data.data.id, response.data.data.date, response.data.data.no_do, response.data.data.buyer, response.data.data.price, sugar, volume, 'edited').estimateGas();
        var post = await storageContract.methods.addSales(response.data.data.id, response.data.data.date, response.data.data.no_do, response.data.data.buyer, response.data.data.price, sugar, volume, 'edited').send({
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
        UserService.addSalesTransactionHash(updateData);
        console.log(post);
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
                <h5>{TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + TxnHash} target="_blank" >Detail</a>}</h5>
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
            <EditSalesForm onSubmit={handleSubmit} onSelectDate={handleDate} dataID={id} />
          )
        }
      })()}
      </Fragment>
  );
};
export default EditSales;
