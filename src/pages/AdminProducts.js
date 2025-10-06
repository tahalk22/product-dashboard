
// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db, storage } from "../firebase";

// const categories = [
//   "قسم البن ومشتقاته",
//   "قسم المجمدات",
//   "قسم المواد الغذائية والمشروبات",
//   "قسم الأدوات والمعدات",
//   "قسم الحليب والأجبان ومشتقاتها",
//   "قسم مواد التنظيف",
//   "قسم الأكياس والتغليف",
//   "قسم العجائن والخبيز",
//   "قسم الصوصات",
// ];

// const InputField = ({
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   required,
//   style,
//   min,
//   step,
//   options,
// }) => {
//   if (type === "select") {
//     return (
//       <select
//         value={value}
//         onChange={onChange}
//         required={required}
//         style={style}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((opt, idx) => (
//           <option key={idx} value={opt}>
//             {opt}
//           </option>
//         ))}
//       </select>
//     );
//   }
//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       style={style}
//       min={min}
//       step={step}
//       autoComplete="off"
//     />
//   );
// };

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     pricePerPiece: "",
//     quantity: "",
//     category: "",
//     type: "قطعة",
//     itemsPerBox: "",
//   });
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [editId, setEditId] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loadingImage, setLoadingImage] = useState(false);
//   const [filterMode, setFilterMode] = useState("all"); // all, main, sub

//   // قائمة الاقتراحات تظهر حسب الكتابة
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const suggestionsRef = useRef(null);

//   useEffect(() => {
//     fetchProducts();

//     const handleClickOutside = (e) => {
//       if (
//         suggestionsRef.current &&
//         !suggestionsRef.current.contains(e.target)
//       ) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const fetchProducts = async () => {
//     const snapshot = await getDocs(collection(db, "products"));
//     const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setProducts(items);
//   };

