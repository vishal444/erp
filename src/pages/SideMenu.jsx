import React, { useState, useEffect } from "react";
import MassInput from "./MassInput";
import Inputs from "./Inputs";
import Product from "./Product";
import Expenses from "./Expenses";
import i18next from "i18next";
import jwt_decode from "jwt-decode";

function SideMenu() {
  const [selectedOptionForm, setSelectedOptionForm] = useState("expenses");
  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
    // Check if token is expired on component mount
    // checkTokenExpiration();
  }, []);
  const handleOptionChange = (option) => {
    setSelectedOptionForm(option);
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
  const renderForm = () => {
    if (selectedOptionForm === "bulkDataEntry") {
      return (
        <div>
          <div className="listing-container">
            <MassInput />
          </div>
        </div>
      );
    } else if (selectedOptionForm === "inputs") {
      return (
        <div>
          <div className="listing-container">
            <Inputs />
          </div>
        </div>
      );
    } else if (selectedOptionForm === "products") {
      return (
        <div>
          <div className="listing-container">
            <Product />
          </div>
        </div>
      );
    } else if (selectedOptionForm === "expenses") {
      return (
        <div>
          <div className="listing-container">
            <Expenses />
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        id="menu"
        className="listing-container-ash"
        style={{
          width: "20%",
          marginRight: "10px",
          display: "flex",
          flexDirection: "column",
          paddingLeft: "5px",
        }}
      >
        <button
          type="button"
          className={`button-white ${
            selectedOptionForm === "expenses" && "active"
          }`}
          style={{
            backgroundColor: selectedOptionForm === "expenses" ? "black" : "",
            color: selectedOptionForm === "expenses" ? "white" : "",
            height: "60px",
            width: "230px",
            fontWeight: "900",
          }}
          onClick={() => handleOptionChange("expenses")}
        >
          Expenses
        </button>

        <button
          type="button"
          className={`button-white ${
            selectedOptionForm === "inputs" && "active"
          }`}
          style={{
            backgroundColor: selectedOptionForm === "inputs" ? "black" : "",
            color: selectedOptionForm === "inputs" ? "white" : "",
            height: "60px",
            width: "230px",
            fontWeight: "900",
          }}
          onClick={() => handleOptionChange("inputs")}
        >
          Data entry
        </button>

        <button
          type="button"
          className={`button-white ${
            selectedOptionForm === "products" && "active"
          }`}
          style={{
            backgroundColor: selectedOptionForm === "products" ? "black" : "",
            color: selectedOptionForm === "products" ? "white" : "",
            height: "60px",
            width: "230px",
            fontWeight: "900",
          }}
          onClick={() => handleOptionChange("products")}
        >
          Product data
        </button>
        <button
          type="button"
          className={`button-white ${
            selectedOptionForm === "bulkDataEntry" && "active"
          }`}
          style={{
            backgroundColor:
              selectedOptionForm === "bulkDataEntry" ? "black" : "",
            color: selectedOptionForm === "bulkDataEntry" ? "white" : "",
            height: "60px",
            width: "230px",
            fontWeight: "900",
          }}
          onClick={() => handleOptionChange("bulkDataEntry")}
        >
          Bulk Product Entry
        </button>
      </div>
      <div className="col-sm-9" id="renderer" style={{ flex: "1" }}>
        {renderForm()}
      </div>
    </div>
  );
}

export default SideMenu;
