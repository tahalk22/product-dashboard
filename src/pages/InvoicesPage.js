 import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      const snapshot = await getDocs(collection(db, "invoices"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(data);
      setFiltered(data);
    };
    fetchInvoices();
  }, []);

  const applyFilters = () => {
    let result = [...invoices];
    const searchVal = search.toLowerCase();

    if (searchVal) {
      result = result.filter(
        (inv) =>
          inv.fullName?.toLowerCase().includes(searchVal) ||
          String(inv.invoiceNumber).includes(searchVal)
      );
    }
    if (startDate) {
      const fromDate = new Date(startDate);
      result = result.filter(
        (inv) => inv.createdAt?.toDate?.() >= fromDate
      );
    }
    if (endDate) {
      const toDate = new Date(endDate);
      result = result.filter(
        (inv) => inv.createdAt?.toDate?.() <= toDate
      );
    }
    if (minAmount) {
      result = result.filter(
        (inv) => parseFloat(inv.totalAmount) >= parseFloat(minAmount)
      );
    }
    if (maxAmount) {
      result = result.filter(
        (inv) => parseFloat(inv.totalAmount) <= parseFloat(maxAmount)
      );
    }
    setFiltered(result);
  };

  // تغيير تنسيق التاريخ إلى dd/mm/yyyy
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "غير متوفر";
    const d = timestamp.toDate();
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // عند الضغط على زر التطبيق
  const onApplyClick = () => {
    applyFilters();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>قائمة الفواتير 🧾</h1>

      {/* بحث */}
      <input
        type="text"
        placeholder="ابحث باسم العميل أو رقم الفاتورة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* فلترة مع زر تطبيق */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>من تاريخ:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>إلى تاريخ:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>القيمة من:</label>
          <input
            type="number"
            placeholder="مثلاً 1000"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            style={styles.filterInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>إلى:</label>
          <input
            type="number"
            placeholder="مثلاً 2000"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            style={styles.filterInput}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={onApplyClick} style={styles.applyButton}>
            تطبيق الفلاتر
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>رقم الفاتورة</th>
              <th style={styles.th}>اسم العميل</th>
              <th style={styles.th}>التاريخ</th>
              <th style={styles.th}>الإجمالي (د.ل)</th>
              <th style={styles.th}>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  لا توجد فواتير مطابقة للبحث أو الفلترة.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id} style={styles.tr}>
                  <td style={styles.td}>{inv.invoiceNumber}</td>
                  <td style={styles.td}>{inv.fullName}</td>
                  <td style={styles.td}>{formatDate(inv.createdAt)}</td>
                  <td style={styles.td}>{inv.totalAmount}</td>
                  <td style={styles.td}>
                    <Link to={`/admin/invoices/${inv.id}`} style={styles.detailsButton}>
                      عرض التفاصيل
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    minHeight: "100vh",
    padding: "30px",
    color: "#f4f4f9",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: "1px",
    textShadow: "0 0 10px rgba(0,0,0,0.3)",
  },
  searchInput: {
    width: "100%",
    padding: "15px 20px",
    fontSize: 18,
    borderRadius: 30,
    border: "none",
    marginBottom: 25,
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    outline: "none",
  },
  filtersContainer: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    gap: 20,
    marginBottom: 30,
    alignItems: "flex-end",
  },
  filterGroup: {
    flex: "1 1 180px",
    display: "flex",
    flexDirection: "column",
  },
  filterLabel: {
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 14,
    color: "#ddd",
  },
  filterInput: {
    padding: "10px 15px",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    outline: "none",
  },
  applyButton: {
    backgroundColor: "rgba(107, 238, 20, 0.4)",
    color: "#fff",
    fontWeight: "700",
    padding: "12px 25px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 5px 15px rgba(107, 238, 20, 0.4)",
    transition: "background-color 0.3s ease",
  },
  applyButtonHover: {
    backgroundColor: "#373bbf",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: 15,
    boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
    backgroundColor: "#fff",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 16,
    minWidth: "700px",
  },
  th: {
    borderBottom: "3px solid #4c51bf",
    padding: "15px 10px",
    textAlign: "center",
    backgroundColor: "#6c7ae0",
    color: "#fff",
    fontWeight: "700",
  },
  tr: {
    borderBottom: "1px solid #ddd",
    transition: "background-color 0.3s ease",
  },
  td: {
    padding: "15px 10px",
    textAlign: "center",
  },
  noData: {
    padding: 20,
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  detailsButton: {
    backgroundColor: "#667eea",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(234, 144, 102, 0.5)",
    transition: "background-color 0.3s ease",
  },
};

export default InvoicesPage;
