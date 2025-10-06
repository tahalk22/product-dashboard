// src/pages/AddUser.jsx
import React, { useState } from "react";

export default function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5000/api/create-user",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.text();
      setMessage(data);
    } catch (err) {
      setMessage("فشل في إنشاء المستخدم");
    }
  };

  return (
    <div>
      <h2>إضافة مستخدم جديد</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">مستخدم</option>
          <option value="admin">مدير</option>
        </select>
        <br />
        <button type="submit">إنشاء</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
