import React, { useState, useEffect } from "react";
import axios from "axios";

function Listing() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    // Fetch the list of products and customers and set the state
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(`https://43.204.30.111:8080/api/erp/inventory/getAll/${userName}`, config)
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="listing-container">
      <h1>Inventory</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ padding: "8px 16px" }}>ID</th>
              <th style={{ padding: "8px 16px" }}>Product Name</th>
              <th style={{ padding: "8px 16px" }}>Quantity</th>
              <th style={{ padding: "8px 16px" }}>Buying Price</th>
            </tr>
          </thead>
          <tbody>
            {inventory &&
              inventory.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: "center", padding: "0px 32px" }}>
                    {item.product_id.product_id}
                  </td>
                  <td style={{ textAlign: "center", padding: "0px 32px" }}>
                    {item.product_id.name}
                  </td>
                  <td style={{ textAlign: "center", padding: "0px 32px" }}>
                    {item.quantity}
                  </td>
                  <td style={{ textAlign: "center", padding: "0px 32px" }}>
                    {item.buying_price}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Inventory() {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <Listing />
    </div>
  );
}
