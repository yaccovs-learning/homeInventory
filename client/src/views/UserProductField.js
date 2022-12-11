import React from "react";
import UserProductInput from "../components/UserProductInput";

export const UserProductField = ({
  product, inEdit, unitType, onChange, children, setStateEdit, valueChange,
}) => {
  const data = { min: product.minAmount, max: product.maxAmount };
  return (
    <div
      style={{
        display: "flex",
        width: "18rem",
        justifyContent: "space-between",
      }}
    >
      {children}: {data[valueChange]} {unitType}
      {inEdit[valueChange] ? (
        <>
          <UserProductInput
            initial={data[valueChange]}
            onChange={(num) => onChange(valueChange, num)}
            // max={valueChange === "min" && data["max"]}
            // min={valueChange === "max" && data["min"]} 
            />{" "}
          {unitType}
        </>
      ) : (
        <button onClick={(num) => setStateEdit(valueChange)}>הגדר</button>
      )}
    </div>
  );
};
