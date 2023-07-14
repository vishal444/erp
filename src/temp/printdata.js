// for printing invoice
const generateInvoice = () => {
    // Create the invoice HTML template
    // create a new iframe
    const invoiceTemplate = `
   <html>
   <head>
    <style>
      /* Styles for the invoice layout */
      @page {
        size: 8.5in 11in;
        margin: 0.5in;
      }
      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
      }
      .logo {
        width: 150px;
      }
      .company-info {
        max-width: 50%;
      }
      .company-info h3 {
        margin: 0 0 10px;
      }
      .company-info p {
        margin: 0;
      }
      .invoice-info {
        text-align: right;
      }
      .invoice-info h1 {
        margin: 0 0 5px;
        font-size: 24px;
      }
      .invoice-info p {
        margin: 0;
      }
      table {
        margin: 0 auto;
      }
      .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 14px;
        color: #999;
      }
    </style>
   </head>
   <body>
    <header class="header">
      <img class="logo" src="" alt="Your Company Logo">
      <div class="company-info">
        <h3>Your Company Name</h3>
        <p>Your Company Address</p>
        <p>Your Company City, State Zip</p>
        <p>Your Company Phone Number</p>
      </div>
      <div class="invoice-info">
        <h1>INVOICE</h1>
        <p>Invoice Number: #</p>
        <p>Invoice Date: </p>
      </div>
    </header>
    <main>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${arrayForPrint
            .map(
              (item) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.productDescription}</td>
              <td>${item.productQuantity}</td>
              <td>${item.productPrice}</td>
              <td>${item.total}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <div class="totals">
        <p>Subtotal:</p>
        <p>GST: </p>
        <p>Shipping: </p>
        <h2>Total: ${actualSaleAmount}</h2>
      </div>
    </main>
    <footer class="footer">
      <p>Thank you for your business!</p>
      <p>Invoice generated by Your Company Name</p>
    </footer>
   </body>
   </html>
   `;
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    // set the content of the iframe
    iframe.contentDocument.write(invoiceTemplate);
    // print the iframe content
    iframe.contentWindow.print();
  };

  //////////////////////
  const generateInvoice = () => {
    const invoiceTemplate = `
      <!-- Invoice HTML template -->
      <!-- ... -->
    `;
  
    // Print the invoice using Print.js
    printJS({
      printable: invoiceTemplate,
      type: 'raw-html',
      style: `
        @page {
          size: 80mm 297mm; /* Adjust the paper size for your thermal printer */
        }
        /* Additional styles for thermal printer */
        /* Adjust font size, line spacing, and layout as needed */
        body {
          font-size: 12px;
          line-height: 1.2;
          margin: 10px;
        }
        /* ... */
      `,
    });
  };
  