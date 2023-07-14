import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";

export default function Product() {
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [selectedGstCategory, setSelectedGstCategory] = useState("");
  const [productCategories, setProductCategories] = useState([
    "ELECTRONICS",
    "BOOKS",
    "CLOTHING",
    "FOOD",
    "SANITARY",
    "MEDICINE",
    "HARDWARE",
    "BUCKETS",
  ]);
  const [gstCategories, setGstCategories] = useState([
    "GST_5",
    "GST_10",
    "GST_15",
    "GST_20",
  ]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    selling_price: "",
    weight: "",
    length: "",
    breadth: "",
    productCategory: "",
    gstCategory: "",
    userName: "",
  });

  const [sellingPriceError, setSellingPriceError] = useState(false);
  const [productData, setProductsData] = useState([]);
  const [editedName, setEditedName] = useState("");
  const [editedGst, setEditedGst] = useState("");
  const [editedSellingPrice, setEditedSellingPrice] = useState("");
  const [selectedOptionForm, setSelectedOptionForm] = useState("addProduct");
  useEffect(() => {
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
          `http://65.2.176.52:8080/api/erp/product/getAll/${userName}`,
          config
        );
        setProductsData(productsResponse.data);
        // console.log("products: ", productsResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // Check if token is expired on component mount
    checkTokenExpiration();
  }, []);
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // if Token is expired
        // Perform necessary actions (e.g., redirect to login)
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/";
      }
    }
  };
  // console.log("product data:", productData);
  const handleOptionChange = (event) => {
    setSelectedOptionForm(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };
  const handleProductCategoryChange = (event) => {
    setSelectedProductCategory(event.target.value);
  };
  const handleGstCategoryChange = (event) => {
    setSelectedGstCategory(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if Selling Price is empty
    if (!product.selling_price) {
      setSellingPriceError(true);
      return;
    }

    // Reset the error state
    setSellingPriceError(false);

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // Add the selected category to the product object
    const updatedProduct = {
      ...product,
      productCategory: selectedProductCategory,
      gstCategory: selectedGstCategory,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "http://65.2.176.52:8080/api/erp/product/add",
        updatedProduct,
        config
      );
      if (response.status === 200) {
        // Display success message here
        alert("Product added successfully");
      }
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  const editProductData = async (e, id, name, gst, price) => {
    e.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.put(
        `http://65.2.176.52:8080/api/erp/productUpdate/${id}/${userName}?name=${name}&gst=${gst}&price=${price}`,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  const renderForm = () => {
    if (selectedOptionForm === "addProduct") {
      return (
        <form onSubmit={handleSubmit} style={{ paddingTop: "15px" }}>
          <div id="addProduct" className="listing-container-nonalign">
            <h3>Add new product</h3>
            <label>Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
            <br />
            <label>Description: </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
            ></textarea>
            <br />
            <label>Selling Price: </label>
            <input
              type="number"
              id="selling_price"
              name="selling_price"
              value={product.selling_price}
              onChange={handleInputChange}
              required
            />
            {sellingPriceError && <p className="error-text">Fill this field</p>}
            <br />
            <label>Weight: </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={product.weight}
              onChange={handleInputChange}
            />
            <br />
            <label>Length: </label>
            <input
              type="number"
              id="length"
              name="length"
              value={product.length}
              onChange={handleInputChange}
            />
            <br />
            <label>Breadth: </label>
            <input
              type="number"
              id="breadth"
              name="breadth"
              value={product.breadth}
              onChange={handleInputChange}
            />
            <br />
            <label>Gst Category: </label>
            <select
              value={selectedGstCategory}
              onChange={handleGstCategoryChange}
            >
              {gstCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <br />
            <label>Product Category: </label>
            <select
              value={selectedProductCategory}
              onChange={handleProductCategoryChange}
            >
              {productCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <br />
            <button type="submit" className="button">
              Submit
            </button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "showProducts") {
      return (
        <form>
          <div id="productList" className="listing-container">
            <h3> Existing Products </h3>
            <table>
              <thead>
                <tr>
                  <th style={{ padding: "8px 16px" }}>ID</th>
                  <th style={{ padding: "8px 16px" }}>Product Name</th>
                  <th style={{ padding: "8px 16px" }}>Gst Category</th>
                  <th style={{ padding: "8px 16px" }}>Selling Price</th>
                  <th style={{ padding: "8px 16px" }}>Edit</th>
                  <th style={{ padding: "8px 16px" }}>Save</th>
                  <th style={{ padding: "8px 16px" }}>Print barcode</th>
                </tr>
              </thead>
              <tbody>
                {productData &&
                  productData.map((item) => (
                    <tr key={item.product_id}>
                      <td style={{ textAlign: "center", padding: "0px 32px" }}>
                        {item.product_id}
                      </td>
                      <td style={{ textAlign: "center", padding: "0px 32px" }}>
                        <input
                          type="text"
                          defaultValue={item.name}
                          style={{ width: "120px" }}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "center", padding: "0px 32px" }}>
                        <input
                          type="text"
                          defaultValue={item.gstCategory}
                          style={{ width: "80px" }}
                          onChange={(e) => setEditedGst(e.target.value)}
                        />
                      </td>
                      <td style={{ textAlign: "center", padding: "0px 32px" }}>
                        <input
                          type="number"
                          defaultValue={item.selling_price}
                          style={{ width: "80px" }}
                          onChange={(e) =>
                            setEditedSellingPrice(e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button className="button">edit</button>
                      </td>
                      <td style={{ textAlign: "center", padding: "0px 32px" }}>
                        <button
                          className="button"
                          onClick={(e) =>
                            editProductData(
                              e,
                              item.product_id,
                              editedName,
                              editedGst,
                              editedSellingPrice
                            )
                          }
                        >
                          save
                        </button>
                      </td>
                      <td style={{ textAlign: "center", padding: "0px 32px" }}>
                        <Link to={`/printBC?bc=${item.barCode}`}>Print</Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </form>
      );
    }
  };
  return (
    <div>
      <div className="listing-container-ash">
        <div>
          <label
            style={{
              fontWeight: "900",
            }}
          >
            <input
              type="radio"
              value="addProduct"
              checked={selectedOptionForm === "addProduct"}
              onChange={handleOptionChange}
            />
            Add Product
          </label>
          <label
            style={{
              fontWeight: "900",
            }}
          >
            <input
              type="radio"
              value="showProducts"
              checked={selectedOptionForm === "showProducts"}
              onChange={handleOptionChange}
            />
            Show products list
          </label>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
