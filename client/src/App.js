import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import API from "./utils/api";
import LogoutButton from "./components/LogoutButton";
import UserContext from "./UserContext";
import Home from "./views/Home";
// import './App.css';
import Login from "./views/Login";
import Register from "./views/Register";


function App() {
  const [userInfo, setUserInfo] = useState({ username: undefined });

  console.log(userInfo);
  
  

  return (
    <div dir="rtl" className="App">
      <UserContext.Provider
        value={{
          userInfo,
          setUserInfo,
          API
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
