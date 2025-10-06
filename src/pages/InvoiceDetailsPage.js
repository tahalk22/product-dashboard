// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";  
// import { useReactToPrint } from "react-to-print";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const InvoiceDetailsPage = () => {
//   const { id } = useParams();
//   const [invoice, setInvoice] = useState(null);
//   const printRef = useRef();

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       const docRef = doc(db, "invoices", id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setInvoice(docSnap.data());
//       }
//     };
//     fetchInvoice();
//   }, [id]);

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//   });

//   const handlePDF = async () => {
//     const canvas = await html2canvas(printRef.current);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     pdf.addImage(imgData, "PNG", 10, 10);
//     pdf.save("invoice.pdf");
//   };

//   if (!invoice) return <p>جارٍ تحميل الفاتورة...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <div style={{ marginBottom: "20px" }}>
//         <button onClick={handlePrint}>🖨️ طباعة</button>
//         <button onClick={handlePDF} style={{ marginLeft: "10px" }}>📄 PDF</button>
//       </div>

//       <div ref={printRef} style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
//         <h2>🧾 فاتورة رقم {invoice.invoiceNumber}</h2>
//         <p><strong>التاريخ:</strong> {new Date(invoice.createdAt).toLocaleString()}</p>
//         <p><strong>العميل:</strong> {invoice.fullName}</p>
//         <p><strong>الهاتف:</strong> {invoice.phone}</p>
//         <p><strong>الهاتف  الواتساب:</strong>  {invoice.phone2}</p>
//         <p><strong>العنوان:</strong> {invoice.shippingAddress}</p>
//         <p><strong>طريقة الدفع:</strong> {invoice.paymentMethod}</p>

//         <h3>المنتجات:</h3>
//         <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>المنتج</th>
//               <th>السعر</th>
//               <th>الكمية</th>
//               <th>الإجمالي</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoice.invoiceDetails.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{item.name}</td>
//                 <td>{item.price} د.ل</td>
//                 <td>{item.quantity}</td>
//                 <td>{item.total} د.ل</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <h3>المجموع: {invoice.totalAmount} ر.س</h3>
//         {invoice.additionalNote && <p><strong>ملاحظة:</strong> {invoice.additionalNote}</p>}
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetailsPage;
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      const docRef = doc(db, "invoices", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInvoice(docSnap.data());
      }
    };
    fetchInvoice();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePDF = async () => {
    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("invoice.pdf");
  };

  // ✅ تنسيق التاريخ بشكل جميل: 25-05-2025
  const formatDate = (createdAt) => {
    if (!createdAt) return "";
    let date;
    if (createdAt.seconds) {
      date = new Date(createdAt.seconds * 1000);
    } else {
      date = new Date(createdAt);
    }
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!invoice) return <p>جارٍ تحميل الفاتورة...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handlePrint}>🖨️ طباعة</button>
        <button onClick={handlePDF} style={{ marginLeft: "10px" }}>📄 PDF</button>
      </div>

      <div ref={printRef} style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <h2>🧾 فاتورة رقم {invoice.invoiceNumber}</h2>
        <p><strong>التاريخ:</strong> {formatDate(invoice.createdAt)}</p>
        <p><strong>العميل:</strong> {invoice.fullName}</p>
        <p><strong>الهاتف:</strong> {invoice.phone}</p>
        <p><strong>الهاتف الواتساب:</strong> {invoice.phone2}</p>
        <p><strong>العنوان:</strong> {invoice.shippingAddress}</p>
        <p><strong>طريقة الدفع:</strong> {invoice.paymentMethod}</p>

        <h3>المنتجات:</h3>
        <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {invoice.invoiceDetails.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.price} د.ل</td>
                <td>{item.quantity}</td>
                <td>{item.total} د.ل</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>المجموع: {invoice.totalAmount} د.ل</h3>
        {invoice.additionalNote && <p><strong>ملاحظة:</strong> {invoice.additionalNote}</p>}
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
