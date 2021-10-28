import { Fragment, useState, useEffect } from "react";
import "../Pabrik.css";
import "../PabrikMedia.css";
import UserService from "../../../services/user.service";
import showResults from "../../showResults/showResults";
import { useParams } from "react-router";
import EditProductionForm from "./EditProductionForm";
import Web3 from "web3";
import { AddProduct as MSC } from "../../../abi/productionMsc";
import { AddProduct as PRS} from "../../../abi/productionPrs";
import { AddProduct as SFC} from "../../../abi/productionSfc";
import { AddProduct as SFRS} from "../../../abi/productionSfrs";
import { css } from "@emotion/react";
import Loader from "react-spinners/DotLoader";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

var m = new Date();
var dateString =
    m.getUTCFullYear() + "-" +
    ("0" + (m.getUTCMonth()+1)).slice(-2) + "-" +
    ("0" + m.getUTCDate()).slice(-2);

const EditProduction = () => {
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

        if(bendera === 'msc'){
            formData.append('param','milledSugarCane');
        } else if(bendera === 'prs') {
            formData.append('param','processedRs');
        } else if(bendera === 'sc') {
            formData.append('param','sugarCane');
        } else {
            formData.append('param','sugarFromRs');
        }

        UserService.editProduction(formData).then(
            async (response) => {
                const accounts = await window.ethereum.enable();
                const akun = accounts[0];
                if(bendera === 'msc'){
                    const storageContractMSC = new web3.eth.Contract(MSC, '0xA2E320F53a57EFe583A3ddfB5a29bacDa944f4fd');
                    const gas = await storageContractMSC.methods.addProductionMsc(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var postMSC = await storageContractMSC.methods.addProductionMsc(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', postMSC.transactionHash);
                    updateData.append('wallet', postMSC.from);
                    updateData.append('flag', 'milledSugarCane');

                    UserService.addProdcutionTransactionHash(updateData);
                } else if(bendera === 'prs'){
                    const storageContractPRS = new web3.eth.Contract(PRS, '0xEBd34C9958E1e921a2359DEd83b9e7945Af720E4');
                    const gas = await storageContractPRS.methods.addProductionPrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var postPRS = await storageContractPRS.methods.addProductionPrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', postPRS.transactionHash);
                    updateData.append('wallet', postPRS.from);
                    updateData.append('flag', 'processedRs');

                    UserService.addProdcutionTransactionHash(updateData);
                } else if(bendera === 'sc'){
                    const storageContractSC = new web3.eth.Contract(SFC, '0xF7e31a64761a538413333812EC150184fC42b475');
                    const gas = await storageContractSC.methods.addProductionSfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var postSC = await storageContractSC.methods.addProductionSfc(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', postSC.transactionHash);
                    updateData.append('wallet', postSC.from);
                    updateData.append('flag', 'sugarCane');

                    UserService.addProdcutionTransactionHash(updateData);
                } else {
                    const storageContractSFRS = new web3.eth.Contract(SFRS, '0x855DeEff0EC2169F3798075e7c402389B88bFF11');
                    const gas = await storageContractSFRS.methods.addProductionSfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).estimateGas();
                    var postSFRS= await storageContractSFRS.methods.addProductionSfrs(response.data.data.id, response.data.data.date, response.data.data.volume, 'edited', dateString).send({
                    from: akun,
                    gas,
                    }, (error, transactionHash) => {
                    console.log([error, transactionHash]);
                    setHash(transactionHash);
                    });

                    // insert txn hash ke database
                    const updateData = new FormData();
                    updateData.append('id', response.data.data.id);
                    updateData.append('transaction', postSFRS.transactionHash);
                    updateData.append('wallet', postSFRS.from);
                    updateData.append('flag', 'sugarFromRs');

                    UserService.addProdcutionTransactionHash(updateData);
                }

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
                    return (
                        <EditProductionForm onSubmit={handleSubmit} onSelectDate={handleDate} dataFlag={bendera} dataID={id} />
                    )
                }
            })()}
        </Fragment>
    );
};

export default EditProduction;
