import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import jwt_decode from "jwt-decode";

function MassInput() {
  const [rows, setRows] = useState(1); // state variable to track number of filled rows
  const [productData, setProductData] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
    // Check if token is expired on component mount
    checkTokenExpiration();
  }, []);
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
  // function to handle input change and update number of filled rows and productData
  const handleInputChange = (e) => {
    const rowIndex = parseInt(e.target.getAttribute("data-row")); // get the row index from the input element
    const newValue = e.target.value; // get the new input value

    // update the number of filled rows based on the last row that was edited
    if (rowIndex === rows - 1 && newValue !== "") {
      setRows(rows + 1);
    }

    // update the productData array with the new input value
    const name = e.target.name;
    setProductData((prevProductData) => {
      const newProductData = [...prevProductData];
      if (newProductData.length < rowIndex + 1) {
        // Initialize newProductData[rowIndex] with an empty object
        newProductData[rowIndex] = {};
      }
      newProductData[rowIndex][name] = newValue;
      return newProductData;
    });
  };
  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userName = localStorage.getItem("email");
    // Update the productData array with the userTemp value
    const updatedProductData = productData.map((product) => {
      return {
        ...product,
        userName: userName,
      };
    });
    // send the productData array to the backend
    axios
      .post("http://localhost:8080/api/erp/productList/add", updatedProductData)
      .then((response) => {
        console.log("Data saved successfully!", response.data);
        // reset the form and state variables after successful submission
        setRows(1);
        setProductData([]);
      })
      .catch((error) => {
        console.log("Error saving data!", error);
      });
    window.location.href = "/tabs";
  };
  // function to generate the table rows and columns
  const generateTable = () => {
    const table = [];

    // generate the header row with fixed column labels
    table.push(
      <tr key="header">
        <th>No.</th>
        <th>Product Name</th>
        <th>Description</th>
        <th>Selling Price</th>
        <th>Amount of Stock</th>
        <th>Buying Price</th>
      </tr>
    );

    // generate the input rows based on the current number of filled rows
    for (let i = 0; i < rows; i++) {
      // Update here to always show 5 more rows than filled rows
      const inputRow = [];
      inputRow.push(
        <td key="rowNumber">{i + 1}</td> // Add row number
      );
      inputRow.push(
        <td key="productName">
          <input
            type="text"
            name="productName"
            data-row={i}
            onChange={handleInputChange}
          />
        </td>
      );
      inputRow.push(
        <td key="description">
          <input
            type="text"
            name="description"
            min="0"
            step="0.01"
            data-row={i}
            onChange={handleInputChange}
          />
        </td>
      );
      inputRow.push(
        <td key="sellingPrice">
          <input
            type="number"
            name="sellingPrice"
            min="0"
            step="0.01"
            data-row={i}
            onChange={handleInputChange}
          />
        </td>
      );
      inputRow.push(
        <td key="existingStock">
          <input
            type="number"
            name="existingStock"
            min="0"
            data-row={i}
            onChange={handleInputChange}
          />
        </td>
      );
      inputRow.push(
        <td key="buyingPrice">
          <input
            type="number"
            name="buyingPrice"
            min="0"
            data-row={i}
            onChange={handleInputChange}
          />
        </td>
      );
      table.push(<tr key={i}>{inputRow}</tr>);
    }

    return table;
  };

  return (
    <form style={{ paddingTop: "15px" }}>
      <div className="listing-container-ash">
        <div className="table-container">
          <h3 style={{ textAlign: "center" }}>{t("enterStockDetails")}</h3>
          <table className="centered-table">
            <tbody>{generateTable()}</tbody>
          </table>
        </div>
        <button onClick={handleSubmit} className="button">
          Save
        </button>
      </div>
    </form>
  );
}

export default MassInput;
