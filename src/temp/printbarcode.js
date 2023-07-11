// const printProductBarcode = (e, id) => {
    // e.preventDefault();
    // let selectedBarCode;
    // const selectedId = id;
    // productData.forEach((product) => {
    //   if (product.product_id === selectedId) {
    //     selectedBarCode = product.barCode;
    //   }
    // });
    // console.log(selectedBarCode);

    // Create an iframe element
  //   const iframe = document.createElement("iframe");
  //   iframe.style.display = "none";

  //   // Create the HTML content for displaying the barcode
  //   const barcodeHtml = `
  //   <html>
  // <head>
  //   <style>
  //     @media print {
  //       body {
  //         margin: 0;
  //       }
  //       .barcode-container {
  //         text-align: center;
  //         padding-top: 20mm; /* Adjust the value to your desired padding */
  //       }
  //       @page {
  //         size: auto;
  //         margin: 0;
  //       }
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div class="barcode-container">
  //   <img src="https://barcode.tec-it.com/barcode.ashx?data=${selectedBarCode}&code=EAN13" alt="Barcode" />
  //   </div>
  // </body>
  // </html>
  //   `;

  //   document.body.appendChild(iframe);
  //   // Set the content of the iframe
  //   iframe.contentDocument.write(barcodeHtml);
  //   // Print the iframe content
  //   iframe.contentWindow.print();
  // };





//////////////////////////




    {/* {showPrintBarcode ? (
        <form id="barcode">
          <div>
            {showPrintBarcode && <PrintBarcode barcode={selectedBarCode} />}
          </div>
        </form>
      ) : (
        renderForm()
      )} */}