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

  const listFirstBuy = list.filter(
    (item) => item.currentAmount - item.minAmount < 0
  );
  const listLastBuy = list.filter(
    (item) =>
      item.currentAmount - item.minAmount >= 0 &&
      item.currentAmount - item.maxAmount < 0
  );

  return (
    <>
      <h2>רשימת קניות</h2>
      {listFirstBuy.length === 0 &&
        listLastBuy.length === 0 &&
        "אין חוסרים במלאי"}
        
      {listFirstBuy.length > 0 && (
        <div style={{ width: "18rem" }}>
          {listFirstBuy.map((item, index) => (
            <ShoppingListItem key={index} product={item} />
          ))}
        </div>
      )}
      {listLastBuy.length > 0 && (
        <div style={{ width: "18rem" }}>
          <h5>לא דחוף</h5>
          {listLastBuy.map((item, index) => (
            <ShoppingListItem key={index} product={item} />
          ))}
        </div>
      )}
    </>
  );
};
