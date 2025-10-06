
// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db, auth } from "./firebase";

// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import AdminDashboard from "./pages/AdminDashboard";
// import Orders from "./pages/Orders";
// import AdminProducts from "./pages/AdminProducts";
// import InvoicesPage from "./pages/InvoicesPage";
// import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import ProductDetails from "./pages/ProductDetails";
// import AddUser from "./pages/AddUser";
// import Unauthorized from "./pages/Unauthorized";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// // شريط البحث السريع
// function QuickSearch() {
//   const [q, setQ] = useState("");
//   const navigate = useNavigate();
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (q.trim()) navigate(`/products?search=${encodeURIComponent(q)}`);
//   };
//   return (
//     <form onSubmit={handleSearch} style={{ display: "inline-flex", marginRight: 16 }}>
//       <input
//         type="text"
//         placeholder="بحث عن منتج..."
//         value={q}
//         onChange={e => setQ(e.target.value)}
//         style={{ borderRadius: 8, border: "1px solid #ccc", padding: "4px 10px" }}
//       />
//       <button type="submit" style={{ marginRight: 4, borderRadius: 8, background: "#21a1f3", color: "#fff", border: "none", padding: "4px 12px", cursor: "pointer" }}>بحث</button>
//     </form>
//   );
// }

// // زر الوضع الليلي/النهاري
// function ThemeToggle({ darkMode, setDarkMode }) {
//   return (
//     <button
//       onClick={() => setDarkMode((d) => !d)}
//       style={{
//         marginRight: 10,
//         borderRadius: 8,
//         background: darkMode ? "#232526" : "#f8fafc",
//         color: darkMode ? "#fff" : "#232526",
//         border: "1px solid #ccc",
//         padding: "4px 12px",
//         cursor: "pointer"
//       }}
//       title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
//     >
//       <span role="img" aria-label={darkMode ? "sun" : "moon"}>
//         {darkMode ? "☀️" : "🌙"}
//       </span>
//     </button>
//   );
// }

// // شريط التنقل
// function Navigation({ darkMode, setDarkMode }) {
//   const { user, role } = useAuth();
//   const [ordersCount, setOrdersCount] = useState(0);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "invoices"), (snapshot) => {
//       const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const activeOrders = fetchedOrders.filter(order => order.status !== "تم التنفيذ");
//       setOrdersCount(activeOrders.length);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <nav className={`main-navbar${darkMode ? " dark" : ""}`}>
//       <Link to="/">الرئيسية</Link>
//       <Link to="/products">المنتجات</Link>
//       <QuickSearch />
//       {(role === "admin" || role === "superadmin") && (
//         <>
//           <Link to="/admin">لوحة التحكم</Link>
//           <Link to="/Adminproducts">منتجات الإدارة</Link>
//           <Link to="/orders">
//             الطلبات
//             <span style={{
//               background: "#ff4d4f",
//               color: "#fff",
//               borderRadius: "50%",
//               padding: "2px 8px",
//               fontSize: "0.9em",
//               marginRight: 4
//             }}>
//               {ordersCount}
//             </span>
//           </Link>
//           <Link to="/admin/invoices">الفواتير</Link>
//           <Link to="/ProductDetails">تفاصيل المنتج</Link>
//           <Link to="/profile">الملف الشخصي</Link>
//         </>
//       )}
//       {role === "superadmin" && (
//         <Link to="/admin/add-user">إضافة مستخدم</Link>
//       )}
//       <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//       {user && (
//         <span style={{ marginRight: 10, display: "flex", alignItems: "center" }}>
//           <img
//             src={user.photoURL || "https://ui-avatars.com/api/?name=" + (user.displayName || "U")}
//             alt="avatar"
//             style={{ width: 32, height: 32, borderRadius: "50%", marginLeft: 6, border: "1px solid #eee" }}
//           />
//           <span style={{ fontWeight: "bold" }}>{user.displayName || "مستخدم"}</span>
//         </span>
//       )}
//       {user ? (
//         <button onClick={() => {
//           auth.signOut();
//           alert("تم تسجيل الخروج بنجاح!");
//         }} style={{ marginRight: 10 }}>
//           تسجيل الخروج
//         </button>
//       ) : (
//         <Link to="/login">تسجيل الدخول</Link>
//       )}
//     </nav>
//   );
// }

