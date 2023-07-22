import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

function Inputs() {
  const [selectedOptionForm, setSelectedOptionForm] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [pin, setPIN] = useState("");
  const [phone, setPhone] = useState("");
  const [empName, setEmployeeName] = useState("");
  const [bankName, setBankName] = useState("");
  const [loanName, setLoanName] = useState("");
  const [salary, setSalary] = useState("");
  const [loanType, setLoanType] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [monthlyInstallment, setmonthlyInstallment] = useState("");
  const [rent, setRent] = useState("");
  const [rentName, setRentName] = useState("");
  const [withdrawnODAmount, setODWithdrawnAmount] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState("");
  const [zipCode, setCompanyZipCode] = useState("");
  const [capital, setCapital] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  // const [gstNumber, setGstNumber] =useState(companyData && companyData.gstNumber ? companyData.gstNumber : gstNumber);
  const [furniture, setFurniture] = useState("");
  const [machinery, setMachinery] = useState("");
  const [land, setLand] = useState("");
  const [building, setBuilding] = useState("");
  const [equipments, setEquipments] = useState("");
  const [motorVehicles, setMotorVehicles] = useState("");
  const [investments, setInvestments] = useState("");
  const [bankDeposits, setBankDeposits] = useState("");
  const [selectedGstClass, setSelectedGstClass] = useState("");
  const [gstClass, setGstClass] = useState([
    "Normal",
    "Composition",
    "Another",
    "SomeOther",
  ]);
  const [assetData, setAssetData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  useEffect(() => {
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
        const assetResponse = await axios.get(
          `https://bisbuddy.online:8080/api/erp/assets/${userName}`,
          config
        );
        setAssetData(assetResponse.data);
        const companyResponse = await axios.get(
          `https://bisbuddy.online:8080/api/erp/company/${userName}`,
          config
        );
        setCompanyData(companyResponse.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    // Check if token is expired on component mount
    // checkTokenExpiration();
  }, []);
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
  const handleOptionChange = (option) => {
    setSelectedOptionForm(option);
  };
  const handleCustomer = async (event) => {
    event.preventDefault();
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
    const customerDetail = {
      name: name,
      email: email,
      street: street,
      pin: pin,
      phoneNumber: phone,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/customer/add",
        customerDetail,
        config
      );
      if (response.status === 200) {
        // Display success message here
        alert("Created new customer");
      }
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  const handleEmployee = async (event) => {
    event.preventDefault();
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
    const empDetail = {
      name: empName,
      salary: salary,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/employee/add",
        empDetail,
        config
      );
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };

  const handleLoan = async (event) => {
    event.preventDefault();
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
    const loanDetail = {
      interestRate: interestRate,
      loanName: loanName,
      totalAmount: totalAmount,
      loanTermMonths: loanDuration,
      bankName: bankName,
      loanType: loanType,
      monthlyPayment: monthlyInstallment,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/loan/add",
        loanDetail,
        config
      );
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  const handleRent = async (event) => {
    event.preventDefault();
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
    const rentDetail = {
      rentAmount: rent,
      rentName: rentName,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/rent/add",
        rentDetail,
        config
      );
      console.log(response);
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  const handleOD = async (event) => {
    event.preventDefault();
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
    const odDetail = {
      date: "",
      withdrawnAmount: withdrawnODAmount,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/OD/add",
        odDetail,
        config
      );
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  const handleGstClassChange = (event) => {
    setSelectedGstClass(event.target.value);
  };
  const handleCompanyInfo = async (event) => {
    event.preventDefault();
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
    const companyDetail = {
      companyName: companyName,
      companyAddress:companyAddress,
      zipCode:zipCode,
      companyPhoneNumber: companyPhoneNumber,
      gstNumber: gstNumber,
      gstClass: selectedGstClass,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/company/save",
        companyDetail,
        config
      );
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  const handleAsset = async (event) => {
    event.preventDefault();
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
    const assetDetail = {
      capital: capital,
      furniture: furniture,
      machinery: machinery,
      land: land,
      building: building,
      equipments: equipments,
      motorVehicles: motorVehicles,
      bankDeposits: bankDeposits,
      investments: investments,
      userName: userName,
    };
    try {
      const response = await axios.post(
        "https://bisbuddy.online:8080/api/erp/asset/save",
        assetDetail,
        config
      );
      console.log("asset response: ", response);
      // do something with response
    } catch (error) {
      console.error(error);
      // handle error
    }
  };
  const handleEditedValue = async (e, colName, value) => {
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
        `https://bisbuddy.online:8080/api/erp/asset/edit/${colName}/${value}/${userName}`,
        null,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleCompanyEdit = async (e, colName, name, address, zip, phone_Number, gst_Number) => {
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
        `https://bisbuddy.online:8080/api/erp/company/edit/${colName}/${userName}?name=${name}&address=${address}&zip=${zip}&phone=${phone_Number}&gstN=${gst_Number}`,
        null,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  const renderForm = () => {
    if (selectedOptionForm === "customer") {
      return (
        <form onSubmit={handleCustomer}>
          <div className="listing-container">
            <div>
              <label>Enter name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <label>Enter email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <label>Enter street:</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <br />
              <label>Enter PIN:</label>
              <input
                type="number"
                value={pin}
                onChange={(e) => setPIN(e.target.value)}
              />
              <br />
              <label>Enter phone number:</label>
              <input
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <br />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "employee") {
      return (
        <form onSubmit={handleEmployee}>
          <div className="listing-container">
            <div>
              <label>Enter Employee Name:</label>
              <input
                type="text"
                value={empName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
              <br />
              <label>Enter Employee Salary:</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
              <br />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "loan") {
      return (
        <form onSubmit={handleLoan}>
          <div className="listing-container">
            <div>
              <label>Enter Loan Intention:</label>
              <input
                type="text"
                value={loanName}
                onChange={(e) => setLoanName(e.target.value)}
              />
              <br />
              <label>Enter Bank Name:</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <br />
              <label>Enter loan type:</label>
              <input
                type="text"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
              />
              <br />
              <label>Enter interest rate:</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
              <br />
              <label>Enter total amount:</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
              <br />
              <label>Enter Loan duration:</label>
              <input
                type="number"
                value={loanDuration}
                onChange={(e) => setLoanDuration(e.target.value)}
              />
              <br />
              <label>Enter monthly installment:</label>
              <input
                type="number"
                value={monthlyInstallment}
                onChange={(e) => setmonthlyInstallment(e.target.value)}
              />
              <br />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "rent") {
      return (
        <form onSubmit={handleRent}>
          <div className="listing-container">
            <div>
              <label>Enter Rent detail:</label>
              <input
                type="text"
                value={rentName}
                onChange={(e) => setRentName(e.target.value)}
              />
              <br />
              <label>Enter Rent amount:</label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
              />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "overDraft") {
      return (
        <form onSubmit={handleOD}>
          <div className="listing-container">
            <div>
              <label>Enter total OD withdrawn amount:</label>
              <input
                type="number"
                value={withdrawnODAmount}
                onChange={(e) => setODWithdrawnAmount(e.target.value)}
              />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "company") {
      return (
        <form>
          <h3>Enter company details</h3>
          <div className="listing-container">
            <div>
              <label>Enter company name:</label>
              <input
                type="text"
                name="companyName"
                defaultValue={
                  companyData ? companyData.companyName : companyName
                }
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {companyData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleCompanyEdit(e, "companyName", companyName, "", 0, 0, 0)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter company Address:</label>
              <input
                type="text"
                name="companyAddress"
                defaultValue={
                  companyData ? companyData.companyAddress : companyAddress
                }
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
              {companyData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleCompanyEdit(e, "companyAddress", "", companyAddress, 0, 0, 0)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter pin code:</label>
              <input
                type="text"
                name="zipCode"
                defaultValue={
                  companyData ? companyData.zipCode : zipCode
                }
                onChange={(e) => setCompanyZipCode(e.target.value)}
              />
              {companyData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleCompanyEdit(e, "zipCode", "", "", zipCode, 0, 0)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter company phoneNumber:</label>
              <input
                type="text"
                name="companyPhoneNumber"
                defaultValue={
                  companyData ? companyData.companyPhoneNumber : companyPhoneNumber
                }
                onChange={(e) => setCompanyPhoneNumber(e.target.value)}
              />
              {companyData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleCompanyEdit(e, "companyPhoneNumber", "", "",0,companyPhoneNumber, 0)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter GST number:</label>
              <input
                type="number"
                name="gstNumber"
                defaultValue={companyData ? companyData.gstNumber : gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
              {companyData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleCompanyEdit(e, "gstNumber", "", "",0,0,gstNumber)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter GST class: </label>
              {/* how to display the selected gst class as default */}
              <select value={selectedGstClass} onChange={handleGstClassChange}>
                {gstClass.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <br />
            </div>
            {!companyData && (
              <button className="button" onClick={handleCompanyInfo}>
                Submit
              </button>
            )}
          </div>
        </form>
      );
    } else if (selectedOptionForm === "AssetDetails") {
      return (
        <form>
          <h3>Edit with new data for each year</h3>
          <div className="listing-container">
            <div>
              <label>Enter capital you have:</label>
              <input
                type="number"
                name="capital"
                defaultValue={assetData ? assetData.capital : capital}
                onChange={(e) => setCapital(e.target.value)}
              />
              <br />
              <label>Enter value of furniture you have:</label>
              <input
                type="number"
                name="furniture"
                defaultValue={assetData ? assetData.furniture : furniture}
                onChange={(e) => setFurniture(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) => handleEditedValue(e, "furniture", furniture)}
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter value of machinery you have:</label>
              <input
                type="number"
                name="machinery"
                defaultValue={assetData ? assetData.machinery : machinery}
                onChange={(e) => setMachinery(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) => handleEditedValue(e, "machinery", machinery)}
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter value of land you have:</label>
              <input
                type="number"
                name="land"
                defaultValue={assetData ? assetData.land : land}
                onChange={(e) => setLand(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) => handleEditedValue(e, "land", land)}
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter value of buildings you have:</label>
              <input
                type="number"
                name="building"
                defaultValue={assetData ? assetData.building : building}
                onChange={(e) => setBuilding(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) => handleEditedValue(e, "building", building)}
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter value of equipments you have:</label>
              <input
                type="number"
                name="equipments"
                defaultValue={assetData ? assetData.equipments : equipments}
                onChange={(e) => setEquipments(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleEditedValue(e, "equipments", equipments)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter value of vehicles you have:</label>
              <input
                type="number"
                name="motorVehicles"
                defaultValue={
                  assetData ? assetData.motorVehicles : motorVehicles
                }
                onChange={(e) => setMotorVehicles(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleEditedValue(e, "motorVehicles", motorVehicles)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter totat deposits you have:</label>
              <input
                type="number"
                name="bankDeposits"
                defaultValue={assetData ? assetData.bankDeposits : bankDeposits}
                onChange={(e) => setBankDeposits(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleEditedValue(e, "bankDeposits", bankDeposits)
                  }
                >
                  edit
                </button>
              )}
              <br />
              <label>Enter totat investments you have:</label>
              <input
                type="number"
                name="investments"
                defaultValue={assetData ? assetData.investments : investments}
                onChange={(e) => setInvestments(e.target.value)}
              />
              {assetData && (
                <button
                  className="button"
                  onClick={(e) =>
                    handleEditedValue(e, "investments", investments)
                  }
                >
                  edit
                </button>
              )}
              <br />
            </div>
            {!assetData && (
              <button className="button" onClick={handleAsset}>
                Submit
              </button>
            )}
          </div>
        </form>
      );
    }
  };

  return (
    <div className="listing-container-ash">
      <h1>Input Basic Details</h1>
      <div className="row">
        <div className="col-sm-3">
          <div className="btn-group-vertical">
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "customer" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "customer" ? "black" : "",
              }}
              onClick={() => handleOptionChange("customer")}
            >
              Customer data entry
            </button>

            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "employee" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "employee" ? "black" : "",
              }}
              onClick={() => handleOptionChange("employee")}
            >
              Employee data entry
            </button>

            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "loan" && "active"
              }`}
              style={{
                backgroundColor: selectedOptionForm === "loan" ? "black" : "",
              }}
              onClick={() => handleOptionChange("loan")}
            >
              Loan data entry
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "rent" && "active"
              }`}
              style={{
                backgroundColor: selectedOptionForm === "rent" ? "black" : "",
              }}
              onClick={() => handleOptionChange("rent")}
            >
              Rent data entry
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "overDraft" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "overDraft" ? "black" : "",
              }}
              onClick={() => handleOptionChange("overDraft")}
            >
              Enter OD withdrawn amount
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "company" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "company" ? "black" : "",
              }}
              onClick={() => handleOptionChange("company")}
            >
              Enter company details
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "AssetDetails" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "AssetDetails" ? "black" : "",
              }}
              onClick={() => handleOptionChange("AssetDetails")}
            >
              Asset details
            </button>
          </div>
        </div>
        <div className="col-sm-9">{renderForm()}</div>
      </div>
    </div>
  );
}
export default Inputs;
