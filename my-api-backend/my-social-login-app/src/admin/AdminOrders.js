import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        const res = await axios.get('/api/admin/orders');
        setOrders(res.data || []);
      } catch (e) {
        console.error(e);
        alert('Failed to load orders: ' + (e.response?.data?.message || e.message));
      }
    })();
  }, []);

  return (
    <div style={{padding:20}}>
      <h3>Order History</h3>
      {orders.length === 0 ? <p>No orders (placeholder).</p> : (
        <ul>
          {orders.map(o => <li key={o.id}>{o.id} — {o.status || 'unknown'} — {o.total || ''}</li>)}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
