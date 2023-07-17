import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showAllGraph, setShowAllGraph] = useState(true);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const fetchData = async () => {
    const userName = localStorage.getItem("email");
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://65.0.184.31:8080/api/erp/sales/graphAll/${userName}`,
        config
      );
      const productsResponse = await axios.get(
        `http://65.0.184.31:8080/api/erp/product/getAll/${userName}`,
        config
      );
      setProducts(productsResponse.data);
      setSalesData(response.data);
      createChart(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createChart = (data) => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    const labels = data.map((item) => item[0]);
    const quantities = data.map((item) => item[1]);
    const newChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Quantity",
            data: quantities,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    chartInstanceRef.current = newChartInstance;
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  const updateChart = (data) => {
    if (chartInstanceRef.current) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      
      const chartData = Array(12).fill(0); // Initialize an array of length 12 with zeros
      
      data.forEach((item) => {
        const monthIndex = item[1] - 1;
        chartData[monthIndex] += item[0];
      });
      
      chartInstanceRef.current.data.labels = monthNames;
      chartInstanceRef.current.data.datasets[0].data = chartData;
      chartInstanceRef.current.update();
    }
  };

  const handleProductIdChange = (e) => {
    setSelectedProductId(e.target.value);
  };

  const showSaleData = async (e) => {
    e.preventDefault();
    const userName = localStorage.getItem("email");
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const responseByProduct = await axios.get(
        `http://65.0.184.31:8080/api/erp/sales/graphByProduct/${selectedProductId}/${userName}`,
        config
      );
      updateChart(responseByProduct.data);
      setShowAllGraph(false);
    } catch (error) {
      console.log(error);
    }
  };

  const showAllProductsGraph = async () => {
    fetchData();
    setShowAllGraph(true);
  };
// THINGS TO REMEMBER
// In the updateChart function, you mentioned that the responseByProduct 
// data has the format [quantity, month, year]. However, in the code, you 
// are accessing the quantity using item[0] and the month using item[1]. If 
// the data format is [quantity, month, year], you should update the code 
// to item[0] for the quantity and item[1] for the month.
  return (
    <div className="listing-container">
      <div className="chart-container">
        {showAllGraph ? (
          <div>
            <label>
              Select Product:
              <select value={selectedProductId} onChange={handleProductIdChange}>
                {/* <option value=""></option> */}
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="button" onClick={showSaleData}>
              Show graph
            </button>
          </div>
        ) : (
          <button className="button" onClick={showAllProductsGraph}>
            Back to All Products Graph
          </button>
        )}
        <canvas id="myChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
