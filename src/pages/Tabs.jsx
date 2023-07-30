import React, { useState, useEffect } from "react";
import Sales from "./Sales";
import Purchase from "./Purchase";
import Inventory from "./Inventory";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Forecast from "./Forecast";
// import jwt_decode from "jwt-decode";
import SideMenu from "./SideMenu";
import axios from "axios";

export default function Tabs() {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false); // State for showing/hiding the sidebar
  const [productData, setProductsData] = useState([]);
  const [showAddProductsPopup, setShowAddProductsPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
    // Check if token is expired on component mount
    // checkTokenExpiration();
    // Get the token from localStorage
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    async function fetchData() {
      try {
        const productsResponse = await axios.get(
          `https://bisbuddy.xyz/api/erp/product/getAll/${userName}`,
          config
        );
        setProductsData(productsResponse.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData().then(() => {
      // Show the pop-up after a delay of 2 seconds
      setTimeout(() => {
        if (productData.length === 0) {
          setShowAddProductsPopup(true);
        }
      }, 2000);
    });
  }, [productData]);

  const handleLanguage = (e) => {
    const lang = e.target.value;
    i18next.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // const checkTokenExpiration = () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     const decodedToken = jwt_decode(token);
  //     const currentTime = Math.floor(Date.now() / 1000);
  //     if (decodedToken.exp < currentTime) {
  //       // Token is expired
  //       // Perform necessary actions (e.g., redirect to login)
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("email");
  //       window.location.href = "/";
  //     }
  //   }
  // };
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
      {showAddProductsPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            zIndex: "999",
            display: "flex", // Use flexbox to align buttons horizontally
            flexDirection: "column", // Align buttons vertically in a column
            alignItems: "center", // Center buttons horizontally
          }}
        >
          <p>Your product data is empty.</p>
          <div>
            <button
              style={{ marginRight: "10px" }} // Add some spacing between the buttons
              onClick={() => setShowAddProductsPopup(false)}
              className="button"
            >
              Close
            </button>
            <button
              onClick={() => (window.location.href = "/massInput")}
              className="button"
            >
              Add Products
            </button>{" "}
            {/* Replace '/add-products' with the actual route where users can add products */}
          </div>
        </div>
      )}
      {/* Add the overlay to blur the background */}
      {showAddProductsPopup && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background color
            backdropFilter: "blur(5px)", // Blur effect
            zIndex: "998", // Lower zIndex to place it behind the pop-up
          }}
        ></div>
      )}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        style={{
          position: "absolute",
          top: "10px",
          // left: showSidebar ? "200px" : "10px",
          backgroundColor: "#000000",
          color: "#ffffff",
          fontWeight: "900",
          // transition: "left 0.3s ease-out",
        }}
      >
        {showSidebar ? (
          <label
            className="button-white"
            style={{ fontWeight: "900", width: "250px", height: "25px" }}
          >
            ←
          </label>
        ) : (
          <label
            className="button-white"
            style={{ fontWeight: "900", width: "75px", height: "25px" }}
          >
            ➜
          </label>
        )}
      </button>

      {showSidebar ? (
        <div id="side" style={{ paddingTop: "10px" }}>
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
