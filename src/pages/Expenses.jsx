import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

function Expenses() {
  const [selectedOptionForm, setSelectedOptionForm] = useState("salary");
  const [employees, setEmployees] = useState([]);
  const [currentYear, setCurrentYear] = useState("");
  const [salary, setSalary] = useState("");
  const [rents, setRent] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paidLoan, setPaidLoan] = useState("");
  const [paidRent, setPaidRent] = useState("");
  const [selectedRentId, setSelectedRentId] = useState("");
  const [selectedRent, setSelectedRent] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [powerCharge, setPowerCharge] = useState("");
  const [internetCharge, setInternetCharge] = useState("");
  const [insuranceExpense, setInsuranceExpense] = useState("");
  const [taxExpense, setTaxExpense] = useState("");
  const [travellingExpense, setTravellingExpense] = useState("");
  const [cookingGasExpense, setCookingGasExpense] = useState("");
  const [auditExpense, setAuditExpense] = useState("");
  const [repairAndMaintenanceExpense, setRepairAndMaintenanceExpense] =
    useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [damageOfStockExpense, setDamageOfStockExpense] = useState("");
  const [badDebtWrittenOff, setBadDebtWrittenOff] = useState("");
  const [odPayment, setODPayment] = useState("");
  const [capitalDrawings, setCapitalDrawings] = useState("");
  const [miscellaneousExpenses, setMiscellaneousExpenses] = useState("");
  const [lossSaleFixedAsset, setLossSaleFixedAsset] = useState("");
  const [interestIncome, setInterestIncome] = useState("");
  const [rentReceived, setRentReceived] = useState("");
  const [discountReceived, setDiscountReceived] = useState("");
  const [badDebtsRecovered, setBadDebtsRecovered] = useState("");
  const [profitSaleFixedAsset, setProfitSaleFixedAsset] = useState("");
  const [miscellaneousIncomes, setMiscellaneousIncomes] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedMonthValid, setSelectedMonthValid] = useState(false);
  const [months, setMonths] = useState([
    "",
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPETEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]);

  const handleOptionChange = (option) => {
    setSelectedOptionForm(option);
  };
  useEffect(() => {
    const currentDate = new Date();
    // const currentMonth = currentDate.getMonth() + 1; // Adding 1 to adjust for 0-based index
    setCurrentYear(currentDate.getFullYear());
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    // Set up the Axios config object with the Authorization header and data object
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // fetch the list of employees and set the state
    axios
      .get(`https://43.204.30.111:8080/api/erp/employees/${userName}`, config)
      .then((response) => {
        setEmployees(response.data);
        // console.log("data :",response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // fetch the list of loan and set the state
    axios
      .get(`https://43.204.30.111:8080/api/erp/loans/${userName}`, config)
      .then((response) => {
        setLoans(response.data);
        // console.log("data :",response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // fetch the list of employees and set the state
    axios
      .get(`https://43.204.30.111:8080/api/erp/rent/${userName}`, config)
      .then((response) => {
        setRent(response.data);
        // console.log("data :",response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
  const handleMonthChange = (event) => {
    event.preventDefault();
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
    setSelectedMonthValid(selectedMonth !== ""); // Check if a month is selected
  };

  const handleEmployeeChange = async (event) => {
    event.preventDefault();
    const selectedEmployeeIdTemp = event.target.value;
    setSelectedEmployeeId(selectedEmployeeIdTemp);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `https://43.204.30.111:8080/api/erp/employeeById/${selectedEmployeeIdTemp}`,
        config
      );
      setSelectedEmployee(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoanChange = async (event) => {
    event.preventDefault();
    const selectedLoanIdTemp = event.target.value;
    setSelectedLoanId(selectedLoanIdTemp);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `https://43.204.30.111:8080/api/erp/loanById/${selectedLoanIdTemp}`,
        config
      );
      setSelectedLoan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRentChange = async (event) => {
    event.preventDefault();
    const selectedRentIdTemp = event.target.value;
    setSelectedRentId(selectedRentIdTemp);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `https://43.204.30.111:8080/api/erp/rentById/${selectedRentIdTemp}`,
        config
      );
      console.log("rent data:", response);
      setSelectedRent(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSalary = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    if (!selectedMonthValid) {
      // Month not selected, display an error or take appropriate action
      alert("Please select a month.");
      return;
    }

    // Set up the Axios config object with the Authorization header and data object
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    var salaryExtra = 0;
    if (salary > selectedEmployee.salary) {
      salaryExtra = salary - selectedEmployee.salary;
    }
    const data = {
      date: "",
      salaryReceived: salary,
      monthList: selectedMonth,
      salaryExtra: salaryExtra,
      salaryOutstanding: selectedEmployee.salary - salary,
      userName: userName,
      employee: {
        id: selectedEmployeeId,
      },
    };
    await axios
      .post(
        "https://43.204.30.111:8080/api/erp/salaryPayment/save",
        data,
        configForPut
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleLoan = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    if (!selectedMonthValid) {
      // Month not selected, display an error or take appropriate action
      alert("Please select a month.");
      return;
    }

    // Set up the Axios config object with the Authorization header and data object
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    var loanExtra = 0;
    if (paidLoan > selectedLoan.monthlyPayment) {
      loanExtra = paidLoan - selectedLoan.monthlyPayment;
    }
    const dataForLoan = {
      paidInstallment: paidLoan,
      date: "",
      loanExtraPayment: loanExtra,
      monthList: selectedMonth,
      userName: userName,
      loanOutstanding: selectedLoan.monthlyPayment - paidLoan,
      loan: {
        id: selectedLoanId,
      },
    };
    await axios
      .post(
        "https://43.204.30.111:8080/api/erp/loanPayment/save",
        dataForLoan,
        configForPut
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleRent = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    if (!selectedMonthValid) {
      // Month not selected, display an error or take appropriate action
      alert("Please select a month.");
      return;
    }

    // Set up the Axios config object with the Authorization header and data object
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    var rentExtra = 0;
    if (paidRent > selectedRent.rentAmount) {
      rentExtra = paidRent - selectedRent.rentAmount;
    }
    const dataForRent = {
      paidRent: paidRent,
      monthList: selectedMonth,
      year: currentYear,
      rentExtra: rentExtra,
      userName: userName,
      rentOutstanding: selectedRent.rentAmount - paidRent,
      rent: {
        id: selectedRentId,
      },
    };
    // create a new salary record with the selected employee id, salary and month
    await axios
      .post(
        "https://43.204.30.111:8080/api/erp/rentPayment/save",
        dataForRent,
        configForPut
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOtherExpenses = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    if (!selectedMonthValid) {
      // Month not selected, display an error or take appropriate action
      alert("Please select a month.");
      return;
    }

    // Set up the Axios config object with the Authorization header and data object
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const dataForOtherExpenses = {
      electricity: powerCharge,
      internet: internetCharge,
      insurance: insuranceExpense,
      taxes: taxExpense,
      transport: travellingExpense,
      cookingGas: cookingGasExpense,
      audit: auditExpense,
      repairAndMaintenance: repairAndMaintenanceExpense,
      deliveryCharges: deliveryCharges,
      damageOfStock: damageOfStockExpense,
      lossSaleFixedAsset: lossSaleFixedAsset,
      badDebtWrittenOff: badDebtWrittenOff,
      capitalDrawings: capitalDrawings, /// in separate
      miscellaneousExpenses: miscellaneousExpenses,
      interestIncomeLent: interestIncome,
      rentReceived: rentReceived,
      discountReceived: discountReceived,
      badDebtsRecovered: badDebtsRecovered,
      profitSaleFixedAsset: profitSaleFixedAsset,
      miscellaneousIncomes: miscellaneousIncomes,
      monthList: selectedMonth,
      userName: userName,
      year: currentYear,
    };
    await axios
      .post(
        "https://43.204.30.111:8080/api/erp/monthlyIncomeExpense/save",
        dataForOtherExpenses,
        configForPut
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleOD = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    if (!selectedMonthValid) {
      // Month not selected, display an error or take appropriate action
      alert("Please select a month.");
      return;
    }

    // Set up the Axios config object with the Authorization header and data object
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const dataForOD = {
      date: "",
      monthList: selectedMonth,
      userName: userName,
      odRepaid: odPayment,
    };
    // create a new salary record with the selected employee id, salary and month
    await axios
      .post(
        "https://43.204.30.111:8080/api/erp/overDraftPayment/save",
        dataForOD,
        configForPut
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCapitalDraw = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");

    if (!selectedMonthValid) {
      // Month not selected, display an error or take appropriate action
      alert("Please select a month.");
      return;
    }
    // Set up the Axios config object with the Authorization header and data object
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .put(
        `https://43.204.30.111:8080/api/erp/capitalDraw/${capitalDrawings}/${userName}`,
        configForPut
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleTAC = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `https://43.204.30.111:8080/api/erp/tAC/generate/${currentYear}`,
        null,
        configForPut
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePandL = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `https://43.204.30.111:8080/api/erp/pAndL/generate/${currentYear}`,
        null,
        configForPut
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleBalanceSheet = async (event) => {
    event.preventDefault();
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("email");
    const configForPut = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.put(
        `https://43.204.30.111:8080/api/erp/balanceSheet/generate/${currentYear}`,
        null,
        configForPut
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const renderForm = () => {
    if (selectedOptionForm === "salary") {
      return (
        <form onSubmit={handleSalary}>
          <div className="listing-container">
            <div>
              <select onChange={handleEmployeeChange}>
                <option value="">Select an employee</option>
                {employees &&
                  employees.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              <br />
              <label>Enter Salary paid:</label>
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
              <select onChange={handleLoanChange}>
                <option value="">Select a loan</option>
                {loans &&
                  loans.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.loanName}
                    </option>
                  ))}
              </select>
              <br />
              <label>Paid loan amount:</label>
              <input
                type="number"
                value={paidLoan}
                onChange={(e) => setPaidLoan(e.target.value)}
              />
              <br />
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
              <label>Enter OD payment:</label>
              <input
                type="number"
                value={odPayment}
                onChange={(e) => setODPayment(e.target.value)}
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
              <select onChange={handleRentChange}>
                <option value="">Select a rent</option>
                {rents.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.rentName}
                  </option>
                ))}
              </select>
              <br />
              <label>Paid loan amount:</label>
              <input
                type="number"
                value={paidRent}
                onChange={(e) => setPaidRent(e.target.value)}
              />
              <br />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "capitalDraw") {
      return (
        <form onSubmit={handleCapitalDraw}>
          <div className="listing-container">
            <div>
              <label>Enter captial drawn:</label>
              <input
                type="number"
                value={capitalDrawings}
                onChange={(e) => setCapitalDrawings(e.target.value)}
              />
              <br />
            </div>
            <button className="button">Submit</button>
          </div>
        </form>
      );
    } else if (selectedOptionForm === "incomesAndExpenses") {
      return (
        <form onSubmit={handleOtherExpenses}>
          <div className="listing-container">
            <div>
              <p>////////////////////// EXPENSES ////////////////////////</p>
              <label>Enter electricity expense:</label>
              <input
                type="number"
                value={powerCharge}
                onChange={(e) => setPowerCharge(e.target.value)}
              />
              <br />
              <label>Enter internet expense:</label>
              <input
                type="number"
                value={internetCharge}
                onChange={(e) => setInternetCharge(e.target.value)}
              />
              <br />
              <label>Enter insurance expense:</label>
              <input
                type="number"
                value={insuranceExpense}
                onChange={(e) => setInsuranceExpense(e.target.value)}
              />
              <br />
              <label>Enter taxes expense:</label>
              <input
                type="number"
                value={taxExpense}
                onChange={(e) => setTaxExpense(e.target.value)}
              />
              <br />
              <label>Enter travelling expense:</label>
              <input
                type="number"
                value={travellingExpense}
                onChange={(e) => setTravellingExpense(e.target.value)}
              />
              <br />
              <label>Enter cooking gas expense:</label>
              <input
                type="number"
                value={cookingGasExpense}
                onChange={(e) => setCookingGasExpense(e.target.value)}
              />
              <br />
              <label>Enter audit expense:</label>
              <input
                type="number"
                value={auditExpense}
                onChange={(e) => setAuditExpense(e.target.value)}
              />
              <br />
              <label>Enter repair and maintenance expense:</label>
              <input
                type="number"
                value={repairAndMaintenanceExpense}
                onChange={(e) => setRepairAndMaintenanceExpense(e.target.value)}
              />
              <br />
              <label>Enter delivery charges:</label>
              <input
                type="number"
                value={deliveryCharges}
                onChange={(e) => setDeliveryCharges(e.target.value)}
              />
              <br />
              <label>Enter damage of stock expense:</label>
              <input
                type="number"
                value={damageOfStockExpense}
                onChange={(e) => setDamageOfStockExpense(e.target.value)}
              />
              <br />
              <label>Enter loss on sale of fixed asset:</label>
              <input
                type="number"
                value={lossSaleFixedAsset}
                onChange={(e) => setLossSaleFixedAsset(e.target.value)}
              />
              <br />
              <label>Enter debts written off:</label>
              <input
                type="number"
                value={badDebtWrittenOff}
                onChange={(e) => setBadDebtWrittenOff(e.target.value)}
              />
              <br />
              <label>Enter other expense:</label>
              <input
                type="number"
                value={miscellaneousExpenses}
                onChange={(e) => setMiscellaneousExpenses(e.target.value)}
              />
              <br />
              <p>///////////////////// INCOME ////////////////////////</p>
              <label>Enter interest incomes:</label>
              <input
                type="number"
                value={interestIncome}
                onChange={(e) => setInterestIncome(e.target.value)}
              />
              <br />
              <label>Enter rents received:</label>
              <input
                type="number"
                value={rentReceived}
                onChange={(e) => setRentReceived(e.target.value)}
              />
              <br />
              <label>Enter discounts received:</label>
              <input
                type="number"
                value={discountReceived}
                onChange={(e) => setDiscountReceived(e.target.value)}
              />
              <br />
              <label>Enter debts recovered:</label>
              <input
                type="number"
                value={badDebtsRecovered}
                onChange={(e) => setBadDebtsRecovered(e.target.value)}
              />
              <br />
              <label>Enter profit on sale fixed asset:</label>
              <input
                type="number"
                value={profitSaleFixedAsset}
                onChange={(e) => setProfitSaleFixedAsset(e.target.value)}
              />
              <br />
              <label>Enter other miscellaneous incomes:</label>
              <input
                type="number"
                value={miscellaneousIncomes}
                onChange={(e) => setMiscellaneousIncomes(e.target.value)}
              />
              <br />
            </div>
            <button className="button">Submit</button>
            <br />
            <button onClick={handleTAC} className="button">
              {" "}
              Generate Trading Account{" "}
            </button>
            <br />
            <button onClick={handlePandL} className="button">
              {" "}
              Generate P&L{" "}
            </button>
            <br />
            <button onClick={handleBalanceSheet} className="button">
              {" "}
              Generate b sheet{" "}
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="listing-container-ash">
      <h1>Basic Expenses</h1>
      <div>
        <label>Select Month: </label>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        <div className="col-sm-3">
          <div className="btn-group-vertical">
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "salary" && "active"
              }`}
              style={{
                backgroundColor: selectedOptionForm === "salary" ? "black" : "",
              }}
              onClick={() => handleOptionChange("salary")}
            >
              Salary payment
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
              Loan payment
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
              Rent payment
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
              Over Draft payment
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "capitalDraw" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "capitalDraw" ? "black" : "",
              }}
              onClick={() => handleOptionChange("capitalDraw")}
            >
              Enter captial withdrawn
            </button>
            <button
              type="button"
              className={`btn btn-secondary ${
                selectedOptionForm === "incomesAndExpenses" && "active"
              }`}
              style={{
                backgroundColor:
                  selectedOptionForm === "incomesAndExpenses" ? "black" : "",
              }}
              onClick={() => handleOptionChange("incomesAndExpenses")}
            >
              Monthly payments and incomes
            </button>
          </div>
        </div>
        <div className="col-sm-9">{renderForm()}</div>
      </div>
    </div>
  );
}

export default Expenses;
