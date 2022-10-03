import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InfoProductInput from "../components/InfoProductInput";
import UserContext from "../UserContext";
import { dict } from "../utils/dict";
import "./InfoProduct.css";

const InfoProduct = () => {
  const { API } = useContext(UserContext);

  let { productId } = useParams();

  const [product, setProduct] = useState({
    parent: 0,
    id: 0,
    name: "",
    image: "",
    minAmount: 0,
    maxAmount: 0,
    currentAmount: 0,
    unitType: "unit",
  });

  const [viewStates, setViewStates] = useState({ min: false, max: false });
  const viewsHandler = (view) => {
    setViewStates((prev) => {
      const newViewsState = { ...prev };
      newViewsState[view] = !newViewsState[view];
      console.log(newViewsState);
      return newViewsState;
    });
  };

  const unitType = dict[product.unitType];

  useEffect(() => {
    (async () => {
      const response = await API.get(`/api/products/${productId}`);
      const newProduct = response.data.product;
      const newUserProduct = response.data.userProduct;
      if (newUserProduct) {
        newUserProduct.product = response.data.product;
        setProduct(newUserProduct);
      } else if (newProduct) {
        setProduct((prev) => {
          prev.product = newProduct;
          return product;
        });
      }
    })();
    // eslint-disable-next-line
  }, [productId]);

  const amountSetHandler = async (num) => {
    const response = await API.put(`/api/products/change-amount/${productId}`, {
      action: "add",
      amount: num,
    });
    setProduct(response.data.data);
  };

  const minMaxSetHandler = async (state, num) => {
    const data = {
      min: product.minAmount,
      max: product.maxAmount,
    };
    data[state] += num;
    const response = await API.put(
      `/api/products/set-min-max/${productId}`,
      data
    );
    setProduct(response.data.data);
    viewsHandler(state);
  };

  return (
    <div
      className="product-info-wrapper"
      style={{ backgroundImage: `url(${product.image})` }}
    >
      <div className="product-info">
        <div>
          <strong>{product?.product?.name}</strong>
          <Link to={`/product/create-edit/${productId}`}>
            <img alt="icon-edit" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5IDE5IiBoZWlnaHQ9IjE5cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxOSAxOSIgd2lkdGg9IjE5cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik04LjQ0LDcuMjVDOC4zNDgsNy4zNDIsOC4yNzcsNy40NDcsOC4yMTUsNy41NTdMOC4xNzQsNy41MTZMOC4xNDksNy42OSAgIEM4LjA0OSw3LjkyNSw4LjAxNCw4LjE4Myw4LjA0Miw4LjQ0MmwtMC4zOTksMi43OTZsMi43OTctMC4zOTljMC4yNTksMC4wMjgsMC41MTctMC4wMDcsMC43NTItMC4xMDdsMC4xNzQtMC4wMjRsLTAuMDQxLTAuMDQxICAgYzAuMTA5LTAuMDYyLDAuMjE1LTAuMTMzLDAuMzA3LTAuMjI1bDUuMDUzLTUuMDUzbC0zLjE5MS0zLjE5MUw4LjQ0LDcuMjV6IiBmaWxsPSIjMjMxRjIwIi8+PHBhdGggZD0iTTE4LjE4MywxLjU2OGwtMC44Ny0wLjg3Yy0wLjY0MS0wLjY0MS0xLjYzNy0wLjY4NC0yLjIyNS0wLjA5N2wtMC43OTcsMC43OTdsMy4xOTEsMy4xOTFsMC43OTctMC43OTggICBDMTguODY3LDMuMjA1LDE4LjgyNCwyLjIwOSwxOC4xODMsMS41Njh6IiBmaWxsPSIjMjMxRjIwIi8+PHBhdGggZD0iTTE1LDkuNjk2VjE3SDJWMmg4Ljk1M2wxLjUyMy0xLjQyYzAuMTYyLTAuMTYxLDAuMzUzLTAuMjIxLDAuNTU1LTAuMjkzICAgYzAuMDQzLTAuMTE5LDAuMTA0LTAuMTgsMC4xNzYtMC4yODdIMHYxOWgxN1Y3LjkyOEwxNSw5LjY5NnoiIGZpbGw9IiMyMzFGMjAiLz48L2c+PC9zdmc+" />
          </Link>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <label>כמות נוכחית:</label>
            <InfoProductInput
              initial={product.currentAmount}
              onChange={amountSetHandler}
            />{" "}
            {unitType}
          </div>

          {product.minAmount > product.currentAmount && (
            <div className="warning">הכמות קטנה מהכמות המינימלית הרצויה!</div>
          )}
        </div>
        <div style={{ display: "flex" }}>
          כמות רצויה מינימלית: {product.minAmount} {unitType}
          {viewStates.min ? (
            <>
              <InfoProductInput
                initial={product.minAmount}
                onChange={(num) => minMaxSetHandler("min", num)}
                max={product.maxAmount}
              />{" "}
              {unitType}
            </>
          ) : (
            <button onClick={() => viewsHandler("min")}>הגדר</button>
          )}
        </div>
        <div>
          כמות רצויה מקסימלית: {product.maxAmount} {unitType}
          {viewStates.max ? (
            <>
              <InfoProductInput
                initial={product.maxAmount}
                onChange={(num) => minMaxSetHandler("max", num)}
                min={product.minAmount}
              />{" "}
              {unitType}
            </>
          ) : (
            <button onClick={() => viewsHandler("max")}>הגדר</button>
          )}
        </div>
        <InfoProductField
          inEdit={viewStates.min}
          product={product}
          onChange={(num) => minMaxSetHandler("min", num)}
          unitType={unitType}
          setStateEdit={() => viewsHandler("min")}
        >
          כמות רצויה מינימלית
        </InfoProductField>
      </div>
    </div>
  );
};

const InfoProductField = ({
  product,
  inEdit,
  unitType,
  onChange,
  children,
  setStateEdit,
}) => {
  const min = product.minAmount;
  const max = product.maxAmount;

  return (
    <div style={{ display: "flex" }}>
      {children}: {min} {unitType}
      {inEdit ? (
        <>
          <InfoProductInput initial={min} onChange={onChange} max={max} />{" "}
          {unitType}
        </>
      ) : (
        <button onClick={() => setStateEdit(false)}>הגדר</button>
      )}
    </div>
  );
};

export default InfoProduct;
