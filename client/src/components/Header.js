import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../UserContext";
import "./Header.css";
import LogoutButton from "./LogoutButton";
const Header = () => {
    const { userInfo} = useContext(UserContext);

  const links = [
    { to: "shoppinglist", text: "רשימת קניות" },
    { to: "category", text: "רשימת מוצרים" },
  ];
  return (
    <nav>
      {!!userInfo.id && <LogoutButton className="logout-button" />}
      <div className="menu">
        {links.map((link, index) => (
          <Link key={index} className="buttons-with-shadow menu-link" to={link.to}>
            {link.text}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Header;
