import React, { useContext, useRef, useState } from "react";
import logo from "../logo.svg";
import "./Login.css";

import UserContext from "../UserContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { setUserInfo, API } = useContext(UserContext);
  const [errorsForm, setErrorsForm] = useState([]);

  const navigate = useNavigate();
  const usernameInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = async (e) => {
    const username = usernameInput.current.value;
    const password = passwordInput.current.value;
    try {
      const response = await API.post("/api/auth/login", {
        username,
        password,
      });
      const token = response.data.token;
      API.setToken(token)
      setUserInfo(response.data.userInfo);

      navigate("/");
    } catch (e) {
      setErrorsForm([e.response.data.err]);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login">
        <h1>התחברות</h1>
        <img alt="logo" src={logo} />
        <input
          type="text"
          name="username"
          placeholder="Enter Your UserName"
          ref={usernameInput}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          ref={passwordInput}
        />
        <div className="error">
          {errorsForm.map((err) => (
            <span key={err}>{err}</span>
          ))}
        </div>
        <button
          onClick={(e) => {
            
            handleSubmit();
            e.preventDefault();
            // return false;
          }}
          type="submit"
        >
          Login!
        </button>
        <Link to={'/register'}>להרשמה</Link>
      </form>
    </div>
  );
};

export default Login;
