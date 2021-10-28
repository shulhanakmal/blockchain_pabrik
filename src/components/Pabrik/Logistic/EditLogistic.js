import { Fragment, useState, useEffect, useCallback } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import { useParams } from "react-router";
import EditLogisticForm from "./EditLogisticForm";
import EditLogisticReturnForm from "./EditLogisticReturnForm";
import Web3 from "web3";
import { AddLogistics as StockCane } from "../../../abi/logisticsSbsfc";
import { AddLogistics as StockRS} from "../../../abi/logisticsSbsfrs";
import { AddLogistics as StockOut} from "../../../abi/logisticsSobs";
import { AddLogistics as Return} from "../../../abi/logisticsRbs";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

const EditLogistic = () => {
    const { flag } = useParams();
    const { id } = useParams();

    const override = css`
        display: block;
        margin: 0 auto;
        border-color: red;
        `
    ;
  
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState("#3c4b64");

    let [bendera, setFlag] = useState(flag);

    let [TxnHash, setHash] = useState("");

    const [balance, setBalance] = useState(0);
    const [account, setAccount] = useState( '' );
    const [tanggal, setDate] = useState("");

    const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
    const web3 = new Web3(provider);

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
        var raw = JSON.stringify(values);
        const formData = new FormData();
        formData.append('date',tanggal);
        formData.append('volume',values.volume);
        formData.append('status','normal');
        formData.append('flag', bendera);
        formData.append('id', id);

        if(bendera === 'sbsfc'){
            formData.append('param','stockBulkSugarFromCane');
        } else if(bendera === 'sbsfrs') {
            formData.append('param','stockBulkSugarFromRs');
        } else if(bendera === 'sobs') {
            formData.append('param','stockOutBulkSugar');
        } else {
            formData.append('buyer',values.buyer);
            formData.append('sugar',values.sugar);
            formData.append('param','returnBulkSugar');
        }

        UserService.editLogistic(formData).then(
            async (response) => {
                const accounts = await window.ethereum.enable();
                const akun = accounts[0];
                if(bendera === 'sbsfc'){
                    const storageContractCane = new web3.eth.Contract(StockCane, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
                    const gas = await storageContractCane.methods.addLogisticsSbsfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var post = await storageContractCane.methods.addLogisticsSbsfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', post.transactionHash);
                    updateData.append('wallet', post.from);
                    updateData.append('flag', 'stockBulkSugarFromCane');

                    UserService.addLogisticsTransactionHash(updateData);
                } else if(bendera === 'sbsfrs'){
                    const storageContractRS = new web3.eth.Contract(StockRS, '0x8fdb2D0eaD144FAc0f977747C5AB93Ad03eC2904');
                    const gas = await storageContractRS.methods.addLogisticsSbsfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var post = await storageContractRS.methods.addLogisticsSbsfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', post.transactionHash);
                    updateData.append('wallet', post.from);
                    updateData.append('flag', 'stockBulkSugarFromRs');

                    UserService.addLogisticsTransactionHash(updateData);
                } else if(bendera === 'sobs'){
                    const storageContractOut = new web3.eth.Contract(StockOut, '0xdD61c2a97EaFF236B1643e387b966d778A8600a2');
                    const gas = await storageContractOut.methods.addLogisticsSobs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var post = await storageContractOut.methods.addLogisticsSobs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', post.transactionHash);
                    updateData.append('wallet', post.from);
                    updateData.append('flag', 'stockOutBulkSugar');

                    UserService.addLogisticsTransactionHash(updateData);
                } else {
                    const storageContractReturn = new web3.eth.Contract(Return, '0x0731b010C9AAEb70B9340a9Edeb555119d600C2f');
                    const gas = await storageContractReturn.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'edited', dateString).estimateGas();
                    var post = await storageContractReturn.methods.addLogisticsRbs(response.data.data.id, response.data.data.date, response.data.data.buyer, response.data.data.sugar, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    if(response.data.data.sugar === 'cane') {
                        const storageContractCane = new web3.eth.Contract(StockCane, '0xF6c79F860918Fb2AeC4C4A730A7F74cE9f6ab4F9');
                        const gas = await storageContractCane.methods.addLogisticsSbsfc(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'edited', dateString).estimateGas();
                        var postCane = await storageContractCane.methods.addLogisticsSbsfc(response.data.sugar.id, response.data.sugar.date, response.data.sugar.volume, 'edited', dateString).send({
                        from: akun,
                        gas,
                        }, (error, transactionHash) => {
                        console.log([error, transactionHash]);
                        setHash(transactionHash);
                        });

                        // insert txn hash ke database
                        const updateData = new FormData();
                        updateData.append('id', response.data.data.id);
                        updateData.append('transaction', postCane.transactionHash);
                        updateData.append('wallet', postCane.from);
                        updateData.append('flag', 'stockBulkSugarFromCane')

                        UserService.addLogisticsTransactionHash(updateData);
                    } else {
                        const storageContractRS = new web3.eth.Contract(StockRS, '0x8fdb2D0eaD144FAc0f977747C5AB93Ad03eC2904');
                        const gas = await storageContractRS.methods.addLogisticsSbsfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                        var post = await storageContractRS.methods.addLogisticsSbsfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                        from: akun,
                        gas,
                        }, (error, transactionHash) => {
                        console.log([error, transactionHash]);
                        setHash(transactionHash);
                        });

                        // insert txn hash ke database
                        const updateData = new FormData();
                        updateData.append('id', response.data.data.id);
                        updateData.append('transaction', post.transactionHash);
                        updateData.append('wallet', post.from);
                        updateData.append('flag', 'stockBulkSugarFromRs');

                        UserService.addLogisticsTransactionHash(updateData);
                    }

                    // simpan hash
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', post.transactionHash);
                    updateData.append('wallet', post.from);
                    updateData.append('flag', 'returnBulkSugar');
                    UserService.addLogisticsTransactionHash(updateData);
                }

                console.log(post);
                setLoading(false);
                showResults("Diubah");
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
                    if(bendera === 'return'){
                        return (
                            <EditLogisticReturnForm onSubmit={handleSubmit} onSelectDate={handleDate} dataFlag={bendera} dataID={id} />
                        )
                    } else {
                        return (
                            <EditLogisticForm onSubmit={handleSubmit} onSelectDate={handleDate} dataFlag={bendera} dataID={id} />
                        )
                    }
                }
            })()}
        </Fragment>
    );
};

export default EditLogistic;
