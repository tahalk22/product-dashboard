
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

const COLORS = ["#00c6fb", "#005bea", "#ffb347", "#7ed957"];

export default function Home({ darkMode }) {
  const [productsCount, setProductsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [latestActions, setLatestActions] = useState([]);

  useEffect(() => {
    // جلب الإحصائيات
    getDocs(collection(db, "products")).then(snap => setProductsCount(snap.size));
    getDocs(collection(db, "users")).then(snap => setUsersCount(snap.size));
    getDocs(collection(db, "invoices")).then(snap => {
      const activeOrders = snap.docs.filter(doc => doc.data().status !== "تم التنفيذ");
      setOrdersCount(activeOrders.length);
      setInvoicesCount(snap.size);
    });

    // جلب آخر العمليات
    const fetchLatest = async () => {
      const latest = [];
      try {
        const productsSnap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"), limit(3)));
        productsSnap.forEach(doc => {
          latest.push({
            type: "منتج",
            text: `تمت إضافة منتج جديد: `,
            name: doc.data().name || "منتج",
            date: doc.data().createdAt?.toDate?.().toLocaleString?.() || ""
          });
        });
      } catch {}
      try {
        const usersSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(2)));
        usersSnap.forEach(doc => {
          latest.push({
            type: "مستخدم",
            text: `تم تسجيل مستخدم جديد: `,
            name: doc.data().displayName || doc.data().name || "مستخدم",
            date: doc.data().createdAt?.toDate?.().toLocaleString?.() || ""
          });
        });
      } catch {}
      try {
        const invoicesSnap = await getDocs(query(collection(db, "invoices"), orderBy("createdAt", "desc"), limit(1)));
        invoicesSnap.forEach(doc => {
          latest.push({
            type: "فاتورة",
            text: `تم إنشاء فاتورة رقم `,
            name: doc.id,
            date: doc.data().createdAt?.toDate?.().toLocaleString?.() || ""
          });
        });
      } catch {}
      setLatestActions(latest);
    };
    fetchLatest();
  }, []);

  const data = [
    { name: "منتجات", value: productsCount },
    { name: "مستخدمين", value: usersCount },
    { name: "طلبات", value: ordersCount },
    { name: "فواتير", value: invoicesCount },
  ];

  const bg = darkMode
    ? "linear-gradient(135deg, #232526 0%, #1e2024 100%)"
    : "linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%)";
  const cardBg = darkMode ? "rgba(35,37,38,0.85)" : "rgba(255,255,255,0.7)";
  const cardBorder = darkMode ? "1px solid #333" : "1px solid rgba(255,255,255,0.25)";
  const textColor = darkMode ? "#fff" : "#222";
  const subTextColor = darkMode ? "#bbb" : "#444";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        padding: 0,
        margin: 0,
        fontFamily: "'Cairo', 'Segoe UI', sans-serif",
        transition: "background 0.4s",
        direction: "rtl"
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 16px 32px 16px"
        }}
      >
        {/* بطاقة الترحيب */}
        <div
          style={{
            background: cardBg,
            borderRadius: 32,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: cardBorder,
            padding: "40px 32px 32px 32px",
            marginBottom: 32,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            color: textColor
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="8" y="8" width="64" height="64" rx="20" fill="#00c6fb" />
              <rect x="20" y="20" width="16" height="40" rx="6" fill="#005bea" />
              <rect x="44" y="36" width="16" height="24" rx="6" fill="#ffb347" />
              <rect x="44" y="20" width="16" height="12" rx="5" fill="#7ed957" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "2.3em",
              fontWeight: 900,
              letterSpacing: "1px",
              background: "linear-gradient(90deg,#005bea,#00c6fb)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10
            }}
          >
            لوحة تحكم المنتجات
          </h1>
          <p
            style={{
              color: subTextColor,
              fontSize: "1.15em",
              marginBottom: 0,
              fontWeight: 500
            }}
          >
            إحصائيات متجددة، تصميم عصري، تجربة إدارية ممتعة!
          </p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
            marginBottom: 36
          }}
        >
          <StatCard
            label="عدد المنتجات"
            value={productsCount}
            color="#00c6fb"
            darkMode={darkMode}
            icon={
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <rect x="4" y="8" width="30" height="22" rx="6" fill="#00c6fb" />
                <rect x="10" y="14" width="18" height="10" rx="3" fill="#fff" />
              </svg>
            }
          />
          <StatCard
            label="عدد المستخدمين"
            value={usersCount}
            color="#005bea"
            darkMode={darkMode}
            icon={
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <circle cx="19" cy="14" r="7" fill="#005bea" />
                <rect x="7" y="24" width="24" height="8" rx="4" fill="#fff" />
              </svg>
            }
          />
          <StatCard
            label="عدد الطلبات"
            value={ordersCount}
            color="#ffb347"
            darkMode={darkMode}
            icon={
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <rect x="6" y="12" width="26" height="16" rx="5" fill="#ffb347" />
                <circle cx="13" cy="28" r="3" fill="#fff" />
                <circle cx="25" cy="28" r="3" fill="#fff" />
              </svg>
            }
          />
          <StatCard
            label="عدد الفواتير"
            value={invoicesCount}
            color="#7ed957"
            darkMode={darkMode}
            icon={
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <rect x="10" y="8" width="18" height="22" rx="5" fill="#7ed957" />
                <rect x="14" y="14" width="10" height="2" rx="1" fill="#fff" />
                <rect x="14" y="18" width="10" height="2" rx="1" fill="#fff" />
                <rect x="14" y="22" width="6" height="2" rx="1" fill="#fff" />
              </svg>
            }
          />
        </div>

        {/* رسم بياني دائري */}
        <div
          style={{
            background: cardBg,
            borderRadius: 24,
            boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.10)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: cardBorder,
            padding: "28px 12px 18px 12px",
            marginBottom: 32,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
            color: textColor
          }}
        >
          <h3
            style={{
              color: "#005bea",
              marginBottom: "10px",
              fontWeight: 700,
              fontSize: "1.15em"
            }}
          >
            نسبة توزيع النظام
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* آخر العمليات */}
        <div
          style={{
            background: cardBg,
            borderRadius: 24,
            boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.10)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: cardBorder,
            padding: "24px 18px",
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
            color: textColor
          }}
        >
          <h3
            style={{
              color: "#005bea",
              marginBottom: "10px",
              fontWeight: 700,
              fontSize: "1.12em"
            }}
          >
            آخر العمليات
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              fontSize: "1.07em",
              lineHeight: "2.1"
            }}
          >
            {latestActions.length === 0 && (
              <li style={{ color: subTextColor }}>لا توجد عمليات حديثة.</li>
            )}
            {latestActions.map((item, idx) => (
              <li key={idx}>
                <span style={{ marginLeft: 8, color: item.type === "منتج" ? "#00c6fb" : item.type === "مستخدم" ? "#005bea" : "#ffb347" }}>●</span>
                {item.text}
                <b>{item.name}</b>
                <span style={{ color: "#888", fontSize: "0.9em", marginRight: 8 }}>{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* خطوط Google Fonts (Cairo) */}
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;900&display=swap" rel="stylesheet" />
    </div>
  );
}

function StatCard({ label, value, icon, color, darkMode }) {
  return (
    <div
      style={{
        background: darkMode ? "rgba(35,37,38,0.7)" : "rgba(255,255,255,0.55)",
        borderRadius: "20px",
        padding: "32px 18px 22px 18px",
        textAlign: "center",
        boxShadow: `0 2px 12px ${color}33`,
        border: `2px solid ${color}33`,
        transition: "transform 0.2s",
        fontWeight: "bold",
        fontSize: "1.1em",
        position: "relative",
        overflow: "hidden",
        color: darkMode ? "#fff" : "#222"
      }}
    >
      <div style={{ marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          color: color,
          fontSize: "2.1em",
          fontWeight: 900,
          marginBottom: 4,
          letterSpacing: "1px"
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: darkMode ? "#fff" : "#222",
          marginTop: "6px",
          fontSize: "1.07em",
          fontWeight: 700
        }}
      >
        {label}
      </div>
    </div>
  );
}