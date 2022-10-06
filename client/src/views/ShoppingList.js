import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { ShoppingListItem } from "../components/ShoppingListItem";

export const ShoppingList = () => {
  const { API } = useContext(UserContext);
  const [list, setList] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await API.get("/api/products/me");
      const products = response.data.products;
      setList(products);
    })();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div style={{ width: "18rem" }}>
        <h2>רשימת קניות</h2>
        {list
          .filter((item) => item.currentAmount - item.minAmount < 0)
          .map((item, index) => (
            <ShoppingListItem key={index} product={item} />
          ))}
      </div>
      <div style={{ width: "18rem" }}>
        <h5>לא דחוף</h5>
        {list
          .filter(
            (item) =>
              item.currentAmount - item.minAmount >= 0 &&
              item.currentAmount - item.maxAmount < 0
          )
          .map((item, index) => (
            <ShoppingListItem key={index} product={item} />
          ))}
      </div>
    </>
  );
};
