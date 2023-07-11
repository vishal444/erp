import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import printJS from "print-js";

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
  // const [searchQuery, setSearchQuery] = useState("");

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
          `http://localhost:8080/api/erp/product/getAll/${userName}`,
          config
        );
        setProducts(productsResponse.data);
        const inventoryResponse = await axios.get(
          `http://localhost:8080/api/erp/inventory/getAll/${userName}`,
          config
        );
        setInventory(inventoryResponse.data);
        const salesResponse = await axios.get(
          `http://localhost:8080/api/erp/sales/${userName}`,
          config
        );
        setSales(salesResponse.data);
        const salesOutstandingResponse = await axios.get(
          `http://localhost:8080/api/erp/salesOutstanding/${userName}`,
          config
        );
        setSalesOutstanding(salesOutstandingResponse.data);
        const customersResponse = await axios.get(
          `http://localhost:8080/api/erp/customer/getAll/${userName}`,
          config
        );
        setCustomers(customersResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  // console.log("products:", products);
  const handleProductIdChange = (e) => {
    setSelectedProductId(e.target.value);
  };
  // console.log("product id:", selectedProductId);
  const AddToProductArray = (event) => {
    event.preventDefault();
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
    console.log(newSaleAmount);
    setSelectedProductArray([
      ...selectedProductArray,
      {
        product: selectedProductId,
        quantity: quantity,
      },
    ]);
    setArrayForPrint([...arrayForPrint, newProductForPrint]);
    setSelectedProductId("");
    setQuantity("");
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
  const handleSalesIdChange = async (e) => {
    const newSelectedSalesId = e.target.value;
    setSelectedSalesId(newSelectedSalesId);
    // Make GET request to fetch the selected sale data
    const getSelectedSaleResponse = await axios.get(
      `http://localhost:8080/api/erp/salesById/${newSelectedSalesId}`
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
    setSelectedSaleItem((prevState) => ({
      ...prevState,
      quantity: prevState.quantity - quantity,
    }));
    setQuantityAfterReturn(selectedSaleItem.quantity - quantity);
  };
  const handleCustomerChange = (e) => {
    e.preventDefault();
    setSelectedCustomerId(e.target.value);
  };

  const generateInvoice = () => {
    // Check if the printer is a thermal printer
    // const isThermalPrinter = /* Add your condition to determine if it's a thermal printer */;
    const isThermalPrinter = false;
  
    // Define the invoice template and print settings based on the type of printer
    let invoiceTemplate = '';
    let printSettings = {};
  
    if (isThermalPrinter) {
      invoiceTemplate = `
        <html>
        <head>
          <style>
            /* Styles for the invoice layout */
            @page {
              size: 80mm 297mm; /* Adjust the paper size for your thermal printer */
            }
            /* Additional styles for dot thermal printer */
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
            <h3>Your Company Name</h3>
            <p>Your Company Address</p>
            <p>Your Company City, State Zip</p>
            <p>Your Company Phone Number</p>
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
          <p>Invoice generated by Your Company Name</p>
        </footer>
      </body>
        </html>
      `;
  
      printSettings = {
        printable: invoiceTemplate,
        type: 'raw-html',
      };
    } else {
      invoiceTemplate = `
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
            <h3>Your Company Name</h3>
            <p>Your Company Address</p>
            <p>Your Company City, State Zip</p>
            <p>Your Company Phone Number</p>
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
          <p>Invoice generated by Your Company Name</p>
        </footer>
      </body>
      </html>
      `;
  
      printSettings = {
        printable: invoiceTemplate,
        type: 'raw-html',
        style: `
          /* Additional styles for dot matrix printer */
          /* Adjust font size, line spacing, and layout as needed */
          /* ... */
        `,
      };
    }
  
    // Create a hidden iframe to render the invoice template and print it
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  
    // Set the content of the iframe
    iframe.contentDocument.write(invoiceTemplate);
  
    // Print the iframe content using Print.js and the print settings
    printJS(printSettings);
  };
  

  const handleSubmitSales = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    // Check if the quantity in inventory is more than the quantity of the products being sold
    let allProductsAvailable = true;
    for (const item of selectedProductArray) {
      const productInInventory = inventory.find(
        (inv) => inv.product_id.product_id === parseInt(item.product)
      );
      if (productInInventory.quantity < item.quantity) {
        allProductsAvailable = false;
        // specifically print the name
        break;
      } // TEST IT
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
        "http://localhost:8080/api/erp/sales/add",
        salesData,
        config
      );
      console.log(addSaleResponse.data);
      // Set up the Axios config object with the Authorization header and data object
      const configForPut = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Update inventory for all products in the sale
      for (const item of selectedProductArray) {
        const updateInventoryResponse = await axios.put(
          `http://localhost:8080/api/erp/inventory/sale/update/${item.product}?quantity=${item.quantity}`,
          null,
          configForPut
        );
        console.log(updateInventoryResponse.data);
      }
    } catch (error) {
      console.log(error);
    }
    setSelectedProductArray("");
    setArrayForPrint("");
    setActualSaleAmount(0);
    setQuantity("");
    setAdvance("");
  };

  const handleSubmitReturn = async (event) => {
    event.preventDefault();
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
        `http://localhost:8080/api/erp/inventory/sale/return/${selectedProductIdForReturn}?quantity=${quantity}`,
        null,
        config
      );
      console.log(updateInventoryResponse.data);

      const updateSalesReturnResponse = await axios.put(
        `http://localhost:8080/api/erp/sales/return/${selectedSalesId}/${selectedProductIdForReturn}?returnQuantity=${quantity}&returnedAmount=${amount}`,
        null,
        config
      );
      console.log(updateSalesReturnResponse.data);
    } catch (error) {
      console.log(error);
    }
    setSelectedProductArray("");
    setArrayForPrint("");
    setQuantity("");
  };
  const handleAdvancePayment = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `http://localhost:8080/api/erp/sales/advance/${selectedSalesId}?nextAdvance=${restOfAdvance}`,
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
            <div style={{ border: "1px solid black", padding: "10px" }}>
              <div style={{ float: "left", width: "40%" }}>
                <label>
                  {t("select_product")}:{" "}
                  <input
                    list="data"
                    value={selectedProductId}
                    onChange={handleProductIdChange}
                    placeholder="Search products"
                  />
                  <datalist id="data">
                    {products.map((product) => (
                      <option
                        key={product.product_id}
                        value={product.product_id}
                      >
                        {product.name}
                      </option>
                    ))}
                  </datalist>
                </label>

                <br />
                <label>{t("quantity")}:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <br />
                <button onClick={AddToProductArray} className="button">
                  {t("add_product_list")}
                </button>
              </div>
              <div style={{ float: "right", width: "60%" }}>
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

              <div style={{ clear: "both" }}></div>
            </div>
            <div>
              <label>
                {t("select_customer")}://///Correct this
                <select
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                >
                  <option value="">Customer</option>
                  {customers.map((customer) => (
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
            <div>
              <label>
                Select Sales Id:
                <select value={selectedSalesId} onChange={handleSalesIdChange}>
                  <option value="">Sales ID</option>
                  {sales.map((sale) => (
                    <option key={sale.id} value={sale.id}>
                      {sale.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>
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
                          {selectedSaleItem.quantity}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {selectedSaleItem.product.selling_price *
                            selectedSaleItem.quantity}
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
                    <button onClick={handleDecreaseQuantity} className="button">
                      {" "}
                      Confirm{" "}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p>
                Money to be returned // correct this:
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
                Select Sales Id for completing payment:
                <select value={selectedSalesId} onChange={handleSalesIdChange}>
                  <option value="">Sales ID</option>
                  {salesOutstanding.map((sale) => (
                    <option key={sale.id} value={sale.id}>
                      {sale.id}
                    </option>
                  ))}
                </select>
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
              <p>Advance paid:{productsOfReturn.advance}</p>
              <p>Money yet to be paid:{productsOfReturn.outstandingAmount}</p>
            </div>
            <div>
              <label>Enter Paid money:</label>
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
