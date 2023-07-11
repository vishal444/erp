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
    { id: 1, label: t('sales') },
    { id: 2, label: t('purchases') },
    { id: 3, label: t('inventory') },
    { id: 4, label: t('add_product') },
    { id: 5, label: t('graph') },
    { id: 6, label: t('data_entry') },
    { id: 7, label: t('expenses') },
    { id: 8, label: t('bulk_data') },
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
        return <Products />;
        case 5:
        return <Forecast />;
      case 6:
        return <Inputs />;
      case 7:
        return <Expenses />;
      case 8:
        return <MassInput />;
      default:
        return <Sales />;
    }
  };
  const handleLogout = () => {
    // Clear local storage and redirect to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    indexedDB.deleteDatabase('productsDB');
    indexedDB.deleteDatabase('customerDB');
    indexedDB.deleteDatabase('salessDB');
    window.location.href = "/";  };

  const navTabsStyle = {
    backgroundColor: "#000000", // Replace with your desired ash color
    justifyContent: "center",
    color: "#ffffff", // Set the text color to white
    paddingTop: "5px", // Add top padding of 5
  };

  const languageSwitchStyle = {
    backgroundColor: "#000000",
    color: "#ffffff", // Set the text color to white
    padding: "10px", // Adjust padding as desired
  };

  return (
    <div>
      <div style={languageSwitchStyle}>
        <select onChange={handleLanguage}>
          <option>Select Language</option>
          <option value={"en"}>English</option>
          <option value={"mal"}>മലയാളം</option>
        </select>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <ul className="nav nav-tabs" style={navTabsStyle}>
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
          fontWeight: "900" 
        }}
        onClick={onClick}
      >
       {label}
      </button>
    </li>
  );
}