//   const confirmAction = (message) => {
//     return new Promise((resolve) => {
//       const confirmed = window.confirm(message);
//       resolve(confirmed);
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const confirmed = await confirmAction(
//       editId
//         ? "هل متأكد من تحديث بيانات المنتج؟"
//         : "هل متأكد من إضافة المنتج؟"
//     );
//     if (!confirmed) return;

//     setLoadingImage(true);
//     let imageUrl = "";

//     if (image) {
//       const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
//       await uploadBytes(imageRef, image);
//       imageUrl = await getDownloadURL(imageRef);
//     }
//     setLoadingImage(false);

//     const isBox = formData.type === "صندوق";

//     // تأكد من تعبئة الحقول المطلوبة للصندوق
//     if (isBox && (!formData.pricePerPiece || !formData.itemsPerBox)) {
//       alert("يجب إدخال سعر القطعة وعدد القطع في الصندوق");
//       return;
//     }

//     // السعر والكمية يجب يكونوا أرقام
//     if (!formData.price || !formData.quantity) {
//       alert("يجب إدخال السعر والكمية");
//       return;
//     }

//     const baseProductData = {
//       ...formData,
//       price: Number(formData.price),
//       quantity: Number(formData.quantity),
//       itemsPerBox: isBox ? Number(formData.itemsPerBox) : "",
//       imageUrl,
//     };

//     if (editId) {
//       await updateDoc(doc(db, "products", editId), baseProductData);
//       setEditId(null);
//     } else {
//       const productRef = await addDoc(collection(db, "products"), baseProductData);

//       // لو صندوق، نضيف صنف فرعي (قطعة) تلقائياً
//       if (isBox) {
//         const childProduct = {
//           name: `${formData.name} - قطعة`,
//           price: Number(formData.pricePerPiece),
//           quantity: Number(formData.quantity) * Number(formData.itemsPerBox),
//           category: formData.category,
//           type: "قطعة",
//           itemsPerBox: "",
//           imageUrl,
//           parentId: productRef.id,
//         };
//         await addDoc(collection(db, "products"), childProduct);
//       }
//     }

//     setFormData({
//       name: "",
//       price: "",
//       pricePerPiece: "",
//       quantity: "",
//       category: "",
//       type: "قطعة",
//       itemsPerBox: "",
//     });
//     setImage(null);
//     setImagePreview(null);
//     fetchProducts();
//   };

//   const handleEdit = (product) => {
//     setFormData({
//       name: product.name,
//       price: product.price,
//       pricePerPiece: product.pricePerPiece || "",
//       quantity: product.quantity,
//       category: product.category,
//       type: product.type || "قطعة",
//       itemsPerBox: product.itemsPerBox || "",
//     });
//     setEditId(product.id);
//     setImagePreview(product.imageUrl || null);
//     setImage(null);
//   };

//   const cancelEdit = () => {
//     setEditId(null);
//     setFormData({
//       name: "",
//       price: "",
//       pricePerPiece: "",
//       quantity: "",
//       category: "",
//       type: "قطعة",
//       itemsPerBox: "",
//     });
//     setImage(null);
//     setImagePreview(null);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("هل أنت متأكد من حذف المنتج؟")) {
//       await deleteDoc(doc(db, "products", id));
//       fetchProducts();
//     }
//   };

//   // التعامل مع البحث والاقتراحات
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value.trim() === "") {
//       setShowSuggestions(false);
//     } else {
//       setShowSuggestions(true);
//     }
//   };

//   const handleSuggestionClick = (product) => {
//     setSearchQuery(product.name);
//     setShowSuggestions(false);
//   };

//   // تصفية حسب البحث وحسب فلترة العناصر الفرعية أو الرئيسية
//   const filteredProducts = products.filter((product) => {
//     const searchText = searchQuery.toLowerCase();

//     const matchesSearch =
//       product.name?.toLowerCase().includes(searchText) ||
//       product.category?.toLowerCase().includes(searchText);

//     if (filterMode === "main") return matchesSearch && !product.parentId;
//     if (filterMode === "sub") return matchesSearch && product.parentId;
//     return matchesSearch;
//   });

//   // اقتراحات تظهر في قائمة البحث مع التفاصيل المطلوبة
//   const suggestionList = products.filter(
//     (p) =>
//       p.name?.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery
//   );

//   const baseInputStyle = {
//     padding: "10px 12px",
//     margin: "8px 6px",
//     borderRadius: 8,
//     border: "1.5px solid #cbd5e1",
//     fontSize: 16,
//     outline: "none",
//     transition: "0.3s",
//     width: "calc(33.33% - 14px)",
//     boxSizing: "border-box",
//   };

//   const styles = {
//     container: {
//       padding: 25,
//       maxWidth: 1000,
//       margin: "auto",
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       color: "#222",
//       backgroundColor: "#f9fafb",
//       borderRadius: 15,
//       boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
//       position: "relative",
//     },
//     title: {
//       fontSize: 28,
//       fontWeight: "bold",
//       color: "#2a3a99",
//       marginBottom: 20,
//       textAlign: "center",
//       letterSpacing: "1.5px",
//     },
//     form: {
//       display: "flex",
//       flexWrap: "wrap",
//       justifyContent: "flex-start",
//       marginBottom: 30,
//       gap: 10,
//     },
//     input: {
//       ...baseInputStyle,
//     },
//     inputFile: {
//       marginTop: 10,
//       marginBottom: 20,
//       fontSize: 14,
//       width: "100%",
//       boxSizing: "border-box",
//     },
//     button: {
//       backgroundColor: "#2a3a99",
//       color: "white",
//       padding: "12px 18px",
//       border: "none",
//       borderRadius: 12,
//       cursor: "pointer",
//       fontWeight: "600",
//       fontSize: 17,
//       flexGrow: 1,
//       transition: "background-color 0.3s",
//       marginTop: 8,
//     },
//     buttonCancel: {
//       backgroundColor: "#999",
//       color: "white",
//       padding: "12px 18px",
//       border: "none",
//       borderRadius: 12,
//       cursor: "pointer",
//       fontWeight: "600",
//       fontSize: 17,
//       marginLeft: 10,
//       marginTop: 8,
//       flexGrow: 1,
//       transition: "background-color 0.3s",
//     },
//     suggestionsList: {
//       position: "absolute",
//       top: "40px",
//       width: "100%",
//       maxHeight: 200,
//       overflowY: "auto",
//       backgroundColor: "#fff",
//       borderRadius: 10,
//       boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//       zIndex: 100,
//     },
//     suggestionItem: {
//       padding: 12,
//       borderBottom: "1px solid #eee",
//       cursor: "pointer",
//       fontSize: 14,
//       color: "#333",
//     },
//     filtersContainer: {
//       marginBottom: 20,
//       display: "flex",
//       justifyContent: "center",
//       gap: 15,
//     },
//     filterButton: {
//       padding: "8px 16px",
//       borderRadius: 12,
//       border: "none",
//       cursor: "pointer",
//       fontWeight: "600",
//       fontSize: 15,
//       backgroundColor: "#e0e7ff",
//       color: "#2a3a99",
//       transition: "background-color 0.3s",
//     },
//     filterButtonActive: {
//       backgroundColor: "#2a3a99",
//       color: "#fff",
//     },
//     table: {
//       width: "100%",
//       borderCollapse: "collapse",
//       boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
//       borderRadius: 15,
//       overflow: "hidden",
//     },
//     th: {
//       padding: 14,
//       backgroundColor: "#2a3a99",
//       color: "white",
//       fontWeight: "600",
//       fontSize: 16,
//       textAlign: "center",
//       borderBottom: "3px solid #1e2a78",
//     },
//     td: {
//       padding: 12,
//       textAlign: "center",
//       borderBottom: "1px solid #ddd",
//       fontSize: 14,
//       color: "#444",
//     },
//     img: {
//       maxWidth: 50,
//       maxHeight: 50,
//       borderRadius: 6,
//       objectFit: "cover",
//     },
//     actionButton: {
//       padding: "6px 14px",
//       borderRadius: 10,
//       border: "none",
//       cursor: "pointer",
//       margin: "0 3px",
//       fontWeight: "600",
//       fontSize: 14,
//       transition: "background-color 0.3s",
//       color: "white",
//     },
//     editButton: {
//       backgroundColor: "#2563eb",
//     },
//     deleteButton: {
//       backgroundColor: "#dc2626",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.title}>إدارة منتجات التومي </h1>

//       {/* أزرار الفلترة */}
//       <div style={styles.filtersContainer}>
//         <button
//           style={{
//             ...styles.filterButton,
//             ...(filterMode === "all" ? styles.filterButtonActive : {}),
//           }}
//           onClick={() => setFilterMode("all")}
//           type="button"
//         >
//           عرض الكل
//         </button>
//         <button
//           style={{
//             ...styles.filterButton,
//             ...(filterMode === "main" ? styles.filterButtonActive : {}),
//           }}
//           onClick={() => setFilterMode("main")}
//           type="button"
//         >
//           عرض العناصر الرئيسية فقط
//         </button>
//         <button
//           style={{
//             ...styles.filterButton,
//             ...(filterMode === "sub" ? styles.filterButtonActive : {}),
//           }}
//           onClick={() => setFilterMode("sub")}
//           type="button"
//         >
//           عرض العناصر الفرعية فقط
//         </button>
//       </div>

//       {/* مربع البحث مع قائمة الاقتراحات */}
//       <div style={{ position: "relative", marginBottom: 30 }}>
//         <input
//           type="text"
//           placeholder="ابحث عن منتج..."
//           value={searchQuery}
//           onChange={handleSearchChange}
//           style={{ ...baseInputStyle, width: "100%" }}
//           onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
//           autoComplete="off"
//           ref={suggestionsRef}
//         />
//         {showSuggestions && suggestionList.length > 0 && (
//           <div style={styles.suggestionsList} ref={suggestionsRef}>
//             {suggestionList.map((product) => (
//               <div
//                 key={product.id}
//                 style={styles.suggestionItem}
//                 onClick={() => {
//                   handleSuggestionClick(product);
//                   setFormData({
//                     ...formData,
//                     name: product.name,
//                     price: product.price,
//                     quantity: product.quantity,
//                     category: product.category,
//                     type: product.type,
//                     pricePerPiece: product.pricePerPiece || "",
//                     itemsPerBox: product.itemsPerBox || "",
//                   });
//                   setShowSuggestions(false);
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.backgroundColor = "#e0e7ff")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.backgroundColor = "transparent")
//                 }
//               >
//                 <strong>{product.name}</strong> | السعر: {product.price} | الكمية:{" "}
//                 {product.quantity} | النوع: {product.type} | القسم:{" "}
//                 {product.category}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* فورم الإضافة والتعديل */}
//       <form onSubmit={handleSubmit} style={styles.form}>
//         <InputField
//           placeholder="اسم المنتج"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//           style={styles.input}
//         />

