import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", quantity: "" });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = ""; // سيتم تخزين الرابط هنا

      // رفع الصورة إذا تم اختيارها
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image); // رفع الصورة إلى Firebase Storage
        imageUrl = await getDownloadURL(imageRef); // الحصول على رابط الصورة
      }

      // إعداد البيانات التي سيتم تخزينها في Firestore
      const data = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        imageUrl, // تخزين رابط الصورة هنا
      };

      // إذا كان هناك ID (تعديل منتج موجود)، نقوم بالتحديث، إذا لا، نقوم بإضافة منتج جديد
      if (editId) {
        await updateDoc(doc(db, "products", editId), data);
        setEditId(null);
      } else {
        await addDoc(collection(db, "products"), data);
      }

      // إعادة تعيين البيانات بعد الإرسال
      setFormData({ name: "", price: "", quantity: "" });
      setImage(null);
      fetchProducts(); // تحديث قائمة المنتجات
      setLoading(false);
      setMessage("تم حفظ المنتج بنجاح!");

    } catch (error) {
      setLoading(false);
      setMessage("حدث خطأ أثناء حفظ البيانات.");
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, quantity: product.quantity });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteDoc(doc(db, "products", id));
    fetchProducts(); // تحديث قائمة المنتجات
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>لوحة التحكم</h2>
      {message && <p>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="اسم المنتج"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="السعر"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="الكمية"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        
        <input
          type="text"
          placeholder="بلد الصنع"
          value={formData.madeIn}
          onChange={(e) => setFormData({ ...formData, madeIn: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])} // عند اختيار الصورة، نقوم بتخزينها
        />
        <button type="submit" disabled={loading}>
          {loading ? "جاري الإرسال..." : editId ? "تحديث المنتج" : "إضافة المنتج"}
        </button>
      </form>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>السعر</th>
            <th>الكمية</th>
            <th>بلد المنشأ</th>
            <th>الصورة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price} د.ل</td>
              <td>{product.quantity}</td>
               <td>{product.madeIn}</td>
              <td>
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} width="50" />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(product)}>تعديل</button>
                <button onClick={() => handleDelete(product.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
