import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        const res = await axios.get('/api/admin/payments');
        setPayments(res.data || []);
      } catch (e) {
        console.error(e);
        alert('Failed to load payments: ' + (e.response?.data?.message || e.message));
      }
    })();
  }, []);

  return (
    <div style={{padding:20}}>
      <h3>Payment History</h3>
      {payments.length === 0 ? <p>No payments (placeholder).</p> : (
        <ul>
          {payments.map(p => <li key={p.id}>{p.id} — {p.amount || ''} — {p.status || ''}</li>)}
        </ul>
      )}
    </div>
  );
};

export default AdminPayments;
