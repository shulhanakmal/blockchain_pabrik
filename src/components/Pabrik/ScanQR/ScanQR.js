import { Fragment, React, Component } from "react";
import UserService from "../../../services/user.service";
import {
  CImg,
  CCard,
  CCardBody,
  CCol,
  CCarousel,
  CCarouselInner,
  CCarouselItem,
  CCarouselControl,
  CRow,
  CButton,
} from "@coreui/react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps'
require("dotenv").config();

const MARKETPLACE_URL = process.env.REACT_APP_CATALOG_URL;

export default class ScanQR extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sugar: this.props.Sugar,
      salesDoc: this.props.Doc,
      mitra: [],
      produk: null,
      sales: null,
      salesDetail: null,
      proses: null,
      prosesProduk: null,
      prosesDetail: null,
    };
  }

  async componentDidMount() {

    console.log('gula', this.state.sugar);
    const gula = this.state.sugar;

    await UserService.getScanQRDataSales(this.state.sugar, this.state.salesDoc).then((response) => {

      console.log('response', response);

      this.setState({
        sales: response.data.sales,
        salesDetail: response.data.sales.get_detail,
      });
      
    });

    await UserService.getDataProdukDanMitra(gula, this.state.salesDoc).then((response) => {

      console.log('response2', response);

      this.setState({
        mitra: response.data.mitra,
        produk: response.data.produk,
        proses: response.data.proses,
        prosesProduk: response.data.prosesProduk,
        prosesDetail: response.data.prosesDetail,
      });

    });
  }

  renderDetailProduct = () => {
    if (this.state.produk != null) {
      return (
        <Fragment>
          <CRow>
            <CCol xs="2" lg="2">
              <h1
                style={{
                  transform: "rotate(180deg)",
                  transformOrigin: "20% 80%",
                  writingMode: "vertical-lr",
                  color: "darkBlue",
                  textAlign: "center",
                }}
              >
                <strong>Sales</strong>
              </h1>

            </CCol>
            <CCol xs="2" lg="3">
              <CImg
                  src={process.env.REACT_APP_BACKEND_URL +'images/scan/Image-01.png'}
                  style={{
                    textAlign: "center",
                    transformOrigin: "20% 80%",
                    height: "100px",
                    width: "100px",
                    marginTop: "40px",
                  }}
                  // className="d-block w-100"
                  // alt={this.state.product.product_id}
                />
            </CCol>
            <CCol xs="8" lg="7">
              <p>
                <strong>Document Number:</strong> {this.state.sales.no_do}
              </p>
              <p>
                <strong>Sugar:</strong> {this.state.sugar === 'cane' ? 'Sugar Cane' : 'Raw Sugar'}
              </p>
              <p>
                <strong>Buyer:</strong> {this.state.sales.buyer}
              </p>
              <p>
                <strong>Price:</strong> Rp. {this.state.sales.price}
              </p>
              <p>
                <strong>Total Volume:</strong> {this.state.sugar === 'cane' ? this.state.sales.mount_sugar_sold_cane : this.state.sales.mount_sugar_rs} Kwintal
              </p>
              <p>
                <strong>buy date:</strong> {this.state.sales.date}
              </p>
              <p>
                <strong>date processed:</strong> {this.state.sales.created_at}
              </p>
              <p>
                <strong>Blockchain Hash:</strong> <a size="sm" style={{ color:"#ffffff" }} target="_blank" href={"https://ropsten.etherscan.io/tx/" + this.state.sales.transaction_hash} > {this.state.sales.transaction_hash} </a>
              </p>

              <hr
                style={{
                  marginTop: "60px",
                  color: "#ffffff",
                  backgroundColor: "#ffffff",
                  height: 2,
                }}
              />
            </CCol>
          </CRow>

          <CRow style={{ marginTop: "40px" }}>
            <CCol xs="2" lg="2">
              <h1
                style={{
                  transform: "rotate(180deg)",
                  transformOrigin: "20% 70%",
                  writingMode: "vertical-lr",
                  color: "darkBlue",
                  textAlign: "center",
                }}
              >
                <strong>Process</strong>
              </h1>
            </CCol>
            <CCol xs="2" lg="3">
              <CImg
                  src={process.env.REACT_APP_BACKEND_URL +'images/scan/Image-02.png'}
                  style={{
                    textAlign: "center",
                    transformOrigin: "20% 80%",
                    height: "100px",
                    width: "100px",
                    marginTop: "40px",
                  }}
                  // className="d-block w-100"
                  // alt={this.state.product.product_id}
                />
            </CCol>
            <CCol xs="8" lg="7">
            {/* loop produk */}
            {(() => {
                if (this.state.prosesProduk.length > 1) {
                  let i = 0;
                  return this.state.prosesProduk.map((value, index) => {
                    i++;
                    return (
                      <Fragment key={index}>
                        <p align="center" >
                          <strong><b> Product #{i} </b></strong>
                        </p>
                        <p>
                          <strong>Proses Sugar:</strong> {this.state.proses[index]} {/* milled sugar cane / from sugar cane / processed raw sugar / sugar from raw sugar */}
                        </p>
                        <p>
                          <strong>Sugar:</strong> {this.state.sugar === 'cane' ? 'Sugar Cane' : 'Raw Sugar'}
                        </p>
                        {(() => {
                          if(this.state.prosesProduk[index].lama_proses) {
                            return (
                              <>
                                <p>
                                  <strong>Processed for :</strong> {this.state.prosesProduk[index].lama_proses} Hour
                                </p>
                              </>
                            )
                          }
                        })()}

                        {(() => {
                          if(this.state.prosesProduk[index].brix && this.state.prosesProduk[index].trash) {
                            return (
                              <>
                                <p>
                                  <strong>SugarCane Quality </strong> 
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Brix:</strong> {this.state.prosesProduk[index].brix}
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Trash</strong> {this.state.prosesProduk[index].trash}
                                </p>
                              </>
                            )
                          } else if(this.state.prosesProduk[index].brix) {
                            return (
                              <>
                                <p>
                                  <strong>SugarCane Quality </strong> 
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Brix:</strong> {this.state.prosesProduk[index].brix}
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Trash</strong> -
                                </p>
                              </>
                            )
                          } else if(this.state.prosesProduk[index].brix) {
                            return (
                              <>
                                <p>
                                  <strong>SugarCane Quality </strong> 
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Brix:</strong> -
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Trash</strong> {this.state.prosesProduk[index].trash}
                                </p>
                              </>
                            )
                          }
                        })()}

                        <p>
                          <strong>Quality of Sugar</strong> {/* icumsa, bjb dan kadar air  */}
                        </p>
                        <p>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Icumsa:</strong> {this.state.prosesProduk[index].icumsa}
                        </p>
                        <p>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Berat Jenis:</strong> {this.state.prosesProduk[index].bjb}
                        </p>
                        <p>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Kadar Air:</strong> {this.state.prosesProduk[index].ka}
                        </p>
                        <p>
                          <strong>Date To The Factory :</strong> {this.state.prosesProduk[index].date}
                        </p>
                        <p>
                          <strong>Date Process :</strong> {this.state.prosesProduk[index].created_at}
                        </p>
                        <p>
                          <strong>Blockchain Hash :</strong> <a size="sm" style={{ color:"#ffffff" }} target="_blank" href={"https://ropsten.etherscan.io/tx/" + this.state.prosesProduk[index].transaction_hash} > {this.state.prosesProduk[index].transaction_hash} </a>
                        </p>

                        <hr
                          style={{
                            marginTop: "60px",
                            color: "#ffffff",
                            backgroundColor: "#ffffff",
                            height: 2,
                          }}
                        />
                      </Fragment>
                    )
                  })
                } else {
                  let i = 0;
                  return this.state.prosesProduk.map((value, index) => {
                    i++;
                    return (
                      <Fragment key={index}>
                        <p>
                          <strong>Proses Sugar:</strong> {this.state.proses[index]} {/* milled sugar cane / from sugar cane / processed raw sugar / sugar from raw sugar */}
                        </p>
                        <p>
                          <strong>Sugar:</strong> {this.state.sugar === 'cane' ? 'Sugar Cane' : 'Raw Sugar'}
                        </p>
                        {(() => {
                          if(value.lama_proses) {
                            return (
                              <>
                                <p>
                                  <strong>Processed for :</strong> {value.lama_proses} Hour
                                </p>
                              </>
                            )
                          }
                        })()}

                        {(() => {
                          if(this.state.prosesProduk[index].brix && this.state.prosesProduk[index].trash) {
                            return (
                              <>
                                <p>
                                  <strong>SugarCane Quality </strong> 
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Brix:</strong> {this.state.prosesProduk[index].brix}
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Trash</strong> {this.state.prosesProduk[index].trash}
                                </p>
                              </>
                            )
                          } else if(this.state.prosesProduk[index].brix) {
                            return (
                              <>
                                <p>
                                  <strong>SugarCane Quality </strong> 
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Brix:</strong> {this.state.prosesProduk[index].brix}
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Trash</strong> -
                                </p>
                              </>
                            )
                          } else if(this.state.prosesProduk[index].brix) {
                            return (
                              <>
                                <p>
                                  <strong>SugarCane Quality </strong> 
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Brix:</strong> -
                                </p>
                                <p>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Trash</strong> {this.state.prosesProduk[index].trash}
                                </p>
                              </>
                            )
                          }
                        })()}

                        <p>
                          <strong>Quality of Sugar</strong> {/* icumsa, bjb dan kadar air  */}
                        </p>
                        <p>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Icumsa:</strong> {value.icumsa}
                        </p>
                        <p>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Berat Jenis:</strong> {value.bjb}
                        </p>
                        <p>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Kadar Air:</strong> {value.ka}
                        </p>
                        <p>
                          <strong>Date To The Factory :</strong> {value.date}
                        </p>
                        <p>
                          <strong>Date Process :</strong> {value.created_at}
                        </p>
                        <p>
                          <strong>Blockchain Hash :</strong> <a size="sm" style={{ color:"#ffffff" }} target="_blank" href={"https://ropsten.etherscan.io/tx/" + value.transaction_hash} > {value.transaction_hash} </a>
                        </p>

                        <hr
                          style={{
                            marginTop: "60px",
                            color: "#ffffff",
                            backgroundColor: "#ffffff",
                            height: 2,
                          }}
                        />
                      </Fragment>
                    )
                  })
                }      
              })()}
              {/* end loop */}
            </CCol>
          </CRow>

          <CRow style={{ marginTop: "40px" }}>
            <CCol xs="2" lg="2">
              <h1
                style={{
                  transform: "rotate(180deg)",
                  transformOrigin: "20% 70%",
                  writingMode: "vertical-lr",
                  color: "darkBlue",
                  textAlign: "center",
                }}
              >
                {/* <strong>Product Dan Mitra</strong> */}
                <strong>Product</strong>
              </h1>
            </CCol>
            <CCol xs="2" lg="3">
              <CImg
                  src={process.env.REACT_APP_BACKEND_URL +'images/scan/Image-04.png'}
                  style={{
                    textAlign: "center",
                    transformOrigin: "20% 80%",
                    height: "100px",
                    width: "100px",
                    marginTop: "40px",
                  }}
                  // className="d-block w-100"
                  // alt={this.state.product.product_id}
                />
            </CCol>
            <CCol xs="8" lg="7">
              {/* loop karena produk id bisa lebih dari 1 */}
              {(() => {
                if (this.state.sales.get_detail.length > 0) {
                  let i = 0;
                  return this.state.sales.get_detail.map((value, index) => {
                    i++;
                    return (
                      <Fragment key={index}>
                        <div>
                          <p align="center" >
                            <strong><b> Hasil Produksi #{i} </b></strong>
                          </p>
                          <p>
                            <strong>Product Id:</strong> {value.product_id}
                          </p>
                          <p>
                            <strong>Volume Product:</strong> {value.volume}
                          </p>

                          <hr
                            style={{
                              marginTop: "30px",
                              color: "#ffffff",
                              backgroundColor: "#ffffff",
                              height: 2,
                            }}
                          />
                        </div>
                      </Fragment>
                    )
                  })
                }      
              })()}
              {/* end loop */}

              {(() => {
                if(this.state.sugar === 'cane') {
                  let i = 0;
                  return this.state.mitra.map((value, index) => {
                    i++;
                    return (
                      <Fragment key={index}>
                        <p align="center" >
                          <strong><b> Produk dihasilkan dari mitra pertanian #{i} </b></strong>
                        </p>
                        <p>
                          <strong>Petani:</strong> {value.nama_petani}
                        </p>
                        <p>
                          <strong>Email:</strong> {value.email}
                        </p>
                        <p>
                          <strong>Kontak:</strong> {value.email}
                        </p>
                        <p>
                          <strong>Lahan:</strong> {value.luas_lahan} Hektar
                        </p>
                          {(() => {
                            return this.state.produk.map((produk, i) => {
                              if(value.id === produk.mitra) {
                                return (
                                  // <Fragment key={i}>
                                    <p key={i}>
                                      <strong>Volume:</strong> {produk.volume} Kwintal
                                    </p>
                                  // </Fragment>
                                )
                              }
                            })
                          })()}
                        <p align="center" >
                          <CButton size="sm" color="info" style={{'color': 'white'}} to={`/Detail-mitra-petani-view/${value.id}`} target="_blank">
                            Detail
                          </CButton>
                        </p>

                        <hr
                          style={{
                            marginTop: "30px",
                            color: "#ffffff",
                            backgroundColor: "#ffffff",
                            height: 2,
                          }}
                        />
                      </Fragment>
                    )
                  })
                } else {
                  let i = 0;
                  return this.state.mitra.map((value, index) => {
                    i++;
                    return (
                      <Fragment key={index}>
                        <p align="center" >
                          <strong><b> Produk dihasilkan dari hasil import #{i} </b></strong>
                        </p>
                        <p>
                          <strong>Negara:</strong> {value.value}
                        </p>
                        {(() => {
                          return this.state.produk.map((produk, i) => {
                            if(value.id === produk.mitra) {
                              return (
                                // <Fragment key={i}>
                                  <p key={i}>
                                    <strong>Volume:</strong> {produk.volume} Kwintal
                                  </p>
                                // </Fragment>
                              )
                            }
                          })
                        })()}

                        <hr
                          style={{
                            marginTop: "30px",
                            color: "#ffffff",
                            backgroundColor: "#ffffff",
                            height: 2,
                          }}
                        />
                      </Fragment>
                    )
                  })
                }
              })()}
            </CCol>
          </CRow>

          <CRow style={{ marginTop: "40px" }}>
            <CCol xs="2" lg="5">
              <h1
                style={{
                  transform: "rotate(180deg)",
                  transformOrigin: "20% 55%",
                  writingMode: "vertical-lr",
                  color: "darkBlue",
                  textAlign: "center",
                }}
              >
                <strong>QR CODE</strong>
              </h1>
            </CCol>
            <CCol xs="10" lg="7">
              <CCol xs="12" lg="7">
                <CImg
                  src={'http://209.97.160.154:8002/' + this.state.sales.qrcode}
                  className="d-block w-100"
                  // alt={this.state.product.product_id}
                />
              </CCol>
              <hr
                style={{
                  marginTop: "60px",
                  color: "#ffffff",
                  backgroundColor: "#ffffff",
                  height: 2,
                }}
              />
            </CCol>
          </CRow>
        </Fragment>
      );
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <h4>Product Not Found...</h4>
        </div>
      );
    }
  };

  render() {
    return (
      <Fragment>
        <main className="c-main">
          <div className="container-fluid">
            <CCard style={{ backgroundColor: "#636f83", color: "white" }}>
              <CCardBody style={{ padding: "5%" }}>
                {this.renderDetailProduct()}
              </CCardBody>
            </CCard>
          </div>
        </main>
      </Fragment>
    );
  }
}
