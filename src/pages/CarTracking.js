import React, { useState } from "react";

export default function CarTracking() {
  const [cars, setCars] = useState([
    { id: 1, brand: "تويوتا", driver: "أحمد", plate: "1234-س ع د", lat: 24.7136, lng: 46.6753, online: true },
    { id: 2, brand: "هيونداي", driver: "سلمان", plate: "5678-م ن ر", lat: 24.7743, lng: 46.7386, online: true },
  ]);
  const [brand, setBrand] = useState("");
  const [driver, setDriver] = useState("");
  const [plate, setPlate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [online, setOnline] = useState(true);

  const handleAddCar = (e) => {
    e.preventDefault();
    if (!brand || !driver || !plate || !lat || !lng) return;
    setCars([
      ...cars,
      {
        id: Date.now(),
        brand,
        driver,
        plate,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        online,
      }
    ]);
    setBrand(""); setDriver(""); setPlate(""); setLat(""); setLng(""); setOnline(true);
  };

  // مركز الخريطة على أول سيارة أو الرياض
  const centerLat = cars.length > 0 ? cars[0].lat : 24.7136;
  const centerLng = cars.length > 0 ? cars[0].lng : 46.6753;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #eee", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 16, color: "#21a1f3" }}>قسم تتبع المركبات</h2>
      <form onSubmit={handleAddCar} style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <input type="text" placeholder="ماركة المركبة" value={brand} onChange={e => setBrand(e.target.value)} style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <input type="text" placeholder="اسم السائق" value={driver} onChange={e => setDriver(e.target.value)} style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <input type="text" placeholder="رقم اللوحة" value={plate} onChange={e => setPlate(e.target.value)} style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <input type="number" step="any" placeholder="خط العرض (lat)" value={lat} onChange={e => setLat(e.target.value)} style={{ width: 120, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <input type="number" step="any" placeholder="خط الطول (lng)" value={lng} onChange={e => setLng(e.target.value)} style={{ width: 120, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: "bold" }}>
          <input type="checkbox" checked={online} onChange={e => setOnline(e.target.checked)} style={{ accentColor: "#21a1f3" }} />
          متصل الآن
        </label>
        <button type="submit" style={{ padding: "8px 18px", borderRadius: 6, background: "#21a1f3", color: "#fff", border: "none", fontWeight: "bold" }}>
          إضافة
        </button>
      </form>
      <div style={{ height: 400, width: "100%", borderRadius: 12, overflow: "hidden", margin: "0 auto 24px auto", boxShadow: "0 1px 8px #eee" }}>
        <iframe
          title="خريطة السيارات"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={`https://maps.google.com/maps?q=${centerLat},${centerLng}&z=12&output=embed`}
          allowFullScreen
        ></iframe>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fafbfc" }}>
        <thead>
          <tr style={{ background: "#f0f4fa" }}>
            <th style={{ padding: 8, border: "1px solid #eee" }}>#</th>
            <th style={{ padding: 8, border: "1px solid #eee" }}>الماركة</th>
            <th style={{ padding: 8, border: "1px solid #eee" }}>السائق</th>
            <th style={{ padding: 8, border: "1px solid #eee" }}>رقم اللوحة</th>
            <th style={{ padding: 8, border: "1px solid #eee" }}>الحالة</th>
            <th style={{ padding: 8, border: "1px solid #eee" }}>الموقع الحالي</th>
            <th style={{ padding: 8, border: "1px solid #eee" }}>عرض على الخريطة</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, idx) => (
            <tr key={car.id}>
              <td style={{ padding: 8, border: "1px solid #eee", textAlign: "center" }}>{idx + 1}</td>
              <td style={{ padding: 8, border: "1px solid #eee" }}>{car.brand}</td>
              <td style={{ padding: 8, border: "1px solid #eee" }}>{car.driver}</td>
              <td style={{ padding: 8, border: "1px solid #eee" }}>{car.plate}</td>
              <td style={{ padding: 8, border: "1px solid #eee", color: car.online ? "#21a1f3" : "#aaa", fontWeight: "bold" }}>
                {car.online ? "متصل" : "غير متصل"}
              </td>
              <td style={{ padding: 8, border: "1px solid #eee", fontSize: "0.95em", color: "#555" }}>
                {car.lat}, {car.lng}
              </td>
              <td style={{ padding: 8, border: "1px solid #eee" }}>
                <a
                  href={`https://maps.google.com/?q=${car.lat},${car.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#21a1f3", fontWeight: "bold" }}
                >
                  عرض
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}