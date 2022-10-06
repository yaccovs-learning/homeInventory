import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";
import { dict } from "../utils/dict";

const CreateEditProduct = () => {
  const { productId } = useParams();
  const { API, userInfo } = useContext(UserContext);
  const [product, setProduct] = useState({});
  const [categories, setCatgories] = useState([]);

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

  const propsProduct = [
    { key: "name", name: "שם המוצר", description: "", type: "text" },
    { key: "descriptionription", name: "תיאור", description: "", type: "text" },
    {
      key: "unitType",
      name: "יחידת המידה",
      description: "",
      type: "select",
      get options() {
        return Object.keys(dict).map((key) => {
          return { key, name: dict[key] };
        });
      },
    },
    { key: "color", name: "צבע רקע", description: "", type: "text" },
    { key: "imageUrl", name: "תמונת רקע", description: "", type: "text" },
    {
      key: "parentCategory",
      name: "קטגוריה",
      description: "",
      type: "select",
      get options() {
        const categoriesOpts = categories.map(({ _id, name }) => {
          return { key: _id, name };
        })
        categoriesOpts.unshift({key:"",name:" === ראשי === "})
        return categoriesOpts;
      },
    },
    {
      key: "owner",
      name: "משוייך למשתמש",
      description: "",
      type: "select",
      options: [
        {
          key: product.owner?._id,
          name: product.owner?.username,
        },
      ],
    },
    { key: "isPublic", name: "ציבורי", description: "", type: "checkbox" },
  ];

  const optionsToSelectOptions = (options) => {
    return options.map(({ key, name }) => (
      <option value={key} key={key}>
        {name}
      </option>
    ));
  };


  const changeHandler = ({ target: { name, value } }) => {
    console.log("name", name, "value",value);
    setProduct((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = async () => {
    if (productId) {
      API.put(`/api/products/edit/${productId}`, product);
    } else {
      API.post("/api/products/create", product);
    }
  };

  const deleteHandler = async ()=> {
    API.delete(`/api/products/delete/${productId}`)
  }
// console.log(`${userInfo.id} === ${product.owner._id} = ${userInfo.id === product.owner}`)
  return (
    <div>
      <h3>{productId ?"עריכת":"יצירת"} מוצר: {product.name}</h3>
      {productId && (userInfo.typeUser === 'admin' || userInfo.id === product.owner?._id) && <button onClick={deleteHandler}>מחיקה</button>}
      {propsProduct.map(({ key, name, type, options, description }) => (
        <div key={key} style={{ margin: "1rem" }}>
          <label>
            <span title={description}>{name}: </span>
            {type === "select" ? (
              <select name={key} onChange={changeHandler} value={product[key]}>
                {optionsToSelectOptions(options)}
              </select>
            ) : type === "checkbox" ? (
              <label>
                <input
                  type="checkbox"
                  name={key}
                  onChange={changeHandler}
                  value={product[key]}
                />{" "}
              </label>
            ) : key === "color" ? (
              <>
                <input
                  type="text"
                  name={key}
                  onChange={changeHandler}
                  value={product[key]}
                />
                <div
                  style={{
                    width: "2rem",
                    height: "1rem",
                    backgroundColor: product[key],
                  }}
                ></div>
              </>
            ) : (
              <input
                type="text"
                name={key}
                onChange={changeHandler}
                value={product[key]}
              />
            )}
          </label>
        </div>
      ))}
      <button onClick={submitHandler}>Submit</button>
    </div>
  );
};

export default CreateEditProduct;
