import React, { useContext, useRef, useState } from "react";
import logo from "../logo.svg";
import "./Login.css";

import UserContext from "../UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { setUserInfo, API } = useContext(UserContext);
  const [errorsForm, setErrorsForm] = useState([]);
  const navigate = useNavigate();
  const usernameInput = useRef();
  const fullNameInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = async () => {
    const username = usernameInput.current.value;
    const fullName = fullNameInput.current.value;
    const password = passwordInput.current.value;
    console.log(username, password);
    try {
      const response = await API.post("/api/auth/register", {
        username,
        password,
        fullName,
      });
      const token = response.data.token;
      API.setToken(token);
      
      setUserInfo({ name: username });
      navigate("/");
    } catch (e) {
      const newError = e.response.data.err;
      setErrorsForm([newError]);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login">
        <h1>הרשמה</h1>
        <img alt="logo" src={logo} />
        <input
          type="text"
          name="username"
          placeholder="Enter Your UserName"
          ref={usernameInput}
        />
        <input
          type="text"
          name="fullName"
          placeholder="Enter Your Full Name"
          ref={fullNameInput}
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
            return false;
          }}
          type="submit"
        >
          register!
        </button>
      </form>
    </div>
  );
};

export default Register;
