import React from "react";
import { useParams } from "react-router";

import ScanQR from "./ScanQR";

function GetIDScan() {
  const { sugar, salesDoc } = useParams();

  console.log(sugar);
  console.log(salesDoc);
  return (
    <div>
      <ScanQR Sugar={sugar} Doc={salesDoc} />
    </div>
  );
}

export default GetIDScan;
