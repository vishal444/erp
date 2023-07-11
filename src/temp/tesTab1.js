import React, { useState, useEffect } from "react";
import Sales from "./Sales";
import Purchase from "./Purchase";
import Inventory from "./Inventory";
import Inputs from "./Inputs";
import MassInput from "./MassInput";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Expenses from "./Expenses";
import Forecast from "./Forecast";
import jwt_decode from "jwt-decode";
import SideMenu from "./SideMenu";
import Product from "./Product";

export default function Tabs() {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false); // State for showing/hiding the sidebar

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
    // Check if token is expired on component mount
    checkTokenExpiration();
  }, []);

  const handleLanguage = (e) => {
    const lang = e.target.value;
    i18next.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Token is expired
        // Perform necessary actions (e.g., redirect to login)
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/";
      }
    }
  };
  const tabItems = [
    { id: 1, label: t("sales") },
    { id: 2, label: t("purchases") },
    { id: 3, label: t("inventory") },
    { id: 4, label: t("graph") },
  ];

  const [selectedTab, setSelectedTab] = useState(1);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 1:
        return <Sales />;
      case 2:
        return <Purchase />;
      case 3:
        return <Inventory />;
      case 4:
        return <Forecast />;
      default:
        return <Sales />;
    }
  };

  const handleLogout = () => {
    // Clear local storage and redirect to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    indexedDB.deleteDatabase("productsDB");
    indexedDB.deleteDatabase("customerDB");
    indexedDB.deleteDatabase("salessDB");
    window.location.href = "/";
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div>
      <div
        className="header"
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <select
          onChange={handleLanguage}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "5px 10px",
            fontWeight: "900",
          }}
        >
          <option>Select Language</option>
          <option value={"en"}>English</option>
          <option value={"mal"}>മലയാളം</option>
        </select>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "5px 10px",
            marginLeft: "10px",
            fontWeight: "900",
          }}
        >
          Log out
        </button>
      </div>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        style={{
          position: "absolute",
          top: "10px",
          left: showSidebar ? "200px" : "10px",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontWeight: "900",
        }}
      >
        {showSidebar ? "collapse side" : "show side"}
      </button>

      {showSidebar ? (
        <div id="side">
          <SideMenu />
        </div>
      ) : (
        <div id="main">
          <ul
            className="nav nav-tabs"
            style={{
              backgroundColor: "#000000",
              justifyContent: "center",
              color: "#ffffff",
              paddingTop: "5px",
            }}
          >
            {tabItems.map((item) => (
              <NavItem
                key={item.id}
                active={item.id === selectedTab}
                label={item.label}
                onClick={() => setSelectedTab(item.id)}
              />
            ))}
          </ul>
          <div className="tab-content pt-4" style={{ paddingTop: "25px" }}>
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ active, label, onClick }) {
  return (
    <li className="nav-item">
      <button
        className={`nav-link${active ? " active" : ""}`}
        style={{
          color: active ? "black" : "white",
          fontWeight: "900",
        }}
        onClick={onClick}
      >
        {label}
      </button>
    </li>
  );
}
