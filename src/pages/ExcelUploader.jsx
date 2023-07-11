import React, { useState } from "react";
import axios from "axios";
import { read, utils } from "xlsx";
import dayjs from "dayjs";

export default function ExcelUploader() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const workbook = read(reader.result, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(worksheet);
      const jsonData = data.map((row) => {
        // Parse the date using dayjs
        const date = dayjs(row["Value Dt"], "DD/MM/YY", true).isValid()
          ? dayjs(row["Value Dt"], "DD/MM/YY").format("YYYY-MM-DD")
          : null;

        return {
          description: row["Narration"],
          date: date,
          debit: row["Withdrawal Amt."] || 0,
          credit: row["Deposit Amt."] || 0,
          balance: row["Closing Balance"] || 0,
        };
      });
      setJsonData(jsonData);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      };
      try {
        const response = await axios
          .post("http://localhost:8080/api/erp/accountData", jsonData);
      } catch (error) {
        console.error(error);
      }
    };

    reader.onerror = (error) => {
      console.error(error);
    };

    reader.readAsBinaryString(file);
  };
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button>Upload</button>
    </div>
  );
}
