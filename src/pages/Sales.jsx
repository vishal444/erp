import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import Select from "react-select";

function Sales() {
  const [selectedOptionForm, setSelectedOptionForm] = useState("sales");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductIdForReturn, setSelectedProductIdForReturn] =
    useState("");
  const [quantityAfterReturn, setQuantityAfterReturn] = useState("");
  const [selectedSaleItem, setSelectedSaleItem] = useState(null);
  const [sales, setSales] = useState([]);
  const [salesOutstanding, setSalesOutstanding] = useState([]);
  const [productsOfReturn, setProductsOfReturn] = useState([]);
  const [selectedSalesId, setSelectedSalesId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  // const [selectedPrice, setSelectedPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [advance, setAdvance] = useState("");
  const [restOfAdvance, setRestOfAdvance] = useState("");
  const [actualSaleAmount, setActualSaleAmount] = useState(0);
  // const [date, setDate] = useState("");
  const [selectedProductArray, setSelectedProductArray] = useState([]);
  const [arrayForPrint, setArrayForPrint] = useState([]);
  const [invoiceTrigger, setInvoiceTrigger] = useState(false);
  const [transformedProducts, setTransformedProducts] = useState(null);
  const [transformedSales, setTransformedSales] = useState(null);
  const [transformedSalesOutstanding, setTransformedSalesOutstanding] =
    useState(null);
  const [barcode, setBarcode] = useState("");
  const [addToProductArrayDisabled, setAddToProductArrayButtonDisabled] =
    useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const { t } = useTranslation();

  const handleOptionChange = (event) => {
    setSelectedOptionForm(event.target.value);
  };
  const handleGenerateInvoice = (event) => {
    event.preventDefault();
    setInvoiceTrigger(true);
  };
  useEffect(() => {
    ///////// for language change ////////
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
    ////////////////////////
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    async function fetchData() {
      try {
        const productsResponse = await axios.get(
          `https://43.204.30.111:8080/api/erp/product/getAll/${userName}`,
          config
        );

        setProducts(productsResponse.data);
        // Initialize temp variable and set transformedProducts state
        if (productsResponse.data) {
          const temp = productsResponse.data.map((product) => ({
            value: product.product_id,
            label: product.name,
          }));
          setTransformedProducts(temp);
        }

        const inventoryResponse = await axios.get(
          `https://localhost:8080/api/erp/inventory/getAll/${userName}`,
          config
        );
        setInventory(inventoryResponse.data);
        const salesResponse = await axios.get(
          `https://43.204.30.111:8080/api/erp/sales/${userName}`,
          config
        );
        setSales(salesResponse.data);
        // Initialize temp variable and set transformedProducts state
        if (salesResponse.data) {
          const saleTemp = salesResponse.data.map((sale) => ({
            value: sale.id,
            label: sale.id,
          }));
          setTransformedSales(saleTemp);
        }

        const salesOutstandingResponse = await axios.get(
          `https://43.204.30.111:8080/api/erp/salesOutstanding/${userName}`,
          config
        );
        setSalesOutstanding(salesOutstandingResponse.data);
        // Initialize temp variable and set transformedProducts state
        if (salesOutstandingResponse.data) {
          const salesOutstandingTemp = salesOutstandingResponse.data.map(
            (salesOutstanding) => ({
              value: salesOutstanding.id,
              label: salesOutstanding.id,
            })
          );
          setTransformedSalesOutstanding(salesOutstandingTemp);
        }
        const customersResponse = await axios.get(
          `https://43.204.30.111:8080/api/erp/customer/getAll/${userName}`,
          config
        );
        setCustomers(customersResponse.data);
        const companyResponse = await axios.get(
          `https://43.204.30.111:8080/api/erp/company/${userName}`,
          config
        );
        setCompanyData(companyResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    setProductsOfReturn([]);
    setQuantityAfterReturn("");
  }, [selectedOptionForm]);
  //////////////////////// BARCODE HANDLING ///////////////////////////////////
  useEffect(() => {
    const handleBarcodeKeyPress = (event) => {
      let updatedBarcodeData = barcode + event.key;
      setAddToProductArrayButtonDisabled(false); // the scanning event was triggering addToProductArray function !!
      if (event.key === "Enter") {
        if (updatedBarcodeData.length !== 18) {
          console.log("Invalid barcode data: " + updatedBarcodeData);
          updatedBarcodeData = "";
          setBarcode(updatedBarcodeData); // Clear the barcode state
          return;
        }
        console.log("Scanned barcode: " + updatedBarcodeData);
        let decodedId = updatedBarcodeData.substring(3, 12);
        decodedId = parseInt(decodedId).toString();
        console.log("Decoded: ", decodedId);
        setSelectedProductId(decodedId);
        // Set the success message
        var confirmationLabel = document.getElementById("barcode_confirmation");
        confirmationLabel.textContent = "Product scanned successfully!";
        updatedBarcodeData = ""; // Clear the barcode data
        setBarcode(updatedBarcodeData); // Clear the barcode state
      }
      setBarcode(updatedBarcodeData);
    };
    document.addEventListener("keypress", handleBarcodeKeyPress);
    return () => {
      document.removeEventListener("keypress", handleBarcodeKeyPress);
    };
  }, [barcode]);

  // console.log("inventory:", sales);
  // const handleProductIdChange = (e) => {
  //   setSelectedProductId(e.target.value);
  // };
  const handleProductIdChange = (selectedOption) => {
    setSelectedOption(selectedOption); // for clearing the product from the product drop down after each addToProductArray
    setSelectedProductId(selectedOption.value);
  };
  const AddToProductArray = (event) => {
    event.preventDefault();
    // Check if a product has been selected
    if (selectedProductId === "") {
      alert("Please select a product");
      return;
    }
    if (quantity === "") {
      // Check if the quantity is empty
      alert("Please enter a quantity");
      return;
    }
    const productToAdd = products.find(
      (product) => product.product_id === parseInt(selectedProductId)
    );
    const newProductForPrint = {
      productId: selectedProductId,
      productName: productToAdd.name,
      productDescription: productToAdd.description,
      productPrice: productToAdd.selling_price,
      productQuantity: quantity,
      total: productToAdd.selling_price * quantity,
    };
    const newSaleAmount =
      actualSaleAmount + productToAdd.selling_price * quantity;
    setActualSaleAmount(newSaleAmount);
    console.log(" product id: ", selectedProductId);
    setSelectedProductArray([
      ...selectedProductArray,
      {
        product: selectedProductId,
        quantity: quantity,
      },
    ]);
    setAddToProductArrayButtonDisabled(true);
    setArrayForPrint([...arrayForPrint, newProductForPrint]);
    setSelectedProductId("");
    setQuantity("");
    setBarcode("");
    setSelectedOption(null); // Reset the selected product option
  };

  const handleDeleteRow = (event, index) => {
    event.preventDefault();

    const deletedItem = selectedProductArray[index];
    const productToDelete = products.find(
      (product) => product.product_id === parseInt(deletedItem.product)
    );

    const newSelectedProductArray = [...selectedProductArray];
    newSelectedProductArray.splice(index, 1);

    const newArrayForPrint = [...arrayForPrint];
    newArrayForPrint.splice(index, 1);

    setSelectedProductArray(newSelectedProductArray);
    setArrayForPrint(newArrayForPrint);

    // Update the actualSaleAmount by subtracting the deleted item's total from the current value
    const newActualSaleAmount =
      actualSaleAmount - productToDelete.selling_price * deletedItem.quantity;
    setActualSaleAmount(newActualSaleAmount);
  };

  ////////////// RETURN SALES PRODUCTS AND SALES ADVANCE SETTLING////////////////////////
  const handleSalesIdChange = async (selectedOption) => {
    const userName = localStorage.getItem("email");
    const newSelectedSalesId = selectedOption.value;
    setSelectedSalesId(newSelectedSalesId);
    // Make GET request to fetch the selected sale data
    const getSelectedSaleResponse = await axios.get(
      `https://43.204.30.111:8080/api/erp/salesById/${newSelectedSalesId}/${userName}`
    );
    // Access the response data from the resolved promise
    setProductsOfReturn(getSelectedSaleResponse.data);
    console.log("selected saleId:", newSelectedSalesId);
  };
  ///////////////////////////////////////

  const handleProductChangeForReturn = (e) => {
    e.preventDefault();
    const newSelectedProductId = parseInt(e.target.value);
    setSelectedProductIdForReturn(newSelectedProductId);
    // Check if productsOfReturn has been set yet
    if (productsOfReturn && productsOfReturn.saleRecords) {
      // Find the sale item corresponding to the selected product id
      const saleItem = productsOfReturn.saleRecords.find(
        (item) => item.product.product_id === newSelectedProductId
      );
      setSelectedSaleItem(saleItem);
    }
  };

  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    setSelectedSaleItem((prevState) => ({
      ...prevState,
      current_quantity: prevState.current_quantity - quantity,
    }));
    setQuantityAfterReturn(selectedSaleItem.current_quantity - quantity);
  };
  const handleCustomerChange = (e) => {
    e.preventDefault();
    setSelectedCustomerId(e.target.value);
  };

  const generateInvoice = () => {
    const invoiceTemplate = `
      <html>
      <head>
        <style>
          /* Styles for the invoice layout */
          @media print {
            /* Set dot matrix printer paper size */
            @page {
              size: 8in 5in;
              margin: 0;
            }
          }
  
          /* Additional styles for dot matrix printer */
          /* Adjust font size, line spacing, and layout as needed */
          body {
            font-size: 12px;
            line-height: 1.2;
            margin: 0.5in;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .logo {
            width: 150px;
          }
          .company-info {
            max-width: 50%;
          }
          .company-info h3 {
            margin: 0 0 10px;
            font-size: 14px;
          }
          .company-info p {
            margin: 0;
            font-size: 12px;
          }
          .invoice-info {
            text-align: right;
          }
          .invoice-info h1 {
            margin: 0 0 5px;
            font-size: 14px;
          }
          .invoice-info p {
            margin: 0;
            font-size: 12px;
          }
          table {
            margin: 0 auto;
            width: 100%;
            border-collapse: collapse;
          }
          table th {
            text-align: left;
            border-bottom: 1px solid #000;
            font-size: 12px;
          }
          table td {
            padding: 5px 0;
            font-size: 12px;
          }
          .totals {
            margin-top: 20px;
          }
          .totals p {
            margin: 5px 0;
            font-size: 12px;
          }
          .totals h2 {
            margin: 10px 0;
            font-size: 14px;
          }
          .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <header class="header">
          <img class="logo" src="" alt="Your Company Logo">
          <div class="company-info">
            <h3>${companyData.companyName}</h3>
            <p>${companyData.companyAddress}</p>
            <p>${companyData.zipCode}</p>
            <p>${companyData.companyPhoneNumber}</p>
            <p>${companyData.gstNumber}</p>
          </div>
          <div class="invoice-info">
            <h1>INVOICE</h1>
            <p>Invoice Number: #</p>
            <p>Invoice Date: </p>
          </div>
        </header>
        <main>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${arrayForPrint
                .map(
                  (item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.productDescription}</td>
                    <td>${item.productQuantity}</td>
                    <td>${item.productPrice}</td>
                    <td>${item.total}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <p>Subtotal:</p>
            <p>GST: </p>
            <p>Shipping: </p>
            <h2>Total: ${actualSaleAmount}</h2>
          </div>
        </main>
        <footer class="footer">
          <p>Thank you for your business!</p>
          <p>Invoice generated by ${companyData.companyName}</p>
        </footer>
      </body>
      </html>
    `;

    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    // Set the content of the iframe
    iframe.contentDocument.write(invoiceTemplate);
    // Print the iframe content
    iframe.contentWindow.print();
  };

  const handleSubmitSales = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    // Check if submit button is clicked but items are not added to the list by clicking "add to list" button
    if (
      selectedProductArray.length === 0 ||
      selectedProductId !== "" ||
      quantity !== ""
    ) {
      alert("Please add product to the list");
      return;
    }

    // Check if the quantity in inventory is more than the quantity of the products being sold
    let allProductsAvailable = true;
    for (const item of selectedProductArray) {
      const productInInventory = inventory.find(
        (inv) => inv.product_id.product_id === parseInt(item.product)
      );
      if (
        productInInventory.quantity === 0 ||
        productInInventory.quantity < item.quantity
      ) {
        // when inventory is zero or less than the required quantity, an error occurs
        allProductsAvailable = false;
        // specifically print the name
        console.log(item.name);
        break;
      }
    }
    if (!allProductsAvailable) {
      alert("Error: Not enough products in inventory");
      return;
    }

    const salesData = {
      date: "",
      unit: "Kg",
      actualSaleAmount: actualSaleAmount,
      grandTotal: "",
      advance: advance,
      customerId: selectedCustomerId,
      userName: userName,
      returnedTotalAmount: "",
      saleRecordDTOS: selectedProductArray.map((item) => ({
        product: parseInt(item.product),
        quantity: parseFloat(item.quantity),
        returnedQuantity: "",
      })),
    };
    if (invoiceTrigger) {
      generateInvoice();
    }
    // setArrayForPrint("");      // This is wrong
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const addSaleResponse = await axios.post(
        "https://43.204.30.111:8080/api/erp/sales/add",
        salesData,
        config
      );
      if (addSaleResponse.status === 200) {
        // Display success message here
        alert("sale saved successfully");
      }
      // Set up the Axios config object with the Authorization header and data object
      const configForPut = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Update inventory for all products in the sale
      for (const item of selectedProductArray) {
        const updateInventoryResponse = await axios.put(
          `https://43.204.30.111:8080/api/erp/inventory/sale/update/${item.product}/${userName}?quantity=${item.quantity}`,
          null,
          configForPut
        );
        console.log(updateInventoryResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
    setSelectedProductArray([]);
    setArrayForPrint([]);
    setActualSaleAmount(0);
    setSelectedCustomerId("");
    setSelectedProductId("");
    setQuantity("");
    setAdvance("");
  };

  const handleSubmitReturn = async (event) => {
    event.preventDefault();
    const userName = localStorage.getItem("email");
    const calc1 = selectedSaleItem.product.selling_price * quantityAfterReturn;
    const amount = selectedSaleItem.total - calc1;
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const updateInventoryResponse = await axios.put(
        `https://43.204.30.111:8080/api/erp/inventory/sale/return/${selectedProductIdForReturn}/${userName}?quantity=${quantity}`,
        null,
        config
      );
      console.log(updateInventoryResponse.data);

      const updateSalesReturnResponse = await axios.put(
        `https://43.204.30.111:8080/api/erp/sales/return/${selectedSalesId}/${selectedProductIdForReturn}/${userName}?returnQuantity=${quantity}&returnedAmount=${amount}`,
        null,
        config
      );
      console.log(updateSalesReturnResponse.data);
    } catch (error) {
      console.log(error);
    }
    setSelectedProductArray([]);
    setArrayForPrint([]);
    setQuantity("");
  };
  const handleAdvancePayment = async (event) => {
    event.preventDefault();
    const userName = localStorage.getItem("email");
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `https://43.204.30.111:8080/api/erp/sales/advance/${selectedSalesId}/${userName}?nextAdvance=${restOfAdvance}`,
        null,
        configForPut
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const renderForm = () => {
    if (selectedOptionForm === "sales") {
      return (
        <form>
          <div className="listing-container">
            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                display: "flex",
              }}
            >
              <div style={{ flexBasis: "40%", paddingRight: "10px" }}>
                <label>
                  {t("select_product")}:{" "}
                  <div style={{ width: "250px" }}>
                    <Select
                      options={transformedProducts}
                      // defaultValue={selectedProductId} this also works but after adding to list this dosent get cleared
                      value={selectedOption}
                      onChange={handleProductIdChange}
                      noOptionsMessage={() => "No product found"}
                      isSearchable
                    />
                  </div>
                </label>
                <br />
                {!addToProductArrayDisabled && (
                  <label
                    id="barcode_confirmation"
                    style={{ color: "green", fontWeight: "bold" }}
                  ></label>
                )}
                <label>{t("quantity")}:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <br />
                <button
                  onClick={AddToProductArray}
                  disabled={addToProductArrayDisabled}
                  className="button"
                >
                  {t("add_product_list")}
                </button>
              </div>
              <div style={{ flexBasis: "60%", paddingLeft: "10px" }}>
                {selectedProductArray.length > 0 && (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arrayForPrint.map((product, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "center" }}>
                            {product.productName}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {product.productPrice}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {product.productQuantity}
                          </td>
                          <td>
                            <button
                              onClick={(event) => handleDeleteRow(event, index)}
                              className="button"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <div>
                  {actualSaleAmount !== 0 ? "Total: " + actualSaleAmount : ""}
                </div>
              </div>
            </div>

            <div>
              <label>
                {t("select_customer")}:
                <select
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                >
                  <option value="">Customer</option>
                  {customers &&
                    customers.map((customer) => (
                      <option
                        key={customer.customer_id}
                        value={customer.customer_id}
                      >
                        {customer.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <label>{t("payment_received")}:</label>
            <input
              type="number"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
            />
            <br />
            <div>
              <label>{t("print_invoice")}</label>
              <input
                type="radio"
                id="generate-invoice"
                name="invoice-option"
                value="true"
                onClick={handleGenerateInvoice}
              />
              <br />
            </div>
            <button
              type="submit"
              onClick={handleSubmitSales}
              className="button"
            >
              OK
            </button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "return") {
      return (
        <form onSubmit={handleSubmitReturn}>
          <div className="listing-container">
            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                display: "flex",
              }}
            >
              <div style={{ flexBasis: "40%", paddingRight: "10px" }}>
                <label>
                  Select a sale:
                  <div style={{ width: "150px" }}>
                    <Select
                      options={transformedSales}
                      defaultValue={selectedSalesId}
                      onChange={handleSalesIdChange}
                      noOptionsMessage={() => "No Sales found"}
                      isSearchable
                    />
                  </div>
                </label>
                <div>
                  <select onChange={handleProductChangeForReturn}>
                    <option value="">Select a product</option>
                    {productsOfReturn.saleRecords &&
                      productsOfReturn.saleRecords.map((saleItem) => (
                        <option
                          key={saleItem.id}
                          value={saleItem.product.product_id}
                        >
                          {saleItem.product.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div style={{ flexBasis: "60%", paddingLeft: "10px" }}>
                {selectedSaleItem && (
                  <div>
                    <p>Selected Sale Item:</p>
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Quantity</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center" }}>
                            {selectedSaleItem.product.name}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {selectedSaleItem.current_quantity}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {selectedSaleItem.product.selling_price *
                              selectedSaleItem.current_quantity}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div>
                      <label>Enter quantity returned:</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                      <br />
                      <button
                        onClick={handleDecreaseQuantity}
                        className="button"
                      >
                        {" "}
                        Confirm{" "}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p>
                Money to be returned:
                {selectedSaleItem &&
                  selectedSaleItem.total -
                    selectedSaleItem.product.selling_price *
                      quantityAfterReturn}
              </p>
            </div>
            <button type="submit" className="button">
              OK
            </button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "onHold") {
      return (
        <form onSubmit={handleAdvancePayment}>
          <div className="listing-container">
            <div>
              <label>
                Select a sale:
                <div style={{ width: "150px" }}>
                  <Select
                    options={transformedSalesOutstanding}
                    defaultValue={selectedSalesId}
                    onChange={handleSalesIdChange}
                    noOptionsMessage={() => "No Sales found"}
                    isSearchable
                  />
                </div>
              </label>
            </div>
            <div>
              {productsOfReturn && productsOfReturn.saleRecords && (
                <table>
                  <thead>
                    <tr>
                      <th>Sales Date</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>GST Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsOfReturn.saleRecords.map((record) => (
                      <tr key={record.id}>
                        <td>{productsOfReturn.sales_date}</td>
                        <td>{record.product.name}</td>
                        <td>{record.quantity}</td>
                        <td>{record.total}</td>
                        <td>{record.product.gstCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div>
              <p>Advance received:{productsOfReturn.advance}</p>
              <p>
                Money yet to be received:{productsOfReturn.outstandingAmount}
              </p>
            </div>
            <div>
              <label>Enter Received money:</label>
              <input
                type="number"
                value={restOfAdvance}
                onChange={(e) => setRestOfAdvance(e.target.value)}
              />
              <br />
            </div>
            <button className="button">OK</button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="listing-container-ash">
      <div>
        <label>
          <input
            type="radio"
            value="sales"
            checked={selectedOptionForm === "sales"}
            onChange={handleOptionChange}
          />
          {t("sales")}
        </label>
        <label>
          <input
            type="radio"
            value="return"
            checked={selectedOptionForm === "return"}
            onChange={handleOptionChange}
          />
          {t("returns")}
        </label>
        <label>
          <input
            type="radio"
            value="onHold"
            checked={selectedOptionForm === "onHold"}
            onChange={handleOptionChange}
          />
          {t("on_hold")}
        </label>
      </div>
      {renderForm()}
    </div>
  );
}

export default Sales;
