import React, { useState, useEffect } from "react";
import Sales from "./Sales";
import Purchase from "./Purchase";
import Inventory from "./Inventory";
import Products from "./Products";
import Inputs from "./Inputs";
import MassInput from "./MassInput";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Expenses from "./Expenses";
import Forecast from "./Forecast";
import jwt_decode from "jwt-decode";

export default function Tabs() {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false); // State for showing/hiding the sidebar
  const [selectedTab, setSelectedTab] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");

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

  const tabItems = [
    { id: 1, label: t("sales") },
    { id: 2, label: t("purchases") },
    { id: 3, label: t("inventory") },
    { id: 4, label: t("graph") },
  ];

  const sidebarItems = [
    {
      id: 1,
      label: "Bulk Data Entry",
      component: <MassInput />,
      url: "/massInput",
    },
    { id: 2, label: "Inputs", component: <Inputs />, url: "/inputs" },
    { id: 3, label: "Expenses", component: <Expenses />, url: "/expenses" },
    {
      id: 4,
      label: "Add New Product",
      component: <Products />,
      url: "/products",
    },
  ];

  const handleLogout = () => {
    // Clear local storage and redirect to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    indexedDB.deleteDatabase("productsDB");
    indexedDB.deleteDatabase("customerDB");
    indexedDB.deleteDatabase("salessDB");
    window.location.href = "/";
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
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSidebarItemClick = (tabId) => {
    const selectedItem = sidebarItems.find((item) => item.id === tabId);
    if (selectedItem) {
      setCurrentUrl(selectedItem.url);
    }
    setSelectedTab(tabId);
  };

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

  const renderSidebarContent = () => {
    if (currentUrl) {
      return <div src={currentUrl} />;
    }
    return null;
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
          transition: "left 0.3s ease-out",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontWeight: "900",
        }}
      >
        {showSidebar ? "Collapse Sidebar" : "Expand Sidebar"}
      </button>
      <div
        className={`sidebar${showSidebar ? " expanded" : ""}`}
        style={{
          position: "fixed",
          top: "0",
          left: showSidebar ? "0" : "-200px",
          height: "100%",
          width: "200px",
          backgroundColor: "#f1f1f1",
          overflowX: "hidden",
          transition: "left 0.3s ease-out",
        }}
      >
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {sidebarItems.map((item) => (
            <li
              key={item.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ddd",
                cursor: "pointer",
              }}
              onClick={() => handleSidebarItemClick(item.id)}
            >
              <a href={item.url}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="sidebar-content">{renderSidebarContent()}</div>
      </div>
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