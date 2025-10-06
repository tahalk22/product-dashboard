import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import QRCode from "react-qr-code";

function formatDate(timestamp) {
  if (!timestamp) return "-";
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const detailsRef = useRef();
  const [parentName, setParentName] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [imgModal, setImgModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    
    async function fetchProduct() {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);
          setAdminNotes(data.adminNotes || "");
          setHistory(data.history || []);
          setReviews(data.reviews || []);
        } else {
          setProduct(null);
        }
      } catch (error) {
        setProduct(null);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // جلب اسم الصنف الأب إذا كان المنتج صنف فرعي وليس لديه parentName
 useEffect(() => {
  async function fetchParentName() {
    if (product && product.parentId && !product.parentName) {
      try {
        const parentRef = doc(db, "products", product.parentId);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setParentName(parentSnap.data().name || "");
        }
      } catch (e) {
        setParentName("");
        console.error("Firestore error:", e);
      }
    }
  }
  fetchParentName();
}, [product]);

  // جلب منتجات مشابهة
  useEffect(() => {
    async function fetchSimilar() {
      if (product && product.category) {
        const q = query(
          collection(db, "products"),
          where("category", "==", product.category)
        );
        const snap = await getDocs(q);
        setSimilarProducts(
          snap.docs
            .filter((docu) => docu.id !== product.id)
            .map((docu) => ({ id: docu.id, ...docu.data() }))
            .slice(0, 4)
        );
      }
    }
    fetchSimilar();
  }, [product]);

  // نسخ رقم المنتج
  const handleCopy = () => {
    navigator.clipboard.writeText(product.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // مشاركة رابط المنتج
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `تفاصيل المنتج: ${product.name}`,
          url,
        });
        setShareMsg("تمت المشاركة بنجاح!");
      } catch {
        setShareMsg("تم إلغاء المشاركة.");
      }
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg("تم نسخ رابط المنتج!");
    }
    setTimeout(() => setShareMsg(""), 1500);
  };

  // طباعة أو تحويل إلى PDF
  const handlePrint = () => {
    window.print();
  };

  const handlePDF = async () => {
    if (!detailsRef.current) return;
    const canvas = await html2canvas(detailsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`تفاصيل_${product.name}.pdf`);
  };

  // تكبير الصورة
  const handleImgClick = () => setImgModal(true);
  const handleCloseModal = () => setImgModal(false);

  // الوضع الليلي
  const toggleDark = () => setDarkMode((d) => !d);

  // إضافة مراجعة
  const handleAddReview = () => {
    if (review.trim()) {
      setReviews((prev) => [
        ...prev,
        { text: review, date: new Date().toISOString() },
      ]);
      setReview("");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div className="lds-ring" style={{ margin: "60px auto" }}>
          <div></div><div></div><div></div><div></div>
        </div>
        <h2 style={styles.title}>جاري تحميل تفاصيل المنتج...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>المنتج غير موجود</h2>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          عودة
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.container,
        background: darkMode ? "#232526" : styles.container.background,
        color: darkMode ? "#fff" : "#232526",
      }}
    >
      <h2 style={styles.title}>تفاصيل المنتج</h2>
      <div style={styles.actions}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← عودة للمنتجات
        </button>
        <button style={styles.copyBtn} onClick={handleCopy}>
          {copied ? "تم نسخ رقم المنتج!" : "نسخ رقم المنتج"}
        </button>
        <button style={styles.printBtn} onClick={handlePrint}>
          🖨️ طباعة
        </button>
        <button style={styles.pdfBtn} onClick={handlePDF}>
          📄 PDF
        </button>
        <button style={styles.shareBtn} onClick={handleShare}>
          🔗 مشاركة
        </button>
        <button style={styles.editBtn} onClick={() => navigate(`/adminproducts?edit=${product.id}`)}>
          ✏️ تعديل
        </button>
        <button style={styles.darkBtn} onClick={toggleDark}>
          {darkMode ? "☀️ نهاري" : "🌙 ليلي"}
        </button>
        {shareMsg && <span style={styles.shareMsg}>{shareMsg}</span>}
      </div>
      <div ref={detailsRef} style={styles.card} className="product-details-card animate-pop">
        <div style={styles.imgBox}>
          {product.imageUrl ? (
            <>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={styles.img}
                onClick={handleImgClick}
                title="اضغط للتكبير"
              />
              {imgModal && (
                <div style={styles.modalOverlay} onClick={handleCloseModal}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={styles.modalImg}
                  />
                </div>
              )}
            </>
          ) : (
            <div style={styles.noImg}>لا توجد صورة</div>
          )}
        </div>
        <div style={styles.info}>
          <h3 style={styles.productName}>{product.name}</h3>
          <div style={styles.row}>
            <span style={styles.label}>رقم المنتج:</span>
            <span style={{ userSelect: "all" }}>{product.id}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>القسم:</span>
            <span>{product.category || "-"}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>النوع:</span>
            <span>{product.type || "-"}</span>
          </div>
          {product.type === "صندوق" && (
            <div style={styles.row}>
              <span style={styles.label}>عدد القطع في الصندوق:</span>
              <span>{product.itemsPerBox || "-"}</span>
            </div>
          )}
          <div style={styles.row}>
            <span style={styles.label}>السعر:</span>
            <span>
              {product.price ? `${product.price} د.ل` : "-"}
              {product.type === "صندوق" && product.pricePerPiece
                ? ` (سعر القطعة: ${product.pricePerPiece} د.ل)`
                : ""}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>الكمية:</span>
            <span>
              {product.quantity}{" "}
              <span style={{ color: "#888", fontSize: "0.9em" }}>
                {product.unit || (product.type === "صندوق" ? "صندوق" : "قطعة")}
              </span>
            </span>
          </div>
          {product.status && (
            <div style={styles.row}>
              <span style={styles.label}>الحالة:</span>
              <span style={{
                color:
                  product.status === "نشط"
                    ? "#16a34a"
                    : product.status === "متوقف"
                    ? "#f59e42"
                    : "#ff4d4f",
                fontWeight: "bold",
              }}>
                {product.status}
              </span>
            </div>
          )}
          {product.parentId && (
            <div style={styles.row}>
              <span style={styles.label}>صنف فرعي من:</span>
              <span>
                {product.parentName
                  ? product.parentName
                  : parentName
                  ? parentName
                  : "—"}
              </span>
            </div>
          )}
          <div style={styles.row}>
            <span style={styles.label}>تاريخ الإضافة:</span>
            <span>
              {product.createdAt ? formatDate(product.createdAt) : "-"}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>آخر تعديل:</span>
            <span>
              {product.updatedAt
                ? formatDate(product.updatedAt)
                : product.createdAt
                ? formatDate(product.createdAt)
                : "-"}
            </span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>QR:</span>
            <span>
              <QRCode
                value={window.location.href}
                size={120}
                bgColor={darkMode ? "#232526" : "#fff"}
                fgColor="#21a1f3"
                level="H"
                includeMargin={false}
              />
            </span>
          </div>
        </div>
      </div>
      {/* سجل التعديلات */}
      {history.length > 0 && (
        <div style={styles.historyBox}>
          <h4 style={styles.historyTitle}>سجل التعديلات</h4>
          <table style={styles.historyTable}>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>من</th>
                <th>الوصف</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{formatDate(h.date)}</td>
                  <td>{h.user || "-"}</td>
                  <td>{h.desc || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* ملاحظات إدارية */}
      <div style={styles.notesBox}>
        <button style={styles.notesBtn} onClick={() => setShowNotes((v) => !v)}>
          📝 {showNotes ? "إخفاء" : "عرض"} الملاحظات الإدارية
        </button>
        {showNotes && (
          <div style={styles.notesContent}>
            {adminNotes ? adminNotes : "لا توجد ملاحظات."}
          </div>
        )}
      </div>
      {/* مراجعات العملاء */}
      <div style={styles.reviewsBox}>
        <h4 style={styles.reviewsTitle}>مراجعات العملاء</h4>
        <div>
          <input
            style={styles.reviewInput}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="اكتب مراجعتك هنا..."
          />
          <button style={styles.reviewBtn} onClick={handleAddReview}>
            إضافة
          </button>
        </div>
        <ul style={styles.reviewsList}>
          {reviews.length === 0 && <li>لا توجد مراجعات بعد.</li>}
          {reviews.map((r, i) => (
            <li key={i}>
              <span>{r.text}</span>
              <span style={{ color: "#888", fontSize: "0.8em", marginRight: 8 }}>
                {formatDate(r.date)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* منتجات مشابهة */}
      {similarProducts.length > 0 && (
        <div style={styles.similarBox}>
          <h4 style={styles.similarTitle}>منتجات مشابهة</h4>
          <div style={styles.similarList}>
            {similarProducts.map((p) => (
              <div
                key={p.id}
                style={styles.similarCard}
                onClick={() => navigate(`/products/${p.id}`)}
                title={p.name}
              >
                <img
                  src={p.imageUrl || "https://via.placeholder.com/80x80?text=No+Image"}
                  alt={p.name}
                  style={styles.similarImg}
                />
                <div style={styles.similarName}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={styles.animBar}>
        <div style={{
          ...styles.animFill,
          width: `${Math.min(100, product.quantity)}%`,
          background: product.quantity > 0
            ? "linear-gradient(90deg,#7ed957,#21a1f3)"
            : "#ff4d4f"
        }} />
        <span style={styles.animText}>
          {product.quantity > 0
            ? `المخزون: ${product.quantity} متوفر`
            : "نفد المخزون"}
        </span>
      </div>
      <style>
        {`
        .lds-ring {
          display: inline-block;
          position: relative;
          width: 64px;
          height: 64px;
        }
        .lds-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 51px;
          height: 51px;
          margin: 6px;
          border: 6px solid #21a1f3;
          border-radius: 50%;
          animation: lds-ring 1.2s cubic-bezier(0.5,0,0.5,1) infinite;
          border-color: #21a1f3 transparent transparent transparent;
        }
        .lds-ring div:nth-child(1) { animation-delay: -0.45s; }
        .lds-ring div:nth-child(2) { animation-delay: -0.3s; }
        .lds-ring div:nth-child(3) { animation-delay: -0.15s; }
        @keyframes lds-ring {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        .product-details-card.animate-pop {
          animation: pop-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes pop-in {
          0% { transform: scale(0.7) rotate(-3deg); opacity: 0; }
          80% { transform: scale(1.05) rotate(1deg);}
          100% { transform: scale(1) rotate(0); opacity: 1;}
        }
        .modal-overlay {
          position: fixed;
          top:0; left:0; right:0; bottom:0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-overlay img {
          max-width: 90vw;
          max-height: 90vh;
          border-radius: 16px;
          box-shadow: 0 4px 24px #21a1f399;
          background: #fff;
        }
        @media print {
          body * { visibility: hidden !important; }
          .product-details-card, .product-details-card * {
            visibility: visible !important;
            color: #000 !important;
            background: #fff !important;
          }
          .product-details-card {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
          }
        }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px #21a1f322",
    padding: "32px 18px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    direction: "rtl",
    minHeight: 400,
    position: "relative",
  },
  title: {
    textAlign: "center",
    color: "#2a3a99",
    fontWeight: "bold",
    fontSize: "2em",
    marginBottom: 24,
    letterSpacing: 1,
  },
  card: {
    display: "flex",
    gap: 32,
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    background: "linear-gradient(90deg,#f8fafc 60%,#e0e7ff 100%)",
    borderRadius: 16,
    boxShadow: "0 2px 12px #21a1f322",
    padding: "24px 18px",
    transition: "box-shadow 0.3s",
  },
  imgBox: {
    minWidth: 180,
    minHeight: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4fa",
    borderRadius: 16,
    boxShadow: "0 2px 8px #21a1f355",
    position: "relative",
    cursor: "pointer",
  },
  img: {
    width: 180,
    height: 180,
    objectFit: "cover",
    borderRadius: 16,
    border: "3px solid #e0e7ff",
    background: "#f8fafc",
    boxShadow: "0 2px 8px #21a1f355",
    transition: "transform 0.3s",
    cursor: "zoom-in",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modalImg: {
    maxWidth: "90vw",
    maxHeight: "90vh",
    borderRadius: 16,
    boxShadow: "0 4px 24px #21a1f399",
    background: "#fff",
  },
  noImg: {
    color: "#aaa",
    fontSize: 18,
    textAlign: "center",
  },
  info: {
    flex: 1,
    minWidth: 180,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "center",
  },
  productName: {
    color: "#232526",
    fontWeight: "bold",
    fontSize: "1.4em",
    marginBottom: 8,
    letterSpacing: 1,
  },
  row: {
    display: "flex",
    gap: 8,
    fontSize: "1.08em",
    marginBottom: 2,
    alignItems: "center",
  },
  label: {
    color: "#21a1f3",
    fontWeight: "bold",
    minWidth: 110,
  },
  actions: {
    display: "flex",
    gap: 14,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  backBtn: {
    background: "linear-gradient(90deg,#21a1f3,#61dafb)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #21a1f355",
    transition: "background 0.2s",
  },
  copyBtn: {
    background: "linear-gradient(90deg,#7ed957,#21a1f3)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #21a1f355",
    transition: "background 0.2s",
  },
  printBtn: {
    background: "linear-gradient(90deg,#fbbf24,#f59e42)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #fbbf2455",
    transition: "background 0.2s",
  },
  pdfBtn: {
    background: "linear-gradient(90deg,#232526,#414345)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #23252655",
    transition: "background 0.2s",
  },
  shareBtn: {
    background: "linear-gradient(90deg,#21a1f3,#7ed957)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #21a1f355",
    transition: "background 0.2s",
  },
  editBtn: {
    background: "linear-gradient(90deg,#f59e42,#fbbf24)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #fbbf2455",
    transition: "background 0.2s",
  },
  darkBtn: {
    background: "linear-gradient(90deg,#232526,#414345)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "10px 24px",
    fontWeight: "bold",
    fontSize: "1.05em",
    cursor: "pointer",
    boxShadow: "0 2px 8px #23252655",
    transition: "background 0.2s",
  },
  shareMsg: {
    color: "#21a1f3",
    fontWeight: "bold",
    marginRight: 10,
    fontSize: "1em",
    alignSelf: "center",
  },
  animBar: {
    margin: "30px auto 0 auto",
    width: "90%",
    height: 18,
    background: "#e0e7ef",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 1px 6px #21a1f311",
  },
  animFill: {
    height: "100%",
    borderRadius: 10,
    transition: "width 0.7s",
  },
  animText: {
    position: "absolute",
    left: 12,
    top: 0,
    height: "100%",
    display: "flex",
    alignItems: "center",
    color: "#232526",
    fontWeight: "bold",
    fontSize: "1em",
    letterSpacing: 1,
  },
  historyBox: {
    margin: "24px 0",
    background: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 6px #21a1f311",
  },
  historyTitle: {
    color: "#2a3a99",
    fontWeight: "bold",
    marginBottom: 8,
  },
  historyTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.98em",
  },
  notesBox: {
    margin: "18px 0",
    textAlign: "center",
  },
  notesBtn: {
    background: "linear-gradient(90deg,#21a1f3,#7ed957)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "7px 18px",
    fontWeight: "bold",
    fontSize: "1em",
    cursor: "pointer",
    marginBottom: 8,
  },
  notesContent: {
    background: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    color: "#232526",
    fontSize: "1.05em",
    textAlign: "right",
  },
  reviewsBox: {
    margin: "18px 0",
    background: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 6px #21a1f311",
  },
  reviewsTitle: {
    color: "#2a3a99",
    fontWeight: "bold",
    marginBottom: 8,
  },
  reviewInput: {
    padding: "7px 12px",
    borderRadius: 8,
    border: "1px solid #e0e7ef",
    marginLeft: 8,
    fontSize: "1em",
    width: 220,
    maxWidth: "90%",
  },
  reviewBtn: {
    background: "linear-gradient(90deg,#21a1f3,#7ed957)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px 18px",
    fontWeight: "bold",
    fontSize: "1em",
    cursor: "pointer",
  },
  reviewsList: {
    listStyle: "none",
    padding: 0,
    marginTop: 10,
    color: "#232526",
  },
  similarBox: {
    margin: "24px 0",
    background: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 6px #21a1f311",
  },
  similarTitle: {
    color: "#2a3a99",
    fontWeight: "bold",
    marginBottom: 8,
  },
  similarList: {
    display: "flex",
    gap: 18,
    flexWrap: "wrap",
  },
  similarCard: {
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 1px 6px #21a1f322",
    padding: 8,
    width: 110,
    textAlign: "center",
    cursor: "pointer",
    transition: "box-shadow 0.2s,transform 0.2s",
    border: "1px solid #e0e7ef",
  },
  similarImg: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 6,
  },
  similarName: {
    fontWeight: "bold",
    fontSize: "1em",
    color: "#232526",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};