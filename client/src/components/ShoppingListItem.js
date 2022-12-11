import React from "react";
import { Link } from "react-router-dom";
import { dict } from "../utils/dict";
import "./ShoppingListItem.css"

export const ShoppingListItem = ({ product }) => {
  const min = product.minAmount - product.currentAmount;
  const max = product.maxAmount - product.currentAmount;

  return (
    <div
    className="shoppinglist-item"
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