//         <InputField
//           type="select"
//           placeholder="اختر القسم"
//           value={formData.category}
//           onChange={(e) =>
//             setFormData({ ...formData, category: e.target.value })
//           }
//           required
//           options={categories}
//           style={styles.input}
//         />

//         {/* حقل السعر */}
//         <InputField
//           type="number"
//           placeholder="السعر"
//           value={formData.price}
//           onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//           required
//           min={0}
//           step="0.01"
//           style={styles.input}
//         />

//         {/* حقل الكمية */}
//         <InputField
//           type="number"
//           placeholder="الكمية"
//           value={formData.quantity}
//           onChange={(e) =>
//             setFormData({ ...formData, quantity: e.target.value })
//           }
//           required
//           min={0}
//           step="1"
//           style={styles.input}
//         />

//         {/* نوع العبوة */}
//         <InputField
//           type="select"
//           placeholder="اختر النوع"
//           value={formData.type}
//           onChange={(e) =>
//             setFormData({ ...formData, type: e.target.value })
//           }
//           required
//           options={["قطعة", "صندوق"]}
//           style={styles.input}
//         />

//         {/* سعر القطعة يظهر فقط لو النوع صندوق */}
//         {formData.type === "صندوق" && (
//           <>
//             <InputField
//               type="number"
//               placeholder="سعر القطعة"
//               value={formData.pricePerPiece}
//               onChange={(e) =>
//                 setFormData({ ...formData, pricePerPiece: e.target.value })
//               }
//               required={formData.type === "صندوق"}
//               min={0}
//               step="0.01"
//               style={styles.input}
//             />
//             <InputField
//               type="number"
//               placeholder="عدد القطع في الصندوق"
//               value={formData.itemsPerBox}
//               onChange={(e) =>
//                 setFormData({ ...formData, itemsPerBox: e.target.value })
//               }
//               required={formData.type === "صندوق"}
//               min={1}
//               step="1"
//               style={styles.input}
//             />
//           </>
//         )}

