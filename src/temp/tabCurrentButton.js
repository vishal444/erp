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

export default function Tabs() {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [currentComponent, setCurrentComponent] = useState(null);

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
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
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    indexedDB.deleteDatabase("productsDB");
    indexedDB.deleteDatabase("customerDB");
    indexedDB.deleteDatabase("salessDB");
    window.location.href = "/"; // Redirect to the specified URL
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSidebarItemClick = (url) => {
    const selectedItem = sidebarItems.find((item) => item.url === url);
    if (selectedItem) {
      setCurrentComponent(selectedItem.component);
      window.location.href = url; // Redirect to the specified URL
    }
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
        return null;
    }
  };

  const renderSidebarContent = () => {
    return currentComponent;
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
              onClick={() => handleSidebarItemClick(item.url)}
            >
              <button
                style={{
                  fontWeight: "900",
                }}
              >
                {item.label}
              </button>
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
