import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";

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
  //   console.log(internalAxios)

  useEffect(() => {
    loginByToken();
  }, []);

  return (
    <div>
      <h1>Home - {userInfo?.fullName}</h1>
    </div>
  );
};

export default Home;
