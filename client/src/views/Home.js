import React, { useContext, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import UserContext from "../UserContext";
import CategoriesProduct from "./CategoriesProduct";
import UserProduct from "./UserProduct";
import { ShoppingList } from "./ShoppingList";
import CreateEditProduct from "./CreateEditProduct";
import CreateEditCategory from "./CreateEditCategory";

const Home = () => {
  const { userInfo, setUserInfo, API } = useContext(UserContext);
  const navigate = useNavigate();
  const loginByToken = async () => {
    if (API.tokenExists()) {
      const response = await API.post("/api/auth/checkUser", {});
      setUserInfo(response.data);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    loginByToken();

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>HomeInventory</h1>
      <Header />
      <Routes>
        <Route path="category">
          <Route path=":categoryId" element={<CategoriesProduct />} />
          <Route path="create-edit" element={<CreateEditCategory />}>
            <Route path=":categoryId" element={<CreateEditCategory />} />
          </Route>
          <Route path="" element={<CategoriesProduct />} />
        </Route>
        <Route path="product">
          <Route path=":productId" element={<UserProduct />} />
          <Route path="create-edit" element={<CreateEditProduct />}>
            <Route path=":productId" element={<CreateEditProduct />} />
          </Route>
        </Route>
        <Route path="shoppinglist" element={<ShoppingList />} />
      </Routes>
    </div>
  );
};

export default Home;