// // إشعار ترحيبي متحرك
// function WelcomeBanner() {
//   const { user } = useAuth();
//   const [show, setShow] = useState(true);
//   useEffect(() => {
//     if (user) setTimeout(() => setShow(false), 3500);
//   }, [user]);
//   if (!user || !show) return null;
//   return (
//     <div style={{
//       background: "#21a1f3",
//       color: "#fff",
//       padding: " 0px",
//       borderRadius: 12,
//       margin: "20px auto",
//       textAlign: "center",
//       maxWidth: 400,
//       fontWeight: "bold",
//       fontSize: "1.1em",
//       animation: "pop-in 0.7s cubic-bezier(.68,-0.55,.27,1.55)"
//     }}>
     
//     </div>
//   );
// }

// // زر العودة للأعلى
// function ScrollToTopBtn() {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setShow(window.scrollY > 200);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   if (!show) return null;
//   return (
//     <button
//       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//       style={{
//         position: "fixed", bottom: 30, left: 30, zIndex: 9999,
//         background: "#21a1f3", color: "#fff", border: "none",
//         borderRadius: "50%", width: 48, height: 48, fontSize: 24, cursor: "pointer"
//       }}
//       title="العودة للأعلى"
//     >↑</button>
//   );
// }

// export default function App() {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     document.body.style.background = darkMode ? "#232526" : "#f8fafc";
//     document.body.style.color = darkMode ? "#fff" : "#232526";
//   }, [darkMode]);

//   return (
//     <AuthProvider>
//       <Router>
//         <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
//         <WelcomeBanner />
//         <div style={{ padding: 20 ,  direction: "rtl" }}>
//           <Routes>
//             <Route path="/" element={<Home darkMode={darkMode} />} />
//             <Route path="/products" element={<Products darkMode={darkMode} />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/profile" element={<Profile darkMode={darkMode} />} />
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <AdminDashboard darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Adminproducts"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <AdminProducts darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/products/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <ProductDetails darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/orders"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <Orders darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/invoices"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <InvoicesPage darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/invoices/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <InvoiceDetailsPage darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/add-user"
//               element={
//                 <ProtectedRoute allowedRoles={["superadmin"]}>
//                   <AddUser darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//         <ScrollToTopBtn />
//       </Router>
//       <style>
//         {`
//         .main-navbar {
//           background: #fff;
//           border-bottom: 1px solid #e0e7ef;
//           padding: 12px 18px;
//           display: flex;
//           align-items: center;
//           gap: 18px;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//           direction: rtl;
//         }
//         .main-navbar.dark {
//           background: #232526;
//           color: #fff;
//           border-bottom: 1px solid #444;
//         }
//         .main-navbar a {
//           color: inherit;
//           text-decoration: none;
//           font-weight: bold;
//           transition: color 0.2s;
//         }
//         .main-navbar a:hover {
//           color: #21a1f3;
//         }
//         @keyframes pop-in {
//           0% { transform: scale(0.7) rotate(-3deg); opacity: 0; }
//           80% { transform: scale(1.05) rotate(1deg);}
//           100% { transform: scale(1) rotate(0); opacity: 1;}
//         }
//         `}
//       </style>
//     </AuthProvider>
//   );
// }






















// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
// import { collection, onSnapshot } from "firebase/firestore";
// import { db, auth } from "./firebase";
// import { FaHome, FaBoxOpen, FaUser, FaSignOutAlt, FaBars, FaTimes, FaClipboardList, FaFileInvoice, FaUserPlus, FaUserCircle } from "react-icons/fa";

