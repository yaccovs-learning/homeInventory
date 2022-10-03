import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";

const CreateEditProduct = () => {
  const { productId } = useParams();
  const { API } = useContext(UserContext);
  const [product, setProduct] = useState({});
  const [catgories, setCatgories] = useState([]);

  const propsProduct = [
    "name",
    "description",
    "unitType",
    "color",
    "imageUrl",
    "parentCategory",
    "owner",
    "isPublic",
  ];

  useEffect(() => {
    (async () => {
      const response = await API.get(`/api/categories/all`);
      setCatgories(response.data.categories);
    })();
  }, []);

  useEffect(() => {
    if (productId) {
      (async () => {
        const response = await API.get(`/api/products/${productId}`);
        setProduct(response.data.product);
      })();
    }
  }, [productId]);

  const optionsCategories = catgories.map((category) => (
    <option value={category._id} key={category._id}>
      {category.name}
    </option>
  ));
  optionsCategories.unshift(<option value="" key="">
    === ראשי ===
  </option>)
  return (
    <div>
      CreateEditProduct: {product.name}
      {propsProduct.map((key) => (
        <div key={key}>
          <label>
            <span>{key}: </span>
            {key !== "parentCategory" ? (
              <input type="text" name={key} value={product[key]} />
            ) : (
              <select name={key} value={product[key]}>{optionsCategories}</select>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CreateEditProduct;
