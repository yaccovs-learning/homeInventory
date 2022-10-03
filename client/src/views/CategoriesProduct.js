import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import AppContext from "../AppContext";
import ItemSelect from "../components/ItemSelect";
import UserContext from "../UserContext";

const CategoriesProduct = () => {
  const { API } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  let { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({});

  const handleClickCategory = (id) => {
    navigate(`/category/${id}`);
  };

  const handleUpCategory = () => {
    navigate(`/category/${categoryInfo.parentCategory}`);
  };

  const handleClickProduct = (id) => navigate(`/product/${id}`);

  useEffect(() => {
    (async () => {
      if (API.tokenExists()) {
        const response = await API.get(`/api/categories/${categoryId}`);
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setCategoryInfo(response.data.category);
      }
    })();
  }, [categoryId]);

  const categoriesElements = categories.map((item) => (
    <ItemSelect
      type="category"
      key={item._id}
      image={item.imageUrl}
      color={item.color}
      onClick={() => {
        handleClickCategory(item._id);
      }}
    >
      {item.name}
    </ItemSelect>
  ));
  const productsElements = products
    .filter((product) => new RegExp(search).test(product.name))
    .map((item) => (
      <ItemSelect
        type="product"
        key={item._id}
        image={item.imageUrl}
        color={item.color}
        onClick={() => {
          handleClickProduct(item._id);
        }}
      >
        {item.name}
      </ItemSelect>
    ));

  return (
    <div>
      <h2>מוצרים</h2>
      <h5>קטגוריות:</h5>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {categoryInfo && <button onClick={handleUpCategory}>⬆ Up</button>}
        {categoriesElements}
      </div>
      <h5>פריטים:</h5>
      חפש: <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {productsElements}
      </div>
      <ItemSelect onClick={()=>navigate('/product/create-edit/')}>צור מוצר חדש...</ItemSelect>
    </div>
  );
};

export default CategoriesProduct;
