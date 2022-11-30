import React from "react";
import "./ItemSelect.css";

const ItemSelect = ({ children, onClick, type, image, color }) => {
  const styleObj = {  };
  if (color) styleObj.backgroundColor = color
  if (image) styleObj.backgroundImage = `url(${image})`

  return (
    <div onClick={onClick} className={"item-select buttons-with-shadow " + type} style={styleObj}>
      {children}
    </div>
  );
};

export default ItemSelect;
