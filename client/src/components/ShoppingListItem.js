import React from "react";
import { Link } from "react-router-dom";
import { dict } from "../utils/dict";

export const ShoppingListItem = ({ product }) => {
  const min = product.minAmount - product.currentAmount;
  const max = product.maxAmount - product.currentAmount;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "2rem",
        border: "1px solid black",
      }}
    >
      <Link to={`/product/${product.product._id}`}>
        <div>{product.product.name}</div>
      </Link>
      <div>
        {min > 0 ? min.toFixed(2) : " עד "}
        {min < max && <> - {max.toFixed(2)} </>} {dict[product.unitType]}
      </div>
    </div>
  );
};
