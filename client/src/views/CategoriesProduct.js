import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
      <h2>
        {categoryInfo ? (
          <>
            {categoryInfo.name}{" "}
            <Link to={`/category/create-edit/${categoryId}`}>
              <img
                alt="icon-edit"
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5IDE5IiBoZWlnaHQ9IjE5cHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxOSAxOSIgd2lkdGg9IjE5cHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnPjxwYXRoIGQ9Ik04LjQ0LDcuMjVDOC4zNDgsNy4zNDIsOC4yNzcsNy40NDcsOC4yMTUsNy41NTdMOC4xNzQsNy41MTZMOC4xNDksNy42OSAgIEM4LjA0OSw3LjkyNSw4LjAxNCw4LjE4Myw4LjA0Miw4LjQ0MmwtMC4zOTksMi43OTZsMi43OTctMC4zOTljMC4yNTksMC4wMjgsMC41MTctMC4wMDcsMC43NTItMC4xMDdsMC4xNzQtMC4wMjRsLTAuMDQxLTAuMDQxICAgYzAuMTA5LTAuMDYyLDAuMjE1LTAuMTMzLDAuMzA3LTAuMjI1bDUuMDUzLTUuMDUzbC0zLjE5MS0zLjE5MUw4LjQ0LDcuMjV6IiBmaWxsPSIjMjMxRjIwIi8+PHBhdGggZD0iTTE4LjE4MywxLjU2OGwtMC44Ny0wLjg3Yy0wLjY0MS0wLjY0MS0xLjYzNy0wLjY4NC0yLjIyNS0wLjA5N2wtMC43OTcsMC43OTdsMy4xOTEsMy4xOTFsMC43OTctMC43OTggICBDMTguODY3LDMuMjA1LDE4LjgyNCwyLjIwOSwxOC4xODMsMS41Njh6IiBmaWxsPSIjMjMxRjIwIi8+PHBhdGggZD0iTTE1LDkuNjk2VjE3SDJWMmg4Ljk1M2wxLjUyMy0xLjQyYzAuMTYyLTAuMTYxLDAuMzUzLTAuMjIxLDAuNTU1LTAuMjkzICAgYzAuMDQzLTAuMTE5LDAuMTA0LTAuMTgsMC4xNzYtMC4yODdIMHYxOWgxN1Y3LjkyOEwxNSw5LjY5NnoiIGZpbGw9IiMyMzFGMjAiLz48L2c+PC9zdmc+"
              />
            </Link>
          </>
        ) : (
          "מוצרים"
        )}
      </h2>
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
      <ItemSelect onClick={() => navigate("/product/create-edit/")}>
        צור מוצר חדש...
      </ItemSelect>
    </div>
  );
};

export default CategoriesProduct;
