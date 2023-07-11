import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
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
          `http://localhost:8080/api/erp/sales/graphAll/${userName}`,
          config
        );
        const productsResponse = await axios.get(
          `http://localhost:8080/api/erp/product/getAll/${userName}`,
          config
        );
        setProducts(productsResponse.data);
        setSalesData(response.data);
        createChart(response.data);
      } catch (error) {
        console.log(error);
      }
    };

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
      // i want to display months like january, february, march, april till december on
      //    the x-axis. So i want the quantity on the y-axis and the months listed on the 
      //  x-axis.  i have responseByProduct data in this format ie [quantity, month, year] ->[5465465, 1, 2023],[546756, 5, 2023],[546546, 7, 2023]. Right now 
      //  its not being mapped correctly. I want the quantity to be displayed corresponding to the correct month. 
      // For example, for this [546546, 7, 2023] -- quantity 546546 should mapped to july which is the 7th month. 
      // Do that for every quantity and month.
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
        `http://localhost:8080/api/erp/sales/graphByProduct/${selectedProductId}/${userName}`,
        config
      );
      updateChart(responseByProduct.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="listing-container">
      <div className="chart-container">
        <div>
          <label>
            Select Product:
            <select value={selectedProductId} onChange={handleProductIdChange}>
              <option value="">Product</option>
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
        <canvas id="myChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
}
