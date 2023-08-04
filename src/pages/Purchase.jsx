import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import Select from "react-select";

function Purchase() {
  const [selectedOptionForm, setSelectedOptionForm] = useState("purchase");
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [purchases, setPurchase] = useState([]);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [directExpense, setDirectExpense] = useState("");
  // const [date, setDate] = useState("");
  const [selectedProductArray, setSelectedProductArray] = useState([]);
  const [arrayForPrint, setArrayForPrint] = useState([]);
  const [selectedPurchaseItem, setSelectedPurchaseItem] = useState(null);
  const [selectedProductIdForReturn, setSelectedProductIdForReturn] =
    useState("");
  const [productsOfReturn, setProductsOfReturn] = useState([]);
  const [quantityAfterReturn, setQuantityAfterReturn] = useState("");
  const [transformedProducts, setTransformedProducts] = useState(null);
  const [transformedPurchases, setTransformedPurchases] = useState(null);
  const [purchaseOutstanding, setPurchaseOutstanding] = useState([]);
  const [partPayment, setPartPayment] = useState("");
  const [restOfPayment, setRestOfPayment] = useState("");
  const [actualPurchaseAmount, setActualPurchaseAmount] = useState(0);
  const [transformedPurchaseOutstanding, setTransformedPurchaseOutstanding] =
    useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isReturnButtonClicked, setIsReturnButtonClicked] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false); // for button fading purpose
  // const [returnAmount, setReturnAmount] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    ////// for language ///////////
    const lang = localStorage.getItem("lang");
    if (lang) {
      i18next.changeLanguage(lang);
    }
    //////////////////////
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    const fetchData = async () => {
      // Set up the Axios config object with the Authorization header and data object
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const productsResponse = await axios.get(
          `https://bisbuddy.xyz/api/erp/product/getAll/${userName}`,
          config
        );
        setProducts(productsResponse.data);
        // Initialize temp variable and set transformedProducts state
        const temp = productsResponse.data.map((product) => ({
          value: product.product_id,
          label: product.name,
        }));
        setTransformedProducts(temp);
        const purchaseResponse = await axios.get(
          `https://bisbuddy.xyz/api/erp/purchases/${userName}`,
          config
        );
        setPurchase(purchaseResponse.data);
        // Initialize temp variable and set transformedProducts state
        const purchaseTemp = purchaseResponse.data.map((purchase) => ({
          value: purchase.id,
          label: purchase.id,
        }));
        setTransformedPurchases(purchaseTemp);
        const purchaseOutstandingResponse = await axios.get(
          `https://bisbuddy.xyz/api/erp/purchaseOutstanding/${userName}`,
          config
        );
        setPurchaseOutstanding(purchaseOutstandingResponse.data);
        // Initialize temp variable and set transformedProducts state
        if (purchaseOutstandingResponse.data) {
          const purchaseOutstandingTemp = purchaseOutstandingResponse.data.map(
            (purchaseOutstanding) => ({
              value: purchaseOutstanding.id,
              label: purchaseOutstanding.id,
            })
          );
          setTransformedPurchaseOutstanding(purchaseOutstandingTemp);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    setProductsOfReturn([]);
    setQuantityAfterReturn("");
  }, [selectedOptionForm]);

  // const handleProductIdChange = (e) => {
  //   setSelectedProductId(e.target.value);
  // };
  const handleProductIdChange = (selectedOption) => {
    setSelectedOption(selectedOption); // for clearing the product from the product drop down after each addToProductArray
    setSelectedProductId(selectedOption.value);
  };
  const handlePurchaseIdChange = async (selectedOption) => {
    const userName = localStorage.getItem("email");
    // find the selected purchase based on the ID
    const newSelectedPurchaseId = selectedOption.value;
    setSelectedPurchaseId(newSelectedPurchaseId);
    // Make GET request to fetch the selected sale data
    const getSelectedPurchaseResponse = await axios.get(
      `https://bisbuddy.xyz/api/erp/purchasesById/${newSelectedPurchaseId}/${userName}`
    );
    // Access the response data from the resolved promise
    setProductsOfReturn(getSelectedPurchaseResponse.data);
    console.log("selected purchaseId:", newSelectedPurchaseId);
  };

  // const handleOptionChange = (event) => {
  //   setSelectedOptionForm(event.target.value);
  // };
  const handleOptionChange = (option) => {
    setSelectedOptionForm(option);
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
    if (selectedPrice === "") {
      // Check if the quantity is empty
      alert("Please enter price of one item");
      return;
    }
    const total = quantity * selectedPrice;
    setSelectedProductArray([
      ...selectedProductArray,
      {
        product: selectedProductId,
        quantity: quantity,
        price: selectedPrice,
        quantityReturned: "",
        total: quantity * selectedPrice,
      },
    ]);
    const productToAdd = products.find(
      (product) => product.product_id === parseInt(selectedProductId)
    );
    const newProductForPrint = {
      productId: selectedProductId,
      productName: productToAdd.name,
      productDescription: productToAdd.description,
      sellingPrice: productToAdd.selling_price,
      buyingPrice: selectedPrice,
      productQuantity: quantity,
      total: productToAdd.selling_price * quantity,
    };
    setArrayForPrint([...arrayForPrint, newProductForPrint]);
    setSelectedProductId("");
    setQuantity("");
    setSelectedPrice("");
    // Update the actualPurchaseAmount by adding the total of the current item to the current value
    setActualPurchaseAmount((prevAmount) => prevAmount + total);
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
    // Update the actualPurchaseAmount by subtracting the deleted item's total from the current value
    const newActualPurchaseAmount = actualPurchaseAmount - deletedItem.total;
    setActualPurchaseAmount(newActualPurchaseAmount);
  };
  const handleProductChangeForReturn = (e) => {
    e.preventDefault();
    const newSelectedProductId = parseInt(e.target.value);
    setSelectedProductIdForReturn(newSelectedProductId);
    // Check if productsOfReturn has been set yet
    if (productsOfReturn && productsOfReturn.purchaseRecords) {
      // Find the sale item corresponding to the selected product id
      const purchaseItem = productsOfReturn.purchaseRecords.find(
        (item) => item.product.product_id === newSelectedProductId
      );
      setSelectedPurchaseItem(purchaseItem);
    }
  };
  console.log("purchase item:", selectedPurchaseItem);
  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    setSelectedPurchaseItem((prevState) => ({
      ...prevState,
      current_quantity: prevState.current_quantity - quantity,
    }));
    setQuantityAfterReturn(selectedPurchaseItem.current_quantity - quantity);
    setIsReturnButtonClicked(true);
    setIsButtonClicked(true);
  };
  const handleSubmitPurchase = async (event) => {
    event.preventDefault();

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    // Check if submit button is clicked but items are not added to the list by clicking "add to list" button
    if (
      selectedProductArray.length === 0 ||
      selectedProductId !== "" ||
      quantity !== "" ||
      selectedPrice !== ""
    ) {
      alert("Please add product to the list");
      return;
    }

    const data = {
      date: "",
      purchase_quantity: quantity,
      grandTotal: "",
      actualPurchaseAmount: actualPurchaseAmount,
      amountRenumerated: "",
      userName: userName,
      partPayment: partPayment,
      directExpense: directExpense,
      purchaseRecordDTOS: selectedProductArray.map((item) => ({
        product: parseInt(item.product),
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.price),
        quantityReturned: "",
        total: parseFloat(item.total),
      })),
    };
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const purchaseAdd = await axios.post(
        "https://bisbuddy.xyz/api/erp/purchases/add",
        data,
        config
      );
      console.log(purchaseAdd.data);

      const configForPut = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Update inventory for all products in the purchase
      for (const item of selectedProductArray) {
        const inventoryPurchaseUdpate = await axios.put(
          `https://bisbuddy.xyz/api/erp/inventory/purchase/update/${item.product}/${userName}?quantity=${item.quantity}&purchase_price=${item.price}`,
          null,
          configForPut
        );
        console.log(inventoryPurchaseUdpate.data);
      }
    } catch (error) {
      console.log(error);
    }
    setSelectedProductArray([]);
    setArrayForPrint([]);
    setActualPurchaseAmount(0);
    setDirectExpense("");
    setSelectedProductId("");
    setQuantity("");
    setPartPayment("");
    setSelectedPrice("");
  };

  const handleSubmitReturn = async (event) => {
    event.preventDefault();
    const userName = localStorage.getItem("email");
    const calc1 = selectedPurchaseItem.price * quantityAfterReturn;
    const amount = selectedPurchaseItem.currentTotal - calc1;
    console.log("return amount: ", amount);
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const inventoryUpdateResponse = await axios.put(
        `https://bisbuddy.xyz/api/erp/inventory/purchase/return/${selectedProductIdForReturn}/${userName}?quantity=${quantity}`,
        null,
        config
      );
      console.log(inventoryUpdateResponse.data);

      const purchaseUpdateResponse = await axios.put(
        `https://bisbuddy.xyz/api/erp/purchase/return/${selectedPurchaseId}/${selectedProductIdForReturn}/${userName}?returnQuantity=${quantity}&returnedAmount=${amount}`,
        null,
        config
      );
      console.log(purchaseUpdateResponse.data);
    } catch (error) {
      console.log(error);
    }

    if (productsOfReturn.outstandingAmount < amount) {
      const returnAmount =
        (selectedPurchaseItem?.currentTotal || 0) -
        (selectedPurchaseItem?.price || 0) * quantityAfterReturn -
        productsOfReturn.outstandingAmount;
      console.log("return aount:", returnAmount);
      const deductOutstandingAmount = amount - returnAmount;

      // To deduct the outstanding amount
      if (productsOfReturn.outstandingAmount != null) {
        try {
          const response = await axios.put(
            `https://bisbuddy.xyz/api/erp/purchases/partPayment/${selectedPurchaseId}/${userName}?nextAdvance=${deductOutstandingAmount}`,
            null,
            config
          );
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (productsOfReturn.outstandingAmount != null) {
        const deductOutstandingAmount = amount;
        try {
          const response = await axios.put(
            `https://bisbuddy.xyz/api/erp/purchases/partPayment/${selectedPurchaseId}/${userName}?nextAdvance=${deductOutstandingAmount}`,
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
    setProductsOfReturn([]);
    setActualPurchaseAmount(0);
    setDirectExpense("");
    setQuantity("");
    setQuantityAfterReturn("");
  };
  const handlePartPayment = async (event) => {
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
        `https://bisbuddy.xyz/api/erp/purchases/partPayment/${selectedPurchaseId}/${userName}?nextAdvance=${restOfPayment}`,
        null,
        configForPut
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setProductsOfReturn([]);
    setRestOfPayment("");
  };
  const renderForm = () => {
    if (selectedOptionForm === "purchase") {
      return (
        <form onSubmit={handleSubmitPurchase}>
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
                  Select Product:
                  <div style={{ width: "250px" }}>
                    <Select
                      options={transformedProducts}
                      // defaultValue={selectedProductId}  this also works but after adding to list this dosent get cleared
                      value={selectedOption}
                      onChange={handleProductIdChange}
                      noOptionsMessage={() => "No product found"}
                      isSearchable
                    />
                  </div>
                </label>
                <br />
                <label>Enter quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <br />
                <label>Enter price of one item:</label>
                <input
                  type="number"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                />

                <br />
                <button onClick={AddToProductArray} className="button">
                  Add product
                </button>
              </div>
              <div style={{ flexBasis: "60%", paddingLeft: "10px" }}>
                {selectedProductArray.length > 0 && (
                  <div className="table-container">
                    <table className="table">
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
                              {product.buyingPrice}
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
                <div>
                  {actualPurchaseAmount !== 0
                    ? "Total: " + actualPurchaseAmount
                    : ""}
                </div>
              </div>
            </div>

            <div>
              <label>Enter direct expense:</label>
              <input
                type="number"
                value={directExpense}
                onChange={(e) => setDirectExpense(e.target.value)}
              />
            </div>
            <div>
              <label>Enter amount paid:</label>
              <input
                type="number"
                value={partPayment}
                onChange={(e) => setPartPayment(e.target.value)}
              />
            </div>
            <button type="submit" className="button">
              Ok
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
                  Select A Purchase:
                  <div style={{ width: "250px" }}>
                    <Select
                      options={transformedPurchases}
                      defaultValue={selectedPurchaseId}
                      onChange={handlePurchaseIdChange}
                      noOptionsMessage={() => "No purchases found"}
                      isSearchable
                    />
                  </div>
                </label>
                <div>
                  <select onChange={handleProductChangeForReturn}>
                    <option value="">Select a product</option>
                    {productsOfReturn.purchaseRecords &&
                      productsOfReturn.purchaseRecords.map((item) => (
                        <option key={item.id} value={item.product.product_id}>
                          {item.product.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div style={{ flexBasis: "60%", paddingLeft: "10px" }}>
                {selectedPurchaseItem && (
                  <div>
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>PricePerItem</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              {selectedPurchaseItem.product.name}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {selectedPurchaseItem.current_quantity}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {selectedPurchaseItem.price}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {selectedPurchaseItem.price *
                                selectedPurchaseItem.current_quantity}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div style={{ paddingTop: "8px" }}>
                      <label>Enter quantity returned:</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
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
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked && (
                  <p>Money I Owe: {productsOfReturn.outstandingAmount}</p>
                )}
            </div>
            <div>
              {selectedPurchaseItem && isReturnButtonClicked && (
                <p>
                  Money to be got back: {selectedPurchaseItem.price * quantity}
                </p>
              )}
            </div>
            <div>
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked &&
                productsOfReturn.outstandingAmount <
                  (selectedPurchaseItem?.currentTotal || 0) -
                    (selectedPurchaseItem?.price || 0) * quantityAfterReturn &&
                selectedPurchaseItem && (
                  <div>
                    <p>
                      You should get:{" "}
                      {(selectedPurchaseItem?.currentTotal || 0) -
                        (selectedPurchaseItem?.price || 0) *
                          quantityAfterReturn -
                        productsOfReturn.outstandingAmount}
                    </p>
                  </div>
                )}
            </div>
            <div>
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked &&
                selectedPurchaseItem &&
                productsOfReturn.outstandingAmount >
                  (selectedPurchaseItem.currentTotal || 0) -
                    (selectedPurchaseItem?.price || 0) *
                      quantityAfterReturn && (
                  <div>
                    <p>
                      You have to pay:{" "}
                      {productsOfReturn.outstandingAmount -
                        (selectedPurchaseItem.currentTotal -
                          selectedPurchaseItem.price * quantityAfterReturn)}
                    </p>
                  </div>
                )}
            </div>
            {/* <div>
              {productsOfReturn.outstandingAmount !== 0 &&
                isReturnButtonClicked && (
                  <p>
                    Enter received money:{" "}
                    <input
                      type="number"
                      value={returnAmount}
                      onChange={(e) => setReturnAmount(e.target.value)}
                    />
                  </p>
                )}
            </div> */}
            <button type="submit" className="button">
              Ok
            </button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "onHold") {
      return (
        <form onSubmit={handlePartPayment}>
          <div className="listing-container">
            <div>
              <label>
                Select a sale:
                <div style={{ width: "150px" }}>
                  <Select
                    options={transformedPurchaseOutstanding}
                    defaultValue={selectedPurchaseId}
                    onChange={handlePurchaseIdChange}
                    noOptionsMessage={() => "No Purchase found"}
                    isSearchable
                  />
                </div>
              </label>
            </div>
            <div>
              {productsOfReturn && productsOfReturn.purchaseRecords && (
                <div className="table-container">
                  <table className="table">
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
                      {productsOfReturn.purchaseRecords.map((record) => (
                        <tr key={record.id}>
                          <td>{productsOfReturn.sales_date}</td>
                          <td>{record.product.name}</td>
                          <td>{record.initial_quantity}</td>
                          <td>{record.initialTotal}</td>
                          <td>{record.product.gstCategory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div>
              <p>Already paid:{productsOfReturn.partPayment}</p>
              <p>Money yet to be paid:{productsOfReturn.outstandingAmount}</p>
            </div>
            <div>
              <label>Enter Payment money:</label>
              <input
                type="number"
                value={restOfPayment}
                onChange={(e) => setRestOfPayment(e.target.value)}
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
      <div className="row">
        <div className="col-sm-3">
          <div className="btn-group-vertical">
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "sales" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "purchase" ? "black" : "",
                fontWeight: "900",
              }}
              onClick={() => handleOptionChange("purchase")}
            >
              make new purchase
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "purchase" && "active"
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

export default Purchase;
