// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// export default function Orders() {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, 'invoices'), (snapshot) => {
//       const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       const activeOrders = fetchedOrders.filter(order => order.status !== 'تم التنفيذ');
//       setOrders(activeOrders);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     const orderRef = doc(db, 'invoices', orderId);
//     await updateDoc(orderRef, { status: newStatus });
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">إدارة الطلبات</h1>
//       {orders.length === 0 ? (
//         <p>لا توجد طلبات حالياً.</p>
//       ) : (
//         <table className="w-full border border-gray-300 text-right">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border">الاسم</th>
//               <th className="p-2 border">رقم الهاتف</th>
//               <th className="p-2 border">العنوان</th>
//               <th className="p-2 border">المجموع</th>
//               <th className="p-2 border">الحالة</th>
//               <th className="p-2 border">إجراء</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map(order => (
//               <tr key={order.id} className="border-t">
//                 <td className="p-2 border">{order.fullName}</td>
//                 <td className="p-2 border">{order.phone}</td>
//                 <td className="p-2 border">{order.shippingAddress}</td>
//                 <td className="p-2 border">{order.totalAmount} د.ل</td>
//                 <td className="p-2 border">{order.status}</td>
//                 <td className="p-2 border">
//                   <select
//                     className="p-1 border rounded"
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                   >
//                     <option value="جديد">جديد</option>
//                     <option value="قيد التنفيذ">قيد التنفيذ</option>
//                     <option value="تم الشحن">تم الشحن</option>
//                     <option value="تم التنفيذ">تم التنفيذ</option>
//                   </select>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }



import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'invoices'), (snapshot) => {
      if (isUpdatingRef.current) return;
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const activeOrders = fetchedOrders.filter(order => order.status !== 'تم التنفيذ');
      setOrders(activeOrders);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedOrderId(orderId);
    setPendingStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrderId || !pendingStatus) return;

    const orderRef = doc(db, 'invoices', selectedOrderId);

    try {
      isUpdatingRef.current = true;
      await updateDoc(orderRef, { status: pendingStatus });
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setShowModal(false);
      setSelectedOrderId(null);
      setPendingStatus('');
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 500);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #4b6cb7, #182848);
          color: #333;
          direction: rtl;
        }
        .container {
          max-width: 1200px;
          margin: 40px auto;
          background: #fff;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          font-size: 2.5rem;
          color: #182848;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px 16px;
          text-align: center;
          border-bottom: 1px solid #ccc;
        }
        thead {
          background: #4b6cb7;
          color: white;
        }
        tr:hover {
          background: #f5f7ff;
        }
        select {
          padding: 5px 10px;
          border: 1px solid #4b6cb7;
          border-radius: 5px;
        }
        .status {
          padding: 5px 10px;
          border-radius: 10px;
          font-weight: bold;
        }
        .new { background: #f9d342; color: #000; }
        .inProgress { background: #69b34c; color: #fff; }
        .shipped { background: #4a90e2; color: #fff; }
        .completed { background: #888; color: #fff; }
        .no-orders {
          text-align: center;
          font-size: 1.2rem;
          color: white;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 90%;
          max-width: 400px;
          text-align: center;
        }
        .modal-buttons {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        .btn {
          padding: 10px 20px;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .btn-confirm {
          background: #4b6cb7;
          color: white;
        }
        .btn-cancel {
          background: #ccc;
          color: #333;
        }
      `}</style>

      <div className="container">
        <h1>إدارة الطلبات</h1>
        {orders.length === 0 ? (
          <p className="no-orders">لا توجد طلبات حالياً.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الهاتف</th>
                <th>العنوان</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>تغيير الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.fullName}</td>
                  <td>{order.phone}</td>
                  <td>{order.shippingAddress}</td>
                  <td>{order.totalAmount} د.ل</td>
                  <td>
                    <span className={`status ${
                      order.status === 'جديد' ? 'new' :
                      order.status === 'قيد التنفيذ' ? 'inProgress' :
                      order.status === 'تم الشحن' ? 'shipped' :
                      'completed'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="جديد">جديد</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="تم الشحن">تم الشحن</option>
                      <option value="تم التنفيذ">تم التنفيذ</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>تأكيد التغيير</h2>
            <p>هل أنت متأكد من تغيير الحالة إلى <strong>{pendingStatus}</strong>؟</p>
            <div className="modal-buttons">
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>إلغاء</button>
              <button className="btn btn-confirm" onClick={confirmStatusChange}>تأكيد</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
