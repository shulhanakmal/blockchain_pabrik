import React from "react";
import { useParams } from "react-router";
import DetailTracePetani from "./detailTracePetani";

function GetTracePetani() {

  const { PetaniId, SalesId, ProductId } = useParams();

  console.log(SalesId);
  console.log(ProductId);

  return (
    <div>
      <DetailTracePetani petaniId={PetaniId} salesId={SalesId} productId={ProductId} />
    </div>
  );
}

export default GetTracePetani;
