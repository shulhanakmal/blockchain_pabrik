import DashboardProduction from "./DashboardProduction";
import DashboardLogistics from "./DashboardLogistics";
import DashboardSales from "./DashboardSales";
import DashboardAdmin from "./DashboardAdmin";

const HalamanUtama = (props) => {
  const userRole = props.userRole;

  return (
    // <Fragment>
    //   <div className="container pabrik">
    //     <NavLink to="/detailBatch">
    //       <div className="component pabrik" id="actionComp">
    //         <div className="title pabrik" id="actionDiv">
    //           <img
    //             src="images/logo-qr-code.png"
    //             alt="Scan QR Code"
    //             style={{ width: "50px", margin: "auto" }}
    //           />
    //           <h1 id="actionName" className="pabrik">
    //             Scan QR Code
    //           </h1>
    //         </div>
    //       </div>
    //     </NavLink>
    //   </div>
    // </Fragment>
    <div>
      <DashboardAdmin />
      {/* {(() => {
        if (userRole === 'production') {
          return(
            <DashboardProduction />
          )
        } else if(userRole === 'logistics') {
          return(
            <DashboardLogistics />
          )
        } else if(userRole === 'sales') {
          return(
            <DashboardSales />
          )
        } else {
          return(
            <DashboardAdmin />
          )
        }
      })()} */}
    </div>
  );
};

export default HalamanUtama;
