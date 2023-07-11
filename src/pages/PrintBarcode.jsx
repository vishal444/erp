import React, { useEffect } from "react";
import Barcode from "react-barcode";
import { useLocation } from "react-router-dom";

const PrintBarcode = (props) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const barcode = searchParams.get("bc");

  useEffect(() => {
    // Add a print media query style to hide headers, footers, and the button
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: auto;  /* Use auto for standard size */
          margin: 0mm; /* Set margins to 0 */
        }
        
        /* Hide headers and footers */
        @page :left {
          margin-left: 0;
          margin-right: 0;
        }

        @page :right {
          margin-left: 0;
          margin-right: 0;
        }

        @page :first {
          margin-top: 0;
        }
        
        body * {
          visibility: hidden;
        }
        
        #barcode, #barcode * {
          visibility: visible;
        }

        #print-button {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div id="barcode" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Barcode value={barcode} />
      <button id="print-button" onClick={window.print} className='button'  style={{fontWeight: "900"}}>Print</button>
    </div>
  );
};

export default PrintBarcode;