//         <input
//           onChange={(e) => {
//             setImage(e.target.files[0]);
//             setImagePreview(URL.createObjectURL(e.target.files[0]));
//           }}
//           type="file"
//           accept="image/*"
//           style={styles.inputFile}
//         />

//         {imagePreview && (
//           <img
//             src={imagePreview}
//             alt="معاينة المنتج"
//             style={{ maxWidth: 150, borderRadius: 10, margin: "10px 0" }}
//           />
//         )}

//         {loadingImage && <p style={{ margin: "10px 0" }}>جارٍ رفع الصورة...</p>}

//         <div style={{ width: "100%", marginTop: 10, display: "flex", gap: 10 }}>
//           <button type="submit" style={styles.button}>
//             {editId ? "تحديث المنتج" : "إضافة المنتج"}
//           </button>
//           {editId && (
//             <button
//               type="button"
//               onClick={cancelEdit}
//               style={styles.buttonCancel}
//             >
//               إلغاء التعديل
//             </button>
//           )}
//         </div>
//       </form>

//       {/* جدول المنتجات */}
//       <table style={styles.table}>
//         <thead>
//           <tr>
//             <th style={styles.th}>الصورة</th>
//             <th style={styles.th}>الاسم</th>
//             <th style={styles.th}>القسم</th>
//             <th style={styles.th}>سعر القطعة</th>
//             <th style={styles.th}>السعر</th>
//             <th style={styles.th}>الكمية</th>
//             <th style={styles.th}>النوع</th>
//             <th style={styles.th}>عدد القطع في الصندوق</th>
//             <th style={styles.th}>الإجراءات</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProducts.length === 0 && (
//             <tr>
//               <td colSpan={9} style={{ textAlign: "center", padding: 20 }}>
//                 لا توجد منتجات مطابقة للبحث
//               </td>
//             </tr>
//           )}
//           {filteredProducts.map((product) => {
//             const isSubProduct = !!product.parentId;
//             return (
//               <tr
//                 key={product.id}
//                 title={isSubProduct ? "قطعة فرعية" : "صندوق رئيسي"}
//                 style={{
//                   backgroundColor: isSubProduct ? "#f9fafb" : "#e0e7ff",
//                   fontStyle: isSubProduct ? "italic" : "normal",
//                   color: isSubProduct ? "#555" : "#222",
//                 }}
//               >
//                 <td style={styles.td}>
//                   {product.imageUrl ? (
//                     <img
//                       src={product.imageUrl}
//                       alt={product.name}
//                       loading="lazy"
//                       style={styles.img}
//                     />
//                   ) : (
//                     "لا توجد صورة"
//                   )}
//                 </td>
//                 <td style={styles.td}>{product.name}</td>
//                 <td style={styles.td}>{product.category}</td>
//                 <td style={styles.td}>{product.pricePerPiece || "-"}</td>
//                 <td style={styles.td}>{product.price}</td>
//                 <td style={styles.td}>{product.quantity}</td>
//                 <td style={styles.td}>{product.type}</td>
//                 <td style={styles.td}>{product.itemsPerBox || "-"}</td>
//                 <td style={styles.td}>
//                   <button
//                     style={{ ...styles.actionButton, ...styles.editButton }}
//                     onClick={() => handleEdit(product)}
//                     title="تعديل"
//                   >
//                     تعديل
//                   </button>
//                   <button
//                     style={{ ...styles.actionButton, ...styles.deleteButton }}
//                     onClick={() => handleDelete(product.id)}
//                     title="حذف"
//                   >
//                     حذف
//                   </button>
//                   <button>
//  <Link
//     to={`/products/${product.id}`}
//     style={{
//       ...styles.actionButton,
//       backgroundColor: "#21a1f3",
//       color: "#fff",
//       textDecoration: "none",
//       margin: "0 3px",
//       display: "inline-block",
//     }}
//     title="عرض تفاصيل المنتج"
//   >
//     عرض
//   </Link>
//   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }









