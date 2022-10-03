import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import "./Header.css";
import LogoutButton from "./LogoutButton";
const Header = () => {
    const { userInfo, setUserInfo, API } = useContext(UserContext);

  const links = [
    { to: "shoppinglist", text: "רשימת קניות" },
    { to: "category", text: "רשימת מוצרים" },
  ];
  return (
    <nav>
      <div className="menu">
      {!!userInfo.id && <LogoutButton />}
        {links.map((link, index) => (
          <Link key={index} className="menu-link" to={link.to}>
            {link.text}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Header;
