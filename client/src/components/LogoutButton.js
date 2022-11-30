import React, { useContext } from "react";
import UserContext from "../UserContext";

const LogoutButton = ({ setUserInfo, className }) => {
  const { userInfo} = useContext(UserContext);

  const handleClick = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };
  return (
    <div className={className}>
      <button onClick={handleClick}>
        Logout
      </button>{" "}
      - {userInfo?.fullName}
    </div>
  );
};

export default LogoutButton;