// import Home from "./pages/Home";
// import Products from "./pages/Products";
// import AdminDashboard from "./pages/AdminDashboard";
// import Orders from "./pages/Orders";
// import AdminProducts from "./pages/AdminProducts";
// import InvoicesPage from "./pages/InvoicesPage";
// import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
// import Profile from "./pages/Profile";
// import Login from "./pages/Login";
// import ProductDetails from "./pages/ProductDetails";
// import AddUser from "./pages/AddUser";
// import Unauthorized from "./pages/Unauthorized";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// // شريط البحث السريع
// function QuickSearch() {
//   const [q, setQ] = useState("");
//   const navigate = useNavigate();
//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (q.trim()) navigate(`/products?search=${encodeURIComponent(q)}`);
//   };
//   return (
//     <form onSubmit={handleSearch} style={{ display: "block", margin: "12px 0" }}>
//       <input
//         type="text"
//         placeholder="بحث عن منتج..."
//         value={q}
//         onChange={e => setQ(e.target.value)}
//         style={{ borderRadius: 8, border: "1px solid #ccc", padding: "4px 10px", width: "100%" }}
//       />
//       <button type="submit" style={{ marginTop: 6, borderRadius: 8, background: "#21a1f3", color: "#fff", border: "none", padding: "4px 12px", cursor: "pointer", width: "100%" }}>بحث</button>
//     </form>
//   );
// }

// // زر الوضع الليلي/النهاري
// function ThemeToggle({ darkMode, setDarkMode }) {
//   return (
//     <button
//       onClick={() => setDarkMode((d) => !d)}
//       style={{
//         margin: "12px 0",
//         borderRadius: 8,
//         background: darkMode ? "#232526" : "#f8fafc",
//         color: darkMode ? "#fff" : "#232526",
//         border: "1px solid #ccc",
//         padding: "6px 12px",
//         cursor: "pointer",
//         width: "100%"
//       }}
//       title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
//     >
//       <span role="img" aria-label={darkMode ? "sun" : "moon"}>
//         {darkMode ? "☀️" : "🌙"}
//       </span>
//     </button>
//   );
// }

