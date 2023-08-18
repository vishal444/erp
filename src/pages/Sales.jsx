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
  const [isReturnButtonClicked, setIsReturnButtonClicked] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false); // for button fading purpose
  const [returnAmountReceived, setReturnAmountReceived] = useState("");

  const { t } = useTranslation();

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
          `https://bisbuddy.xyz/api/erp/product/getAll/${userName}`,
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
          `https://bisbuddy.xyz/api/erp/inventory/getAll/${userName}`,
          config
        );
        setInventory(inventoryResponse.data);
        const salesResponse = await axios.get(
          `https://bisbuddy.xyz/api/erp/sales/${userName}`,
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
          `https://bisbuddy.xyz/api/erp/salesOutstanding/${userName}`,
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
          `https://bisbuddy.xyz/api/erp/customer/getAll/${userName}`,
          config
        );
        setCustomers(customersResponse.data);
        const companyResponse = await axios.get(
          `https://bisbuddy.xyz/api/erp/company/${userName}`,
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
          updatedBarcodeData = "";
          setBarcode(updatedBarcodeData); // Clear the barcode state
          return;
        }
        let decodedId = updatedBarcodeData.substring(3, 12);
        decodedId = parseInt(decodedId).toString();
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

  // const handleOptionChange = (event) => {
  //   setSelectedOptionForm(event.target.value);
  // };
  const handleOptionChange = (option) => {
    setSelectedOptionForm(option);
  };
 

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
      `https://bisbuddy.xyz/api/erp/salesById/${newSelectedSalesId}/${userName}`
    );
    // Access the response data from the resolved promise
    setProductsOfReturn(getSelectedSaleResponse.data);
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
    if (quantity > selectedSaleItem.current_quantity) {
      alert("Received mount cannot be more than the total sale amount.");
      return;
    }
    setSelectedSaleItem((prevState) => ({
      ...prevState,
      current_quantity: prevState.current_quantity - quantity,
    }));
    setQuantityAfterReturn(selectedSaleItem.current_quantity - quantity);
    setIsReturnButtonClicked(true);
    setIsButtonClicked(true);
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
    if (advance > actualSaleAmount) {
      alert("Received amount cannot be more than the total sale amount.");
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
        "https://bisbuddy.xyz/api/erp/sales/add",
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
          `https://bisbuddy.xyz/api/erp/inventory/sale/update/${item.product}/${userName}?quantity=${item.quantity}`,
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
    if (quantity > selectedSaleItem.current_quantity) {
      alert("Entered quantity cannot be more than the total Quantity.");
      return;
    }
    if (
      returnAmountReceived &&
      returnAmountReceived >
        productsOfReturn.outstandingAmount -
          (selectedSaleItem.currentTotal -
            selectedSaleItem.product.selling_price * quantityAfterReturn)
    ) {
      alert("Received amount cannot be more than the outstanding amount.");
      return;
    }
    const userName = localStorage.getItem("email");
    const calc1 = selectedSaleItem.product.selling_price * quantityAfterReturn;
    const amount = selectedSaleItem.currentTotal - calc1;
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
        `https://bisbuddy.xyz/api/erp/inventory/sale/return/${selectedProductIdForReturn}/${userName}?quantity=${quantity}`,
        null,
        config
      );
      console.log(updateInventoryResponse.data);

      const updateSalesReturnResponse = await axios.put(
        `https://bisbuddy.xyz/api/erp/sales/return/${selectedSalesId}/${selectedProductIdForReturn}/${userName}?returnQuantity=${quantity}&returnedAmount=${amount}`,
        null,
        config
      );
      console.log(updateSalesReturnResponse.data);
    } catch (error) {
      console.log(error);
    }

    if (productsOfReturn.outstandingAmount < amount) {
      // only need to give back money if the return amount is greater than outstanding
      const returnAmount =
        (selectedSaleItem?.currentTotal || 0) -
        (selectedSaleItem?.product?.selling_price || 0) * quantityAfterReturn -
        productsOfReturn.outstandingAmount;
      const deductOutstandingAmount = amount - returnAmount;
      // To deduct the outstanding amount
      if (productsOfReturn.outstandingAmount != null) {
        try {
          const response = await axios.put(
            `https://bisbuddy.xyz/api/erp/sales/advance/${selectedSalesId}/${userName}?nextAdvance=${deductOutstandingAmount}`,
            null,
            config
          );
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
      setReturnAmountReceived("");
    } else {
      const deductOutstandingAmount = amount + returnAmountReceived;
      console.log(
        "Deduct Outstanding Amount (greater than):",
        deductOutstandingAmount
      );
      // To deduct the outstanding amount
      if (productsOfReturn.outstandingAmount != null) {
        try {
          const response = await axios.put(
            `https://bisbuddy.xyz/api/erp/sales/advance/${selectedSalesId}/${userName}?nextAdvance=${deductOutstandingAmount}`,
            null,
            config
          );
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    setSelectedProductArray([]);
    setArrayForPrint([]);
    setSelectedSaleItem("");
    setQuantity("");
  };
  const handleAdvancePayment = async (event) => {
    event.preventDefault();
    if (restOfAdvance && restOfAdvance > productsOfReturn.outstandingAmount) {
      alert("Received amount cannot be more than the outstanding amount.");
      return;
    }
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
        `https://bisbuddy.xyz/api/erp/sales/advance/${selectedSalesId}/${userName}?nextAdvance=${restOfAdvance}`,
        null,
        configForPut
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setSelectedSalesId("");
    setProductsOfReturn([]);
    setRestOfAdvance("");
  };
  const renderForm = () => {
    if (selectedOptionForm === "sales") {
      return (
        <form>
          <div className="listing-container">
            <div
              style={{
                border: "3px solid black",
                padding: "10px",
                display: "flex",
              }}
            >
              <div style={{ flexBasis: "40%", paddingRight: "10px" }}>
                <label style={{ fontWeight: "600" }}>
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
                <label style={{ fontWeight: "600" }}>{t("quantity")}:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
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
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ fontWeight: "600" }}>Name</th>
                          <th style={{ fontWeight: "600" }}>Price</th>
                          <th style={{ fontWeight: "600" }}>Quantity</th>
                          <th style={{ fontWeight: "600" }}>Action</th>
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
                                onClick={(event) =>
                                  handleDeleteRow(event, index)
                                }
                                className="button"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={{ fontWeight: "600" }}>
                  {actualSaleAmount !== 0 ? "Total: " + actualSaleAmount : ""}
                </div>
              </div>
            </div>

            <div style={{ paddingTop: "10px" }}>
              <label style={{ fontWeight: "600" }}>
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
            <div style={{ paddingTop: "10px" }}>
              <label style={{ fontWeight: "600" }}>
                {t("payment_received")}:
              </label>
              <input
                type="number"
                value={advance}
                onChange={(e) => {
                  setAdvance(e.target.value);
                }}
              />
            </div>
            <br />
            <div>
              <label style={{paddingInlineEnd:"5px"}}>{t("print_invoice")}</label>
              <input
                type="checkbox" // Use checkbox input type
                checked={invoiceTrigger} // Bind the checked attribute to the state
                onChange={() => setInvoiceTrigger(!invoiceTrigger)} // Toggle the invoiceTrigger state
              />
            </div>
            <br />
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
                border: "3px solid black",
                padding: "10px",
                display: "flex",
              }}
            >
              <div style={{ flexBasis: "40%", paddingRight: "10px" }}>
                <label style={{ fontWeight: "600" }}>
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
                <div style={{ paddingTop: "10px" }}>
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
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ fontWeight: "600" }}>Name</th>
                            <th style={{ fontWeight: "600" }}>Quantity</th>
                            <th style={{ fontWeight: "600" }}>Total</th>
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
                    </div>

                    <div>
                      <label style={{ fontWeight: "600" }}>
                        Enter quantity returned:
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseFloat(e.target.value))
                        }
                      />
                      <br />
                      <button
                        id="productReturnButton"
                        onClick={handleDecreaseQuantity}
                        className={`button ${
                          isButtonClicked ? "fade-color" : ""
                        }`}
                        disabled={isReturnButtonClicked}
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
              {selectedSaleItem && isReturnButtonClicked && (
                <p style={{ fontWeight: "600" }}>
                  Product Return Amount:{" "}
                  {selectedSaleItem.currentTotal -
                    (selectedSaleItem.product?.selling_price || 0) *
                      quantityAfterReturn}
                  {/* The ?. operator ensures that selectedSaleItem.product is safely accessed */}
                </p>
              )}
            </div>
            <div>
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked && (
                  <p style={{ fontWeight: "600" }}>
                    Money Customer Owes: {productsOfReturn.outstandingAmount}
                  </p>
                )}
            </div>
            <div>
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked &&
                productsOfReturn.outstandingAmount <
                  (selectedSaleItem?.currentTotal || 0) -
                    (selectedSaleItem?.product?.selling_price || 0) *
                      quantityAfterReturn &&
                selectedSaleItem && (
                  <div>
                    <p style={{ fontWeight: "600" }}>
                      You only have to give back:{" "}
                      {(selectedSaleItem?.currentTotal || 0) -
                        (selectedSaleItem?.product?.selling_price || 0) *
                          quantityAfterReturn -
                        productsOfReturn.outstandingAmount}
                    </p>
                  </div>
                )}
            </div>
            <div>
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked &&
                selectedSaleItem &&
                productsOfReturn.outstandingAmount >
                  (selectedSaleItem.currentTotal || 0) -
                    (selectedSaleItem.product?.selling_price || 0) *
                      quantityAfterReturn && (
                  <div>
                    <p style={{ fontWeight: "600" }}>
                      Balance money remainning:{" "}
                      {productsOfReturn.outstandingAmount -
                        (selectedSaleItem.currentTotal -
                          selectedSaleItem.product.selling_price *
                            quantityAfterReturn)}
                    </p>
                  </div>
                )}
            </div>
            <div>
              {selectedSaleItem &&
                productsOfReturn.outstandingAmount !== 0 &&
                productsOfReturn.outstandingAmount >
                  (selectedSaleItem?.currentTotal || 0) -
                    (selectedSaleItem?.product?.selling_price || 0) *
                      quantityAfterReturn &&
                isReturnButtonClicked && (
                  <p style={{ fontWeight: "600" }}>
                    Enter money received:{" "}
                    <input
                      type="number"
                      value={returnAmountReceived}
                      onChange={(e) =>
                        setReturnAmountReceived(parseFloat(e.target.value))
                      }
                      required
                    />
                  </p>
                )}
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
            <div
              style={{
                border: "3px solid black",
                padding: "10px",
                display: "flex",
              }}
            >
              <label style={{ fontWeight: "600" }}>
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
            <div style={{ paddingTop: "10px" }}>
              {productsOfReturn && productsOfReturn.saleRecords && (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th style={{ fontWeight: "600" }}>Sales Date</th>
                        <th style={{ fontWeight: "600" }}>Product Name</th>
                        <th style={{ fontWeight: "600" }}>Quantity</th>
                        <th style={{ fontWeight: "600" }}>Total</th>
                        <th style={{ fontWeight: "600" }}>GST Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsOfReturn.saleRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{productsOfReturn.sales_date}</td>
                          <td>{record.product.name}</td>
                          <td>{record.current_quantity}</td>
                          <td>{record.currentTotal}</td>
                          <td>{record.product.gstCategory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div>
              {productsOfReturn && selectedSalesId && (
                <div>
                  <p style={{ fontWeight: "600" }}>
                    Money already received:{productsOfReturn.advance}
                  </p>
                  <p style={{ fontWeight: "600" }}>
                    Money yet to be received:
                    {productsOfReturn.outstandingAmount}
                  </p>
                  <label style={{ fontWeight: "600" }}>
                    Enter Received money:
                  </label>
                  <input
                    type="number"
                    value={restOfAdvance}
                    onChange={(e) =>
                      setRestOfAdvance(parseFloat(e.target.value))
                    }
                  />
                  <br />
                </div>
              )}
            </div>
            <button className="button">OK</button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="listing-container-ash">
      <div className="row">
        <div className="col-sm-3">
          <div className="btn-group-vertical">
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "sales" && "active"
              }`}
              style={{
                backgroundColor: selectedOptionForm === "sales" ? "black" : "",
                fontWeight: "900",
              }}
              onClick={() => handleOptionChange("sales")}
            >
              make new sales
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "return" && "active"
              }`}
              style={{
                backgroundColor: selectedOptionForm === "return" ? "black" : "",
                fontWeight: "900",
              }}
              onClick={() => handleOptionChange("return")}
            >
              make returns
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "onHold" && "active"
              }`}
              style={{
                backgroundColor: selectedOptionForm === "onHold" ? "black" : "",
                fontWeight: "900",
              }}
              onClick={() => handleOptionChange("onHold")}
            >
              payment not completed
            </button>
          </div>
        </div>
        <div className="col-sm-9">{renderForm()}</div>
      </div>
    </div>
  );
}

export default Sales;
