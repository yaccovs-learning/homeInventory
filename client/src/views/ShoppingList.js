import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { dict } from "../utils/dict";

export const ShoppingList = () => {
  const { API } = useContext(UserContext);
  const [list, setList] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await API.get("/api/products/me");
      const products = response.data.products;
      setList(products);
    })();
  }, []);

  return (
    <div style={{ width: "10rem" }}>
      {list
        .filter((item) => item.currentAmount - item.minAmount < 0)
        .map((item, index) => (
          <ShoppingListItem key={index} product={item} />
        ))}
    </div>
  );
};

const ShoppingListItem = ({ product }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "2rem",
      }}
    >
      <div>{product.product.name}</div>
      <div>
        {product.minAmount < product.maxAmount && (
          <> {product.maxAmount - product.currentAmount} - </>
        )}
        {product.minAmount - product.currentAmount} {dict[product.unitType]}
      </div>
    </div>
  );
};