// // شريط جانبي احترافي مع زر إخفاء/إظهار وأيقونات
// function Navigation({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) {
//   const { user, role } = useAuth();
//   const [ordersCount, setOrdersCount] = useState(0);
//   const location = useLocation();

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "invoices"), (snapshot) => {
//       const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const activeOrders = fetchedOrders.filter(order => order.status !== "تم التنفيذ");
//       setOrdersCount(activeOrders.length);
//     });
//     return () => unsubscribe();
//   }, []);

//   // روابط الشريط الجانبي
//   const links = [
//     { to: "/", label: "الرئيسية", icon: <FaHome /> },
//     { to: "/products", label: "المنتجات", icon: <FaBoxOpen /> },
//     ...(role === "admin" || role === "superadmin" ? [
//       { to: "/admin", label: "لوحة الإدارة", icon: <FaClipboardList /> },
//       { to: "/Adminproducts", label: "منتجات الإدارة", icon: <FaBoxOpen /> },
//       { to: "/orders", label: <>الطلبات <span className="orders-badge">{ordersCount}</span></>, icon: <FaClipboardList /> },
//       { to: "/admin/invoices", label: "الفواتير", icon: <FaFileInvoice /> },
//       { to: "/ProductDetails", label: "تفاصيل المنتج", icon: <FaBoxOpen /> },
//       { to: "/profile", label: "الملف الشخصي", icon: <FaUserCircle /> },
//     ] : []),
//     ...(role === "superadmin" ? [
//       { to: "/admin/add-user", label: "إضافة مستخدم", icon: <FaUserPlus /> }
//     ] : [])
//   ];

//   return (
//     <aside className={`sidebar-navbar${darkMode ? " dark" : ""}${sidebarOpen ? "" : " closed"}`}>
//       <button
//         className="sidebar-toggle"
//         onClick={() => setSidebarOpen((v) => !v)}
//         title={sidebarOpen ? "إخفاء القائمة" : "إظهار القائمة"}
//       >
//         {sidebarOpen ? <FaTimes /> : <FaBars />}
//       </button>
//       {sidebarOpen && (
//         <>
//           <div className="sidebar-header">
//             <img src="/logo192.png" alt="logo" style={{ width: 40, marginBottom: 10 }} />
//             <span style={{ fontWeight: "bold", fontSize: 20, color: "#21a1f3" }}>منتجاتي</span>
//           </div>
//           {links.map((link, idx) => (
//             <Link
//               key={idx}
//               to={typeof link.to === "string" ? link.to : "#"}
//               className={location.pathname === link.to ? "active" : ""}
//               style={{ display: "flex", alignItems: "center", gap: 10 }}
//             >
//               {link.icon}
//               <span>{link.label}</span>
//             </Link>
//           ))}
//           <QuickSearch />
//           <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
//           {user && (
//             <div style={{ margin: "12px 0", display: "flex", alignItems: "center", gap: 8 }}>
//               <img
//                 src={user.photoURL || "https://ui-avatars.com/api/?name=" + (user.displayName || "U")}
//                 alt="avatar"
//                 style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #eee" }}
//               />
//               <span style={{ fontWeight: "bold" }}>{user.displayName || "مستخدم"}</span>
//             </div>
//           )}
//           {user ? (
//             <button onClick={() => {
//               auth.signOut();
//               alert("تم تسجيل الخروج بنجاح!");
//             }} className="sidebar-logout">
//               <FaSignOutAlt style={{ marginLeft: 6 }} />
//               تسجيل الخروج
//             </button>
//           ) : (
//             <Link to="/login"><FaUser /> تسجيل الدخول</Link>
//           )}
//         </>
//       )}
//     </aside>
//   );
// }

// // إشعار ترحيبي متحرك
// function WelcomeBanner() {
//   const { user } = useAuth();
//   const [show, setShow] = useState(true);
//   useEffect(() => {
//     if (user) setTimeout(() => setShow(false), 3500);
//   }, [user]);
//   if (!user || !show) return null;
//   return (
//     <div style={{
//       background: "linear-gradient(90deg,#005bea,#00c6fb)",
//       color: "#fff",
//       padding: "10px 20px",
//       borderRadius: 12,
//       margin: "20px auto",
//       textAlign: "center",
//       maxWidth: 400,
//       fontWeight: "bold",
//       fontSize: "1.1em",
//       animation: "pop-in 0.7s cubic-bezier(.68,-0.55,.27,1.55)"
//     }}>
//       <span role="img" aria-label="wave">👋</span> مرحباً {user.displayName || "مستخدم"}! نتمنى لك يوماً سعيداً.
//     </div>
//   );
// }

// // زر العودة للأعلى
// function ScrollToTopBtn() {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setShow(window.scrollY > 200);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   if (!show) return null;
//   return (
//     <button
//       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//       style={{
//         position: "fixed", bottom: 30, left: 30, zIndex: 9999,
//         background: "#21a1f3", color: "#fff", border: "none",
//         borderRadius: "50%", width: 48, height: 48, fontSize: 24, cursor: "pointer", boxShadow: "0 2px 8px #005bea55"
//       }}
//       title="العودة للأعلى"
//     >↑</button>
//   );
// }

// export default function App() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     document.body.style.background = darkMode ? "#232526" : "#f8fafc";
//     document.body.style.color = darkMode ? "#fff" : "#232526";
//   }, [darkMode]);

//   // Responsive sidebar
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 700) setSidebarOpen(false);
//       else setSidebarOpen(true);
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <AuthProvider>
//       <Router>
//         <Navigation darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
//         <div style={{
//           marginRight: sidebarOpen ? 230 : 60,
//           padding: 20,
//           direction: "rtl",
//           transition: "margin-right 0.3s"
//         }}>
//           <WelcomeBanner />
//           <Routes>
//             <Route path="/" element={<Home darkMode={darkMode} />} />
//             <Route path="/products" element={<Products darkMode={darkMode} />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/unauthorized" element={<Unauthorized />} />
//             <Route path="/profile" element={<Profile darkMode={darkMode} />} />
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <AdminDashboard darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/Adminproducts"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <AdminProducts darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/products/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <ProductDetails darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/orders"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <Orders darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/invoices"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <InvoicesPage darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/invoices/:id"
//               element={
//                 <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                   <InvoiceDetailsPage darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/add-user"
//               element={
//                 <ProtectedRoute allowedRoles={["superadmin"]}>
//                   <AddUser darkMode={darkMode} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//         <ScrollToTopBtn />
//       </Router>
//       <style>
//         {`
//         .sidebar-navbar {
//           width: 220px;
//           min-height: 100vh;
//           background: #fff;
//           border-left: 1px solid #e0e7ef;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-end;
//           padding: 24px 12px 24px 0;
//           position: fixed;
//           right: 0;
//           top: 0;
//           z-index: 200;
//           direction: rtl;
//           box-shadow: 0 0 16px #e0e7ef33;
//           transition: width 0.3s;
//         }
//         .sidebar-navbar.closed {
//           width: 56px;
//           padding: 24px 0 24px 0;
//           overflow: hidden;
//         }
//         .sidebar-navbar.dark {
//           background: #232526;
//           color: #fff;
//           border-left: 1px solid #444;
//         }
//         .sidebar-navbar a {
//           color: inherit;
//           text-decoration: none;
//           font-weight: bold;
//           margin: 10px 0;
//           width: 100%;
//           display: block;
//           padding: 10px 16px;
//           border-radius: 8px 0 0 8px;
//           transition: background 0.2s, color 0.2s;
//           text-align: right;
//         }
//         .sidebar-navbar a:hover, .sidebar-navbar a.active {
//           background: #21a1f3;
//           color: #fff;
//         }
//         .sidebar-header {
//           margin-bottom: 24px;
//           width: 100%;
//           text-align: right;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }
//         .orders-badge {
//           background: #ff4d4f;
//           color: #fff;
//           border-radius: 50%;
//           padding: 2px 8px;
//           font-size: 0.9em;
//           margin-right: 6px;
//         }
//         .sidebar-logout {
//           background: #ff4d4f;
//           color: #fff;
//           border: none;
//           border-radius: 8px;
//           padding: 8px 18px;
//           margin-top: 10px;
//           cursor: pointer;
//           font-weight: bold;
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .sidebar-toggle {
//           background: none;
//           border: none;
//           color: #21a1f3;
//           font-size: 2em;
//           cursor: pointer;
//           margin-bottom: 18px;
//           align-self: flex-start;
//         }
//         @media (max-width: 700px) {
//           .sidebar-navbar {
//             width: 56px !important;
//             padding: 24px 0 24px 0 !important;
//           }
//         }
//         @keyframes pop-in {
//           0% { transform: scale(0.7) rotate(-3deg); opacity: 0; }
//           80% { transform: scale(1.05) rotate(1deg);}
//           100% { transform: scale(1) rotate(0); opacity: 1;}
//         }
//         `}
//       </style>
//     </AuthProvider>
//   );
// }













import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import { FaHome, FaBoxOpen, FaUser, FaSignOutAlt, FaBars, FaTimes, FaClipboardList, FaFileInvoice, FaUserPlus, FaUserCircle , FaCar} from "react-icons/fa";

import Home from "./pages/Home";
import Products from "./pages/Products";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";
import AdminProducts from "./pages/AdminProducts";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceDetailsPage from "./pages/InvoiceDetailsPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import AddUser from "./pages/AddUser";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CarTracking from "./pages/CarTracking";
// شريط البحث السريع
function QuickSearch() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/products?search=${encodeURIComponent(q)}`);
  };
  return (
    <form onSubmit={handleSearch} style={{ display: "block", margin: "12px 0" }}>
      <input
        type="text"
        placeholder="بحث عن منتج..."
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ borderRadius: 8, border: "1px solid #ccc", padding: "4px 10px", width: "100%" }}
      />
      <button type="submit" style={{ marginTop: 6, borderRadius: 8, background: "#21a1f3", color: "#fff", border: "none", padding: "4px 12px", cursor: "pointer", width: "100%" }}>بحث</button>
    </form>
  );
}

// زر الوضع الليلي/النهاري
function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode((d) => !d)}
      style={{
        margin: "12px 0",
        borderRadius: 8,
        background: darkMode ? "#232526" : "#f8fafc",
        color: darkMode ? "#fff" : "#232526",
        border: "1px solid #ccc",
        padding: "6px 12px",
        cursor: "pointer",
        width: "100%"
      }}
      title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
    >
      <span role="img" aria-label={darkMode ? "sun" : "moon"}>
        {darkMode ? "☀️" : "🌙"}
      </span>
    </button>
  );
}

// شريط جانبي مع أزرار تمرير للعناصر فقط
function Navigation({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) {
  const { user, role } = useAuth();
  const [ordersCount, setOrdersCount] = useState(0);
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "invoices"), (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const activeOrders = fetchedOrders.filter(order => order.status !== "تم التنفيذ");
      setOrdersCount(activeOrders.length);
    });
    return () => unsubscribe();
  }, []);

  const links = [
    { to: "/", label: "الرئيسية", icon: <FaHome /> },
    { to: "/products", label: "المنتجات", icon: <FaBoxOpen /> },
    ...(role === "admin" || role === "superadmin" ? [
      { to: "/admin", label: "لوحة الإدارة", icon: <FaClipboardList /> },
      { to: "/Adminproducts", label: "منتجات الإدارة", icon: <FaBoxOpen /> },
      { to: "/orders", label: <>الطلبات <span className="orders-badge">{ordersCount}</span></>, icon: <FaClipboardList /> },
      { to: "/admin/invoices", label: "الفواتير", icon: <FaFileInvoice /> },
      { to: "/ProductDetails", label: "تفاصيل المنتج", icon: <FaBoxOpen /> },
      { to: "/profile", label: "الملف الشخصي", icon: <FaUserCircle /> },
      { to: "/car-tracking", label: "تتبع المركبات", icon: <FaCar /> },
    ] : []),
    ...(role === "superadmin" ? [
      { to: "/admin/add-user", label: "إضافة مستخدم", icon: <FaUserPlus /> }
    ] : [])
  ];

  // دوال التمرير
  const scrollUp = () => {
    if (scrollRef.current) scrollRef.current.scrollTop -= 60;
  };
  const scrollDown = () => {
    if (scrollRef.current) scrollRef.current.scrollTop += 60;
  };

  return (
    <aside className={`sidebar-navbar${darkMode ? " dark" : ""}${sidebarOpen ? "" : " closed"}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((v) => !v)}
        title={sidebarOpen ? "إخفاء القائمة" : "إظهار القائمة"}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      {sidebarOpen && (
        <>
         
          <div
            className="sidebar-links-scroll"
            ref={scrollRef}
            style={{
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              width: "100%",
              paddingBottom: 20,
              scrollBehavior: "smooth"
            }}
          >
            {links.map((link, idx) => (
              <Link
                key={idx}
                to={typeof link.to === "string" ? link.to : "#"}
                className={location.pathname === link.to ? "active" : ""}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <QuickSearch />
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            {user && (
              <div style={{ margin: "12px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <img
                  src={user.photoURL || "https://ui-avatars.com/api/?name=" + (user.displayName || "U")}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #eee" }}
                />
                <span style={{ fontWeight: "bold" }}>{user.displayName || "مستخدم"}</span>
              </div>
            )}
            {user ? (
              <button onClick={() => {
                auth.signOut();
                alert("تم تسجيل الخروج بنجاح!");
              }} className="sidebar-logout">
                <FaSignOutAlt style={{ marginLeft: 6 }} />
                تسجيل الخروج
              </button>
            ) : (
              <Link to="/login"><FaUser /> تسجيل الدخول</Link>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

// إشعار ترحيبي متحرك
function WelcomeBanner() {
  const { user } = useAuth();
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (user) setTimeout(() => setShow(false), 3500);
  }, [user]);
  if (!user || !show) return null;
  return (
    <div style={{
      background: "linear-gradient(90deg,#005bea,#00c6fb)",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: 12,
      margin: "20px auto",
      textAlign: "center",
      maxWidth: 400,
      fontWeight: "bold",
      fontSize: "1.1em",
      animation: "pop-in 0.7s cubic-bezier(.68,-0.55,.27,1.55)"
    }}>
      <span role="img" aria-label="wave">👋</span> مرحباً {user.displayName || "مستخدم"}! نتمنى لك يوماً سعيداً.
    </div>
  );
}

// زر العودة للأعلى
function ScrollToTopBtn() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed", bottom: 30, left: 30, zIndex: 9999,
        background: "#21a1f3", color: "#fff", border: "none",
        borderRadius: "50%", width: 48, height: 48, fontSize: 24, cursor: "pointer", boxShadow: "0 2px 8px #005bea55"
      }}
      title="العودة للأعلى"
    >↑</button>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.style.background = darkMode ? "#232526" : "#f8fafc";
    document.body.style.color = darkMode ? "#fff" : "#232526";
  }, [darkMode]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navigation darkMode={darkMode} setDarkMode={setDarkMode} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div style={{
          marginRight: sidebarOpen ? 230 : 60,
          padding: 20,
          direction: "rtl",
          transition: "margin-right 0.3s",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <WelcomeBanner />
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/products" element={<Products darkMode={darkMode} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/profile" element={<Profile darkMode={darkMode} />} />
             <Route path="/car-tracking" element={<CarTracking />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminDashboard darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Adminproducts"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <AdminProducts darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <ProductDetails darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <Orders darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoices"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <InvoicesPage darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoices/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                  <InvoiceDetailsPage darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-user"
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <AddUser darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ScrollToTopBtn />
      </Router>
      <style>
        {`
        .sidebar-navbar {
          width: 220px;
          min-height: 100vh;
          background: #fff;
          border-left: 1px solid #e0e7ef;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 24px 12px 24px 0;
          position: fixed;
          right: 0;
          top: 0;
          z-index: 200;
          direction: rtl;
          box-shadow: 0 0 16px #e0e7ef33;
          transition: width 0.3s;
        }
        .sidebar-navbar.closed {
          width: 56px;
          padding: 24px 0 24px 0;
          overflow: hidden;
        }
        .sidebar-navbar.dark {
          background: #232526;
          color: #fff;
          border-left: 1px solid #444;
        }
        .sidebar-links-scroll {
          flex: 1;
          width: 100%;
          overflow-y: auto;
          padding-bottom: 20px;
          scroll-behavior: smooth;
        }
        .scroll-btn {
          background: #e0e7ef;
          border: none;
          border-radius: 6px;
          font-size: 1.2em;
          padding: 2px 10px;
          cursor: pointer;
          color: #232526;
          transition: background 0.2s;
        }
        .sidebar-navbar.dark .scroll-btn {
          background: #444;
          color: #fff;
        }
        .scroll-btn:hover {
          background: #21a1f3;
          color: #fff;
        }
        .sidebar-navbar a {
          color: inherit;
          text-decoration: none;
          font-weight: bold;
          margin: 10px 0;
          width: 100%;
          display: block;
          padding: 10px 16px;
          border-radius: 8px 0 0 8px;
          transition: background 0.2s, color 0.2s;
          text-align: right;
        }
        .sidebar-navbar a:hover, .sidebar-navbar a.active {
          background: #21a1f3;
          color: #fff;
        }
        .orders-badge {
          background: #ff4d4f;
          color: #fff;
          border-radius: 50%;
          padding: 2px 8px;
          font-size: 0.9em;
          margin-right: 6px;
        }
        .sidebar-logout {
          background: #ff4d4f;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          margin-top: 10px;
          cursor: pointer;
          font-weight: bold;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-toggle {
          background: none;
          border: none;
          color: #21a1f3;
          font-size: 2em;
          cursor: pointer;
          margin-bottom: 18px;
          align-self: flex-start;
        }
        @media (max-width: 700px) {
          .sidebar-navbar {
            width: 56px !important;
            padding: 24px 0 24px 0 !important;
          }
        }
        @keyframes pop-in {
          0% { transform: scale(0.7) rotate(-3deg); opacity: 0; }
          80% { transform: scale(1.05) rotate(1deg);}
          100% { transform: scale(1) rotate(0); opacity: 1;}
        }
        `}
      </style>
    </AuthProvider>
  );
}