import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const categories = [
  "قسم البن ومشتقاته",
  "قسم المجمدات",
  "قسم المواد الغذائية والمشروبات",
  "قسم الأدوات والمعدات",
  "قسم الحليب والأجبان ومشتقاتها",
  "قسم مواد التنظيف",
  "قسم الأكياس والتغليف",
  "قسم العجائن والخبيز",
  "قسم الصوصات",
];

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  style,
  min,
  step,
  options,
}) => {
  if (type === "select") {
    return (
      <select
        value={value}
        onChange={onChange}
        required={required}
        style={style}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={style}
        rows={2}
        autoComplete="off"
      />
    );
  }
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={style}
      min={min}
      step={step}
      autoComplete="off"
    />
  );
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    pricePerPiece: "",
    quantity: "",
    category: "",
    type: "قطعة",
    itemsPerBox: "",
    madeIn: "",
    details: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [filterMode, setFilterMode] = useState("all");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetchProducts();

    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const confirmAction = (message) => {
    return new Promise((resolve) => {
      const confirmed = window.confirm(message);
      resolve(confirmed);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = await confirmAction(
      editId
        ? "هل متأكد من تحديث بيانات المنتج؟"
        : "هل متأكد من إضافة المنتج؟"
    );
    if (!confirmed) return;

    setLoadingImage(true);
    let imageUrl = "";

    if (image) {
      const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }
    setLoadingImage(false);

    const isBox = formData.type === "صندوق";

    if (isBox && (!formData.pricePerPiece || !formData.itemsPerBox)) {
      alert("يجب إدخال سعر القطعة وعدد القطع في الصندوق");
      return;
    }

    if (!formData.price || !formData.quantity) {
      alert("يجب إدخال السعر والكمية");
      return;
    }

    const baseProductData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      itemsPerBox: isBox ? Number(formData.itemsPerBox) : "",
      imageUrl,
      madeIn: formData.madeIn,
      details: formData.details,
    };

    if (editId) {
      await updateDoc(doc(db, "products", editId), baseProductData);
      setEditId(null);
    } else {
      const productRef = await addDoc(collection(db, "products"), baseProductData);

      if (isBox) {
        const childProduct = {
          name: `${formData.name} - قطعة`,
          price: Number(formData.pricePerPiece),
          quantity: Number(formData.quantity) * Number(formData.itemsPerBox),
          category: formData.category,
          type: "قطعة",
          itemsPerBox: "",
          imageUrl,
          parentId: productRef.id,
          madeIn: formData.madeIn,
          details: formData.details,
        };
        await addDoc(collection(db, "products"), childProduct);
      }
    }

    setFormData({
      name: "",
      price: "",
      pricePerPiece: "",
      quantity: "",
      category: "",
      type: "قطعة",
      itemsPerBox: "",
      madeIn: "",
      details: "",
    });
    setImage(null);
    setImagePreview(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      pricePerPiece: product.pricePerPiece || "",
      quantity: product.quantity,
      category: product.category,
      type: product.type || "قطعة",
      itemsPerBox: product.itemsPerBox || "",
      madeIn: product.madeIn || "",
      details: product.details || "",
    });
    setEditId(product.id);
    setImagePreview(product.imageUrl || null);
    setImage(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({
      name: "",
      price: "",
      pricePerPiece: "",
      quantity: "",
      category: "",
      type: "قطعة",
      itemsPerBox: "",
      madeIn: "",
      details: "",
    });
    setImage(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف المنتج؟")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setShowSuggestions(false);
    } else {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
  };

  const filteredProducts = products.filter((product) => {
    const searchText = searchQuery.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText);

    if (filterMode === "main") return matchesSearch && !product.parentId;
    if (filterMode === "sub") return matchesSearch && product.parentId;
    return matchesSearch;
  });

  const suggestionList = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery
  );

  const baseInputStyle = {
    padding: "10px 12px",
    margin: "8px 6px",
    borderRadius: 8,
    border: "1.5px solid #cbd5e1",
    fontSize: 16,
    outline: "none",
    transition: "0.3s",
    width: "calc(33.33% - 14px)",
    boxSizing: "border-box",
  };

  const styles = {
    container: {
      padding: 25,
      maxWidth: 1000,
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#222",
      backgroundColor: "#f9fafb",
      borderRadius: 15,
      boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      position: "relative",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#2a3a99",
      marginBottom: 20,
      textAlign: "center",
      letterSpacing: "1.5px",
    },
    form: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      marginBottom: 30,
      gap: 10,
    },
    input: {
      ...baseInputStyle,
    },
    inputFile: {
      marginTop: 10,
      marginBottom: 20,
      fontSize: 14,
      width: "100%",
      boxSizing: "border-box",
    },
    button: {
      backgroundColor: "#2a3a99",
      color: "white",
      padding: "12px 18px",
      border: "none",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 17,
      flexGrow: 1,
      transition: "background-color 0.3s",
      marginTop: 8,
    },
    buttonCancel: {
      backgroundColor: "#999",
      color: "white",
      padding: "12px 18px",
      border: "none",
      borderRadius: 12,
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 17,
      marginLeft: 10,
      marginTop: 8,
      flexGrow: 1,
      transition: "background-color 0.3s",
    },
    suggestionsList: {
      position: "absolute",
      top: "40px",
      width: "100%",
      maxHeight: 200,
      overflowY: "auto",
      backgroundColor: "#fff",
      borderRadius: 10,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 100,
    },
    suggestionItem: {
      padding: 12,
      borderBottom: "1px solid #eee",
      cursor: "pointer",
      fontSize: 14,
      color: "#333",
    },
    filtersContainer: {
      marginBottom: 20,
      display: "flex",
      justifyContent: "center",
      gap: 15,
    },
    filterButton: {
      padding: "8px 16px",
      borderRadius: 12,
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: 15,
      backgroundColor: "#e0e7ff",
      color: "#2a3a99",
      transition: "background-color 0.3s",
    },
    filterButtonActive: {
      backgroundColor: "#2a3a99",
      color: "#fff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
      borderRadius: 15,
      overflow: "hidden",
    },
    th: {
      padding: 14,
      backgroundColor: "#2a3a99",
      color: "white",
      fontWeight: "600",
      fontSize: 16,
      textAlign: "center",
      borderBottom: "3px solid #1e2a78",
    },
    td: {
      padding: 12,
      textAlign: "center",
      borderBottom: "1px solid #ddd",
      fontSize: 14,
      color: "#444",
    },
    img: {
      maxWidth: 50,
      maxHeight: 50,
      borderRadius: 6,
      objectFit: "cover",
    },
    actionButton: {
      padding: "6px 14px",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      margin: "0 3px",
      fontWeight: "600",
      fontSize: 14,
      transition: "background-color 0.3s",
      color: "white",
    },
    editButton: {
      backgroundColor: "#2563eb",
    },
    deleteButton: {
      backgroundColor: "#dc2626",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>إدارة منتجات التومي </h1>

      {/* أزرار الفلترة */}
      <div style={styles.filtersContainer}>
        <button
          style={{
            ...styles.filterButton,
            ...(filterMode === "all" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setFilterMode("all")}
          type="button"
        >
          عرض الكل
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filterMode === "main" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setFilterMode("main")}
          type="button"
        >
          عرض العناصر الرئيسية فقط
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filterMode === "sub" ? styles.filterButtonActive : {}),
          }}
          onClick={() => setFilterMode("sub")}
          type="button"
        >
          عرض العناصر الفرعية فقط
        </button>
      </div>

      {/* مربع البحث مع قائمة الاقتراحات */}
      <div style={{ position: "relative", marginBottom: 30 }}>
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ ...baseInputStyle, width: "100%" }}
          onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
          autoComplete="off"
          ref={suggestionsRef}
        />
        {showSuggestions && suggestionList.length > 0 && (
          <div style={styles.suggestionsList} ref={suggestionsRef}>
            {suggestionList.map((product) => (
              <div
                key={product.id}
                style={styles.suggestionItem}
                onClick={() => {
                  handleSuggestionClick(product);
                  setFormData({
                    ...formData,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                    type: product.type,
                    pricePerPiece: product.pricePerPiece || "",
                    itemsPerBox: product.itemsPerBox || "",
                    madeIn: product.madeIn || "",
                    details: product.details || "",
                  });
                  setShowSuggestions(false);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e0e7ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <strong>{product.name}</strong> | السعر: {product.price} | الكمية:{" "}
                {product.quantity} | النوع: {product.type} | القسم:{" "}
                {product.category}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* فورم الإضافة والتعديل */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <InputField
          placeholder="اسم المنتج"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={styles.input}
        />

        <InputField
          type="select"
          placeholder="اختر القسم"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
          options={categories}
          style={styles.input}
        />

        {/* حقل السعر */}
        <InputField
          type="number"
          placeholder="السعر"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          min={0}
          step="0.01"
          style={styles.input}
        />

        {/* حقل الكمية */}
        <InputField
          type="number"
          placeholder="الكمية"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          required
          min={0}
          step="1"
          style={styles.input}
        />

        {/* نوع العبوة */}
        <InputField
          type="select"
          placeholder="اختر النوع"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
          }
          required
          options={["قطعة", "صندوق"]}
          style={styles.input}
        />

        {/* سعر القطعة يظهر فقط لو النوع صندوق */}
        {formData.type === "صندوق" && (
          <>
            <InputField
              type="number"
              placeholder="سعر القطعة"
              value={formData.pricePerPiece}
              onChange={(e) =>
                setFormData({ ...formData, pricePerPiece: e.target.value })
              }
              required={formData.type === "صندوق"}
              min={0}
              step="0.01"
              style={styles.input}
            />
            <InputField
              type="number"
              placeholder="عدد القطع في الصندوق"
              value={formData.itemsPerBox}
              onChange={(e) =>
                setFormData({ ...formData, itemsPerBox: e.target.value })
              }
              required={formData.type === "صندوق"}
              min={1}
              step="1"
              style={styles.input}
            />
          </>
        )}

        {/* حقل بلد المنشأ */}
        <InputField
          placeholder="بلد المنشأ"
          value={formData.madeIn}
          onChange={(e) => setFormData({ ...formData, madeIn: e.target.value })}
          required
          style={styles.input}
        />

        {/* حقل تفاصيل المنتج (اختياري) */}
        <InputField
          type="textarea"
          placeholder="تفاصيل المنتج (اختياري)"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          required={false}
          style={{ ...styles.input, width: "100%" }}
        />

        <input
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
          }}
          type="file"
          accept="image/*"
          style={styles.inputFile}
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="معاينة المنتج"
            style={{ maxWidth: 150, borderRadius: 10, margin: "10px 0" }}
          />
        )}

        {loadingImage && <p style={{ margin: "10px 0" }}>جارٍ رفع الصورة...</p>}

        <div style={{ width: "100%", marginTop: 10, display: "flex", gap: 10 }}>
          <button type="submit" style={styles.button}>
            {editId ? "تحديث المنتج" : "إضافة المنتج"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={styles.buttonCancel}
            >
              إلغاء التعديل
            </button>
          )}
        </div>
      </form>

      {/* جدول المنتجات */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>الصورة</th>
            <th style={styles.th}>الاسم</th>
            <th style={styles.th}>القسم</th>
            <th style={styles.th}>بلد المنشأ</th>
            <th style={styles.th}>تفاصيل المنتج</th>
            <th style={styles.th}>سعر القطعة</th>
            <th style={styles.th}>السعر</th>
            <th style={styles.th}>الكمية</th>
            <th style={styles.th}>النوع</th>
            <th style={styles.th}>عدد القطع في الصندوق</th>
            <th style={styles.th}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan={11} style={{ textAlign: "center", padding: 20 }}>
                لا توجد منتجات مطابقة للبحث
              </td>
            </tr>
          )}
          {filteredProducts.map((product) => {
            const isSubProduct = !!product.parentId;
            return (
              <tr
                key={product.id}
                title={isSubProduct ? "قطعة فرعية" : "صندوق رئيسي"}
                style={{
                  backgroundColor: isSubProduct ? "#f9fafb" : "#e0e7ff",
                  fontStyle: isSubProduct ? "italic" : "normal",
                  color: isSubProduct ? "#555" : "#222",
                }}
              >
                <td style={styles.td}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      style={styles.img}
                    />
                  ) : (
                    "لا توجد صورة"
                  )}
                </td>
                <td style={styles.td}>{product.name}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>{product.madeIn || "-"}</td>
                <td style={styles.td}>{product.details || "-"}</td>
                <td style={styles.td}>{product.pricePerPiece || "-"}</td>
                <td style={styles.td}>{product.price}</td>
                <td style={styles.td}>{product.quantity}</td>
                <td style={styles.td}>{product.type}</td>
                <td style={styles.td}>{product.itemsPerBox || "-"}</td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.actionButton, ...styles.editButton }}
                    onClick={() => handleEdit(product)}
                    title="تعديل"
                  >
                    تعديل
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(product.id)}
                    title="حذف"
                  >
                    حذف
                  </button>
                  <button>
                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        ...styles.actionButton,
                        backgroundColor: "#21a1f3",
                        color: "#fff",
                        textDecoration: "none",
                        margin: "0 3px",
                        display: "inline-block",
                      }}
                      title="عرض تفاصيل المنتج"
                    >
                      عرض
                    </Link>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}