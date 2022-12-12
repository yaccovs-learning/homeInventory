import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../UserContext";
import { dict } from "../utils/dict";
import { HexColorPicker } from "react-colorful";

const CreateEditCategory = () => {
  const { categoryId } = useParams();
  const { API, userInfo } = useContext(UserContext);
  const [category, setCategory] = useState({});
  const [categories, setCatgories] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await API.get(`/api/categories/all`);
      setCatgories(response.data.categories);
    })();
  }, []);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        const response = await API.get(`/api/categories/${categoryId}`);
        const categoryData = response.data.category;
        delete categoryData._id;
        setCategory(categoryData);
      })();
    }
  }, [categoryId]);

  const propsCategory = [
    { key: "name", name: "שם הקטגוריה", description: "", type: "text" },
    { key: "description", name: "תיאור", description: "", type: "text" },
    { key: "color", name: "צבע רקע", description: "", type: "text" },
    { key: "imageUrl", name: "תמונת רקע", description: "", type: "text" },
    {
      key: "parentCategory",
      name: "קטגוריה",
      description: "",
      type: "select",
      get options() {
        const categoriesOpts = categories
          .filter(({ _id }) => _id === categoryId)
          .map(({ _id, name }) => {
            return { key: _id, name };
          });
        categoriesOpts.unshift({ key: "0", name: " === ראשי === " });
        return categoriesOpts;
      },
    },
  ];

  const optionsToSelectOptions = (options) => {
    return options.map(({ key, name }) => (
      <option value={key} key={key}>
        {name}
      </option>
    ));
  };

  const changeHandler = ({ target: { name, value } }) => {
    console.log("name", name, "value", value);
    setCategory((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = async () => {
    if (categoryId) {
      API.put(`/api/categories/edit/${categoryId}`, category);
    } else {
      API.post("/api/categories/create", category);
    }
  };

  const deleteHandler = async () => {
    API.delete(`/api/categories/delete/${categoryId}`);
  };
  // console.log(`${userInfo.id} === ${product.owner._id} = ${userInfo.id === product.owner}`)
  return (
    <div>
      <h3>
        {categoryId ? "עריכת" : "יצירת"} מוצר: {category.name}
      </h3>
      {categoryId &&
        (userInfo.typeUser === "admin" ||
          userInfo.id === category.owner?._id) && (
          <button onClick={deleteHandler}>מחיקה</button>
        )}
      {propsCategory.map(({ key, name, type, options, description }) => (
        <div key={key} style={{ margin: "1rem" }}>
          <label>
            <span title={description}>{name}: </span>
            {type === "select" ? (
              <>
                <select
                  name={key}
                  onChange={changeHandler}
                  value={category[key]}
                >
                  {optionsToSelectOptions(options)}
                </select>
                <NewCategory />
              </>
            ) : type === "checkbox" ? (
              <label>
                <input
                  type="checkbox"
                  name={key}
                  onChange={changeHandler}
                  value={category[key]}
                />{" "}
              </label>
            ) : key === "color" ? (
              <>
                <input
                  type="text"
                  name={key}
                  onChange={changeHandler}
                  value={category[key]}
                />
                <div
                  style={{
                    width: "2rem",
                    height: "1rem",
                    backgroundColor: category[key],
                  }}
                ></div>
                <HexColorPicker
                  color={category[key]}
                  onChange={(color) =>
                    changeHandler({ target: { name: key, value: color } })
                  }
                />
              </>
            ) : (
              <input
                type="text"
                name={key}
                onChange={changeHandler}
                value={category[key]}
              />
            )}
          </label>
        </div>
      ))}
      <button onClick={submitHandler}>Submit</button>
    </div>
  );
};

export default CreateEditCategory;

const NewCategory = () => {
  const [editState, setEditState] = useState(false);
  return (
    <div
      onClick={() => {
        setEditState((prev) => !prev);
      }}
    >
      {editState ? <>open</> : <>close</>}
    </div>
  );
};
