import React from "react";

const LogoutButton = ({ setUserInfo }) => {
  const handleClick = () => {
    sessionStorage.removeItem("token");
    
    window.location.href = "/";
  };
  return <button onClick={handleClick}>Logout</button>;
};

export default LogoutButton;
