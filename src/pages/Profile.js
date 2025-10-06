import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Profile() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    phone: "",
  });
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        phone: user.phoneNumber || "",
      });
      // جلب بيانات إضافية من Firestore إذا كانت موجودة
      const fetchExtra = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        }
      };
      fetchExtra();
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(user, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
      });
      await updateDoc(doc(db, "users", user.uid), {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        phone: profile.phone,
      });
      setMsg("تم حفظ التعديلات بنجاح");
      setEdit(false);
    } catch (e) {
      setMsg("حدث خطأ أثناء الحفظ");
    }
    setTimeout(() => setMsg(""), 2000);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>يجب تسجيل الدخول أولاً</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>الملف الشخصي</h2>
      <div style={styles.card}>
        <div style={styles.avatarBox}>
          <img
            src={profile.photoURL || "https://ui-avatars.com/api/?name=" + (profile.displayName || "User")}
            alt="avatar"
            style={styles.avatar}
          />
        </div>
        <div style={styles.info}>
          <div style={styles.row}>
            <span style={styles.label}>الاسم:</span>
            {edit ? (
              <input
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                style={styles.input}
              />
            ) : (
              <span>{profile.displayName || "-"}</span>
            )}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>البريد:</span>
            <span>{profile.email}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>رقم الهاتف:</span>
            {edit ? (
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={styles.input}
              />
            ) : (
              <span>{profile.phone || "-"}</span>
            )}
          </div>
          <div style={styles.row}>
            <span style={styles.label}>الصورة:</span>
            {edit ? (
              <input
                name="photoURL"
                value={profile.photoURL}
                onChange={handleChange}
                style={styles.input}
              />
            ) : (
              <span style={{ direction: "ltr", fontSize: "0.9em" }}>
                {profile.photoURL ? profile.photoURL.slice(0, 30) + "..." : "-"}
              </span>
            )}
          </div>
          <div style={styles.actions}>
            {edit ? (
              <>
                <button style={styles.saveBtn} onClick={handleSave}>حفظ</button>
                <button style={styles.cancelBtn} onClick={() => setEdit(false)}>إلغاء</button>
              </>
            ) : (
              <button style={styles.editBtn} onClick={() => setEdit(true)}>تعديل</button>
            )}
          </div>
          {msg && <div style={styles.msg}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: "40px auto",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 4px 24px #21a1f322",
    padding: "32px 18px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    direction: "rtl",
    minHeight: 300,
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
    gap: 24,
    alignItems: "flex-start",
    background: "#f8fafc",
    borderRadius: 16,
    boxShadow: "0 2px 12px #21a1f322",
    padding: "24px 18px",
    flexWrap: "wrap",
  },
  avatarBox: {
    minWidth: 120,
    minHeight: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4fa",
    borderRadius: 16,
    boxShadow: "0 2px 8px #21a1f355",
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: "50%",
    border: "3px solid #e0e7ff",
    background: "#f8fafc",
    boxShadow: "0 2px 8px #21a1f355",
  },
  info: {
    flex: 1,
    minWidth: 180,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    justifyContent: "center",
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
    minWidth: 90,
  },
  input: {
    padding: "7px 12px",
    borderRadius: 8,
    border: "1px solid #e0e7ef",
    fontSize: "1em",
    width: 220,
    maxWidth: "90%",
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  editBtn: {
    background: "linear-gradient(90deg,#21a1f3,#7ed957)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "7px 18px",
    fontWeight: "bold",
    fontSize: "1em",
    cursor: "pointer",
  },
  saveBtn: {
    background: "linear-gradient(90deg,#7ed957,#21a1f3)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "7px 18px",
    fontWeight: "bold",
    fontSize: "1em",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "linear-gradient(90deg,#f59e42,#fbbf24)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "7px 18px",
    fontWeight: "bold",
    fontSize: "1em",
    cursor: "pointer",
  },
  msg: {
    color: "#21a1f3",
    fontWeight: "bold",
    marginTop: 10,
    fontSize: "1em",
  },
};