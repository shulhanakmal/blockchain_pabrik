import { Fragment, useState, React, useEffect } from "react";
import { Field, reduxForm } from "redux-form";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CCardFooter,
  CRow,
  CCol,
  CDataTable,
} from "@coreui/react";
import moment from 'moment';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Web3 from "web3";
import showResults from "./showResults/showResults";
import UserService from "../services/user.service";
import Loader from "react-spinners/DotLoader";
import { css } from "@emotion/react";
import { AddProduct as ProductMSC} from "../abi/productionMsc";
import { AddProduct as ProductSFC} from "../abi/productionSfc";
import { AddProduct as ProductPRS} from "../abi/productionPrs";
import { AddProduct as ProductSFRS} from "../abi/productionSfrs";
import { AddLogistics as LogistikSBSFC } from "../abi/logisticsSbsfc";
import { AddLogistics as LogistikSBSFRS } from "../abi/logisticsSbsfrs";
import { AddLogistics as LogistikSOBS } from "../abi/logisticsSobs";
import { AddLogistics as LogistikRBS } from "../abi/logisticsRbs";
import { AddSales } from "../abi/sales";

require("dotenv").config();

var HDWalletProvider = require("@truffle/hdwallet-provider");

const RequestDataForm = (props) => {
  const { handleSubmit } = props;
  const [data, setData] = useState([]);
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#3c4b64");
  let [dataFBC, setDFBC] = useState([]);

  const provider = new HDWalletProvider(process.env.REACT_APP_MNEMONIC,'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_PROJECT_ID);
  const web3 = new Web3(provider);

  provider.engine.stop();

  useEffect(() => {
      getData();
  }, []);

  const getData = async () => {
      const accounts = await window.ethereum.enable();
      const signer = accounts[0];

      UserService.getRD(signer).then(
          async (response) => {
              if(response.data.length === 0) {
              } else {
                  setData(response.data);                  
              }
          },
          (error) => {
              console.log(error);
          }
      );
  };

  
  const getDataApprove = async (item) => {
    setLoading(true)

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const accounts = await window.ethereum.enable();
    const akun = accounts[0];

    // insert into log
      const dataLog = new FormData();
      dataLog.append('wallet', item.address_wallet);
      dataLog.append('email', item.email);
      dataLog.append('name', item.name);
      dataLog.append('data', item.data);
      UserService.addLogRequestData(dataLog);
    // end insert log

    var getDataReq = [];
    if(item.data === 'Production') {
      // get msc
        let contractMSC = new ethers.Contract(process.env.REACT_APP_ADDRESS_MSC, ProductMSC, signer);
        let transactionMSC = await contractMSC.getAllData();
        // await transactionMSC.wait();

        await transactionMSC.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Production Milled Sugar Cane",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "status" : value[4],
              "created" : value[5]
            }
          );
        });
      // end get msc

      // get prs
        let contractPRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_PRS, ProductPRS, signer);
        let transactionPRS = await contractPRS.getAllData();
        // await transactionPRS.wait()

        await transactionPRS.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Production Processed Raw Sugar",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "status" : value[4],
              "created" : value[5]
            }
          );
        });
      // end get prs

      // get sc
        let contractSC = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFC, ProductSFC, signer);
        let transactionSC = await contractSC.getAllData();
        // await transactionSC.wait()

        await transactionSC.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Production Sugar From Cane",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "status" : value[4],
              "created" : value[5]
            }
          );
        });
      // end get sc

      // get sfrs
        let contractSFRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SFRS, ProductSFRS, signer);
        let transactionSFRS = await contractSFRS.getAllData();
        // await transactionSFRS.wait()

        await transactionSFRS.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Production From Raw Sugar",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "status" : value[4],
              "created" : value[5]
            }
          );
        });
      // end get sfrs

    } else if(item.data === 'Logistics') {
      // get sbsfc
        let contractSBSFC = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFC, LogistikSBSFC, signer);
        let transactionSBSFC = await contractSBSFC.getAllData();
        // await transactionSBSFC.wait();

        await transactionSBSFC.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Logistik Stock Bulk Sugar From Cane",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "status" : value[4],
              "created" : value[5]
            }
          );
        });
      // end get sbsfc

      // get sbsfs
        let contractSBSFRS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SBSFRS, LogistikSBSFRS, signer);
        let transactionSBSFRS = await contractSBSFRS.getAllData();
        // await transactionSBSFRS.wait();

        await transactionSBSFRS.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Logistik Stock Bulk Sugar From Raw Sugar",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "status" : value[4],
              "created" : value[5]
            }
          );
        });
      // end get sbsfrs

      // get sobs
        let contractSOBS = new ethers.Contract(process.env.REACT_APP_ADDRESS_SOBS, LogistikSOBS, signer);
        let transactionSOBS = await contractSOBS.getAllData();
        // await transactionSOBS.wait();
        await transactionSOBS.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Logistik Stock Out Bulk Sugar",
              "wallet" : value[0],
              "date" : value[2],
              "volume" : value[3],
              "sugar" : value[4],
              "status" : value[5],
              "created" : value[6]
            }
          );
        });
      // end get sobs

      // get rbs
        let contractRBS = new ethers.Contract(process.env.REACT_APP_ADDRESS_RBS, LogistikRBS, signer);
        let transactionRBS = await contractRBS.getAllData();
        // await transactionRBS.wait();
        await transactionRBS.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Logistik Return Bulk Sugar",
              "wallet" : value[0],
              "date" : value[2],
              "buyer" : value[3],
              "sugar" : value[4],
              "volume" : value[5],
              "status" : value[6],
              "created" : value[7]
            }
          );
        });
      // end get rbs
    } else if(item.data === 'Sales') {
      // get sales
        let contractSALES = new ethers.Contract(process.env.REACT_APP_ADDRESS_SALES, AddSales, signer);
        let transactionSALES = await contractSALES.getAllData();
        // await transactionSALES.wait();
        await transactionSALES.forEach(async function (value, index) {
          getDataReq.push(
            {
              "Data Request" : "Sales",
              "wallet" : value[0],
              "date" : value[2],
              "dokumen" : value[3],
              "buyer" : value[4],
              "price" : value[5],
              "sugar" : value[6],
              "volume" : value[7],
              "status" : value[8]
            }
          );
        });
      // end get sales
    } else {
      // masih aneh ketika deploy smart contract stok tidak terdeploy dan tidak terbuat abinya
      // get stok
        // let contractSTOK = new ethers.Contract(process.env.REACT_APP_ADDRESS_SALES, AddSales, signer);
        // let transactionSTOK = await contractSTOK.getAllData();
        // // await transactionSALES.wait();
        // getDataReq.push(["Sales", transactionSTOK]);
      // end get stok
    }
    

    console.log("DATANYA NIH", getDataReq);

    const fileName = "file";
    // const json = JSON.stringify(getDataReq);
    const json = JSON.stringify(getDataReq, null, 4).replace(/[",\\]]/g, "");
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDFBC(getDataReq)

    // const formData = new FormData();
    // formData.append('requestDataId',item.id);
    // formData.append('status', 'Approve');
    // console.log(formData);
    setLoading(false)
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    `
  ;

  const dataReq = [
      { key: "address_wallet", label: "Wallet"},
      { key: "data", label: "Request Data"},
      { key: "status", label: "Status"},
      // { key: "approved_by", label: "Approve"},
      {
          key: "aksi",
          label: "Aksi",
          filter: false,
      },
  ];

  return (
    <Fragment>
      {(() => {
        if (loading === true) {
              return (
                  <div style={{textAlign : 'center', verticalAlign : 'middle', paddingTop : "150px"}}>
                      <div className="sweet-loading">
                          <h5>Sedang diproses</h5><br></br>
                          {/* <h5>{this.state.TxnHash === "" ? "" : <a href={"https://ropsten.etherscan.io/tx/" + this.state.TxnHash} target="_blank" >Detail</a>}</h5> */}
                          <br></br>
                              <Loader color={color} loading={loading} css={override} size={150} />
                          <br></br>
                          <br></br>
                          <h5>Mohon Tunggu...</h5>
                      </div>
                  </div>
              )
        } else {
          if(data && data.data){
            return (
              <Fragment>
                <main className="c-main">
                  <div className="container-fluid">
                    <CCard>
                      <CCardBody>
                          <CRow>
                              <CCol xs="12">
                                  <CCardHeader>
                                      <CRow>
                                          <CCol
                                              xs={6}
                                              md={7}
                                              lg={10}
                                              style={{ margin: "auto" }}
                                          >
                                              <h4 style={{ margin: "auto" }}>List Requested Data</h4>
                                          </CCol>
                                      </CRow>
                                  </CCardHeader>
                                  <CCardBody>
                                      <CDataTable
                                        items={data.data}
                                        fields={dataReq}
                                        itemsPerPage={10}
                                        tableFilter
                                        cleaner
                                        itemsPerPageSelect
                                        hover
                                        sorter
                                        pagination
                                        scopedSlots={{
                                          aksi: (item) => {
                                            return (
                                                <td className="py-2">
                                                    {(() => {
                                                      if(item.status === 'Approve') {
                                                        return (
                                                          <CButton size="sm" color="info" onClick={() => getDataApprove(item)} >Get Data</CButton>
                                                        )
                                                      }
                                                    })()}
                                                </td>
                                            );
                                          },
                                        }}
                                      />
                                  </CCardBody>
                              </CCol>
                          </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                </main>

                <form onSubmit={handleSubmit}>
                  <main className="c-main">
                    <div className="container-fluid">
                      <CCard>
                        <CCardHeader>
                          <CRow>
                            <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                              <h4 style={{ margin: "auto" }}>Request Data</h4>
                            </CCol>
                          </CRow>
                        </CCardHeader>
                        <CCardBody>
                          <CForm action="" method="post">
                            <CFormGroup>
                              <CLabel htmlFor="nf-namaJenis">Name / Company</CLabel>
                              <Field
                                className="textInput pabrik"
                                name="nama"
                                component="input"
                                type="text"
                                required
                              />
                            </CFormGroup>
                            <CFormGroup>
                              <CLabel htmlFor="nf-namaJenis">Address</CLabel>
                                <Field
                                    className="textAreaInput pabrik"
                                    name="alamat"
                                    component="textarea"
                                    type="text"
                                    required
                                />
                            </CFormGroup>
                            <CFormGroup>
                              <CLabel htmlFor="nf-namaJenis">Email</CLabel>
                              <Field
                                className="textInput pabrik"
                                name="email"
                                component="input"
                                type="email"
                                required
                              />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="nf-namaJenis">Request Data</CLabel>
                                <Field
                                    className="textInput pabrik"
                                    name="data"
                                    component="select"
                                    required
                                >
                                    <option value="">Please Select Data</option>
                                    <option value="Production">Production</option>
                                    <option value="Logistics">Logistics</option>
                                    <option value="Sales">Sales</option>
                                    {/* <option value="Stock">Stock</option> */}
                                </Field>
                            </CFormGroup>
                          </CForm>
                        </CCardBody>
                        <CCardFooter>
                          <CButton type="submit" size="sm" color="primary">
                            Submit
                          </CButton>
                        </CCardFooter>
                      </CCard>
                    </div>
                  </main>
                </form>
              </Fragment>
            )
          } else {
            return (
              <Fragment>
                <form onSubmit={handleSubmit}>
                  <main className="c-main">
                    <div className="container-fluid">
                      <CCard>
                        <CCardHeader>
                          <CRow>
                            <CCol xs={9} md={10} lg={11} style={{ margin: "auto" }}>
                              <h4 style={{ margin: "auto" }}>Request Data</h4>
                            </CCol>
                          </CRow>
                        </CCardHeader>
                        <CCardBody>
                          <CForm action="" method="post">
                            <CFormGroup>
                              <CLabel htmlFor="nf-namaJenis">Name / Company</CLabel>
                              <Field
                                className="textInput pabrik"
                                name="nama"
                                component="input"
                                type="text"
                                required
                              />
                            </CFormGroup>
                            <CFormGroup>
                              <CLabel htmlFor="nf-namaJenis">Address</CLabel>
                                <Field
                                    className="textAreaInput pabrik"
                                    name="alamat"
                                    component="textarea"
                                    type="text"
                                    required
                                />
                            </CFormGroup>
                            <CFormGroup>
                              <CLabel htmlFor="nf-namaJenis">Email</CLabel>
                              <Field
                                className="textInput pabrik"
                                name="email"
                                component="input"
                                type="email"
                                required
                              />
                            </CFormGroup>
                            <CFormGroup>
                                <CLabel htmlFor="nf-namaJenis">Request Data</CLabel>
                                <Field
                                    className="textInput pabrik"
                                    name="data"
                                    component="select"
                                    required
                                >
                                    <option value="">Please Select Data</option>
                                    <option value="Production">Production</option>
                                    <option value="Logistics">Logistics</option>
                                    <option value="Sales">Sales</option>
                                    {/* <option value="Stock">Stock</option> */}
                                </Field>
                            </CFormGroup>
                          </CForm>
                        </CCardBody>
                        <CCardFooter>
                          <CButton type="submit" size="sm" color="primary">
                            Submit
                          </CButton>
                        </CCardFooter>
                      </CCard>
                    </div>
                  </main>
                </form>
              </Fragment>
            )
          }
        }
      })()}
    </Fragment>
  );
};

export default reduxForm({
  form: "RequestData", // a unique identifier for this form
})(RequestDataForm);



