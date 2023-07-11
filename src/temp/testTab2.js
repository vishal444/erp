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
  const [showSidebar, setShowSidebar] = useState(false); // State for showing/hiding the sidebar
  const [selectedTab, setSelectedTab] = useState(1);

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
    { id: 4, label: t("add_product") },
    { id: 5, label: t("graph") },
    // { id: 6, label: t("data_entry") },
    // { id: 7, label: t("expenses") },
    // { id: 8, label: t("bulk_data") },
  ];
  const sidebarItems = [
    { id: 1, label: "Bulk Data Entry", component: <MassInput /> },
    { id: 2, label: "Inputs", component: <Inputs /> },
    { id: 3, label: "Expenses", component: <Expenses /> },
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSidebarItemClick = (tabId) => {
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
        return <Products />;
      case 5:
        return <Forecast />;
      default:
        return <Sales />;
    }
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
          style={{ backgroundColor: "#000000", color: "#ffffff", padding: "5px 10px",fontWeight: "900", }}
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
              {item.label}
            </li>
          ))}
        </ul>
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
