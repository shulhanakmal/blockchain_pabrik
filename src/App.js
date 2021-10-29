import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import HalamanUtama from "./components/Pabrik/HalamanUtama/HalamanUtama";
import Stock from "./components/Pabrik/Stok/Stock";
import SummaryProduction from "./components/Pabrik/Production/SummaryProduction";
import ListProduction from "./components/Pabrik/Production/ListProduction";
import EditProduction from "./components/Pabrik/Production/EditProduction";
import DaftarMilledSugarCane from "./components/Pabrik/Production/DaftarMilledSugarCane";
import DaftarProcessedRs from "./components/Pabrik/Production/DaftarProcessedRs";
import DaftarSugarCane from "./components/Pabrik/Production/DaftarSugarCane";
import DaftarSugarFromRs from "./components/Pabrik/Production/DaftarSugarFromRs";
import SummaryLogistic from "./components/Pabrik/Logistic/SummaryLogistic";
import ListLogistic from "./components/Pabrik/Logistic/ListLogistic";
import EditLogistic from "./components/Pabrik/Logistic/EditLogistic";
import DaftarReturnBulkSugar from "./components/Pabrik/Logistic/DaftarReturnBulkSugar";
import DaftarStockBulkSugarFromCane from "./components/Pabrik/Logistic/DaftarStockBulkSugarFromCane";
import DaftarStockBulkSugarFromRs from "./components/Pabrik/Logistic/DaftarStockBulkSugarFromRs";
import DaftarStockOutBulkSugar from "./components/Pabrik/Logistic/DaftarStockOutBulkSugar";
import SummarySales from "./components/Pabrik/Sales/SummarySales";
import EditSales from "./components/Pabrik/Sales/EditSales";
import Sales from "./components/Pabrik/Sales/Sales";
import DaftarSales from "./components/Pabrik/Sales/DaftarSales";
import ListUser from "./components/Pabrik/UserManagement/ListUser";
import AddUser from "./components/Pabrik/UserManagement/AddUser";
import Login from "./components/login.component";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { history } from './helpers/history';
import "./scss/style.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }


  logOut() {
    this.props.dispatch(logout());
  }

  render() {
    const { currentUser } = this.state;
    const { isLoggedIn } = this.props;

    // if (!isLoggedIn) {
    //   history.push("/login");
    // } else {
    //   const user = JSON.parse(localStorage.getItem('user'));
    //   if(user !== null) {
    //     const exampleJWT = user.token;
    //     function getPayload(jwt){
    //       return atob(jwt.split(".")[1])
    //     }
    //     const payload = getPayload(exampleJWT);
    //     if (payload.exp < Date.now() / 1000) {
    //       localStorage.removeItem("user");
    //       history.push("/login");
    //     }
    //   }
    // }

    return (
      <Router history={history}>
        {/* {currentUser && (
          <div>
            <Header logoutClick={this.logOut} userRole={this.props.user.user_role.role} userName={this.props.user.user_detail.username} />
          </div>
        )} */}
        {(() => {
          if (currentUser ) {
            return (
              <div>
                <Header logoutClick={this.logOut} userRole={this.props.user.user_role.role} userName={this.props.user.user_detail.username} />
              </div>
            )
          } else {
            return (
              <div>
                <Header />
              </div>
            )
          }
        })()}

        {(() => {
          if (this.props.user && this.props.user.user_role.role ) {
            return (
              <Route path="/" exact component={() => <HalamanUtama userRole={this.props.user.user_role.role} />} />
            )
          } else {
            return (
              <Route path="/" exact component={() => <HalamanUtama />} />
            )
          }
        })()}

        <Route path="/login" exact component={Login} />
        <Route path="/" exact component={() => <HalamanUtama />} />
        <Route path="/Stock" exact component={Stock} />
        <Route path="/SummaryProduction" exact component={SummaryProduction} />
        <Route path="/Production" exact component={ListProduction} />
        <Route path="/Production/tambah-milled-sugar-cane" exact component={DaftarMilledSugarCane} />
        <Route path="/Production/tambah-processed-rs" exact component={DaftarProcessedRs} />
        <Route path="/Production/tambah-sugar-cane" exact component={DaftarSugarCane} />
        <Route path="/Production/tambah-sugar-from-rs" exact component={DaftarSugarFromRs} />
        <Route path="/Production/edit/:flag/:id" exact component={EditProduction} />
        <Route path="/SummaryLogistic" exact component={SummaryLogistic} />
        <Route path="/Logistic" exact component={ListLogistic} />
        <Route path="/Logistic/tambah-stock-bulk-sugar-from-cane" exact component={DaftarStockBulkSugarFromCane} />
        <Route path="/Logistic/tambah-stock-bulk-sugar-from-rs" exact component={DaftarStockBulkSugarFromRs} />
        <Route path="/Logistic/tambah-stock-out-bulk-sugar" exact component={DaftarStockOutBulkSugar} />
        <Route path="/Logistic/tambah-return-bulk-sugar" exact component={DaftarReturnBulkSugar} />
        <Route path="/Logistic/edit/:flag/:id" exact component={EditLogistic} />
        <Route path="/SummarySales" exact component={SummarySales} />
        <Route path="/Sales" exact component={Sales} />
        <Route path="/Sales/edit/:id" exact component={EditSales} />
        <Route path="/Sales/tambah-sales" exact component={DaftarSales} />
        <Route path="/User-management/list-user" exact component={ListUser} />
        <Route path="/User-management/add-user" exact component={AddUser} />
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  const { isLoggedIn } = state.auth;
  return {
    user,
    isLoggedIn
  };
}

export default connect(mapStateToProps)(App);
