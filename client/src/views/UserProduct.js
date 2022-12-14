import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserProductInput from "../components/UserProductInput";
import UserContext from "../UserContext";
import { dict } from "../utils/dict";
import "./UserProduct.css";
import { UserProductField } from "./UserProductField";

const UserProduct = () => {
  const { API } = useContext(UserContext);

  let { productId } = useParams();

  const [userProduct, setUserProduct] = useState({
    parent: 0,
    id: 0,
    name: "",
    image: "",
    minAmount: 0,
    maxAmount: 0,
    currentAmount: 0,
    unitType: "unit",
    product: { name: "Loading..." },
  });

  const [viewStates, setEditModeStates] = useState({ min: false, max: false });
  const editModeHandler = (view) => {
    setEditModeStates((prev) => {
      const newEditModeState = { ...prev };
      newEditModeState[view] = !newEditModeState[view];
      console.log(newEditModeState);
      return newEditModeState;
    });
  };
  console.log(userProduct.unitType);
  const unitType =
    dict[userProduct.unitType] || dict[userProduct.product.unitType];

  useEffect(() => {
    if (API.token) {
      (async () => {
        const response = await API.get(`/api/products/${productId}`);
        const newProduct = response.data.product;
        const newUserProduct = response.data.userProduct;
        if (newUserProduct) {
          newUserProduct.product = response.data.product;
          setUserProduct(newUserProduct);
        } else if (newProduct) {
          setUserProduct((prev) => {
            prev = { ...prev };
            prev.product = { ...newProduct };
            prev.unitType = newProduct.unitType;
            console.log("prev", prev);
            console.log("prev.product.name", prev.product.name);
            return prev;
          });
        }
      })();
    }
    // eslint-disable-next-line
  }, [productId,API.token]);

  const amountSetHandler = async (num) => {
    const response = await API.put(`/api/products/change-amount/${productId}`, {
      action: "add",
      amount: num,
    });
    setUserProduct(response.data.data);
  };

  const minMaxSetHandler = async (state, num) => {
    const data = {
      min: userProduct.minAmount,
      max: userProduct.maxAmount,
    };
    data[state] += num;
    if (state === "max" && data[state] < userProduct.minAmount) {
      data['min'] = data['max']
    } else if  (state === "min" && data[state] > userProduct.maxAmount) {
      data['max'] = data['min']
    } 
    const response = await API.put(
      `/api/products/set-min-max/${productId}`,
      data
    );
    setUserProduct(response.data.data);
    editModeHandler(state);
  };

  return (
    <div
      className="product-info-wrapper"
      style={{ backgroundImage: `url(${userProduct.image})` }}
    >
      <div className="product-info">
        <div>
          <strong>{userProduct.product.name}</strong>
          <Link to={`/product/create-edit/${productId}`}>
            <img
              alt="icon-edit"
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5IDE5IiBoZWlnaHQ9IjE5cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxOSAxOSIgd2lkdGg9IjE5cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik04LjQ0LDcuMjVDOC4zNDgsNy4zNDIsOC4yNzcsNy40NDcsOC4yMTUsNy41NTdMOC4xNzQsNy41MTZMOC4xNDksNy42OSAgIEM4LjA0OSw3LjkyNSw4LjAxNCw4LjE4Myw4LjA0Miw4LjQ0MmwtMC4zOTksMi43OTZsMi43OTctMC4zOTljMC4yNTksMC4wMjgsMC41MTctMC4wMDcsMC43NTItMC4xMDdsMC4xNzQtMC4wMjRsLTAuMDQxLTAuMDQxICAgYzAuMTA5LTAuMDYyLDAuMjE1LTAuMTMzLDAuMzA3LTAuMjI1bDUuMDUzLTUuMDUzbC0zLjE5MS0zLjE5MUw4LjQ0LDcuMjV6IiBmaWxsPSIjMjMxRjIwIi8+PHBhdGggZD0iTTE4LjE4MywxLjU2OGwtMC44Ny0wLjg3Yy0wLjY0MS0wLjY0MS0xLjYzNy0wLjY4NC0yLjIyNS0wLjA5N2wtMC43OTcsMC43OTdsMy4xOTEsMy4xOTFsMC43OTctMC43OTggICBDMTguODY3LDMuMjA1LDE4LjgyNCwyLjIwOSwxOC4xODMsMS41Njh6IiBmaWxsPSIjMjMxRjIwIi8+PHBhdGggZD0iTTE1LDkuNjk2VjE3SDJWMmg4Ljk1M2wxLjUyMy0xLjQyYzAuMTYyLTAuMTYxLDAuMzUzLTAuMjIxLDAuNTU1LTAuMjkzICAgYzAuMDQzLTAuMTE5LDAuMTA0LTAuMTgsMC4xNzYtMC4yODdIMHYxOWgxN1Y3LjkyOEwxNSw5LjY5NnoiIGZpbGw9IiMyMzFGMjAiLz48L2c+PC9zdmc+"
            />
          </Link>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <label>???????? ????????????:<br/></label>
            <UserProductInput
              initial={userProduct.currentAmount}
              onChange={amountSetHandler}
            />{" "}
            {unitType}
          </div>

          {userProduct.minAmount > userProduct.currentAmount && (
            <div className="warning">?????????? ???????? ???????????? ?????????????????? ????????????!</div>
          )}
        </div>
        <h5>???????? ??????????:</h5>
        <UserProductField
          inEdit={viewStates}
          product={userProduct}
          onChange={minMaxSetHandler}
          unitType={unitType}
          setStateEdit={editModeHandler}
          valueChange="min"
        >
          ????????????????
        </UserProductField>
        <UserProductField
          inEdit={viewStates}
          product={userProduct}
          onChange={minMaxSetHandler}
          unitType={unitType}
          setStateEdit={editModeHandler}
          valueChange="max"
        >
          ????????????????
        </UserProductField>
      </div>
    </div>
  );
};

export default UserProduct;
