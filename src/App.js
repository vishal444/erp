import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Forecast from "../src/pages/Forecast";
import Sales from "../src/pages/Sales";
import ExcelUploader from "./pages/ExcelUploader";
import Inventory from "./pages/Inventory";
import Product from "./pages/Product";
import Tabs from "./pages/Tabs";
import Purchase from "./pages/Purchase";
import LoginAndRegister from "./pages/LoginAndRegister";
import MassInput from "./pages/MassInput";
import Expenses from "./pages/Expenses";
import Inputs from "./pages/Inputs";
import PrintBarcode from "./pages/PrintBarcode";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginAndRegister />} />
          <Route exact path="/tabs" element={<Tabs />} />
          <Route exact path="/sales" element={<Sales />} />
          <Route exact path="/forecast" element={<Forecast />} />
          <Route exact path="/expenses" element={<Expenses />} />
          <Route exact path="/excelUpload" element={<ExcelUploader />} />
          <Route exact path="/inventory" element={<Inventory />} />
          <Route exact path="/product" element={<Product />} />
          <Route exact path="/purchase" element={<Purchase />} />
          <Route exact path="/inputs" element={<Inputs />} />
          <Route exact path="/massInput" element={<MassInput />} />
          <Route exact path='/printBC' element={<PrintBarcode/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
