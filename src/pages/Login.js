// src/pages/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // يعاد التوجيه حسب الدور لاحقاً
    } catch (error) {
      alert("خطأ في الدخول: " + error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>تسجيل الدخول</h2>
      <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <br />
      <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="submit">دخول</button>
    </form>
  );
}
