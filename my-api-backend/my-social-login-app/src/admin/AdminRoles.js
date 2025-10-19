import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRoles = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        const res = await axios.get('/api/admin/users');
        setUsers(res.data || []);
      } catch (e) {
        console.error(e);
        alert('Failed to load users: ' + (e.response?.data?.message || e.message));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await axios.post(`/api/admin/users/${id}/role`, { role });
      setUsers((u) => u.map(x => x.id === id ? { ...x, role } : x));
    } catch (e) {
      console.error('Update failed', e);
      alert('Update failed: ' + (e.response?.data?.message || e.message));
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div style={{padding:20}}>
      <h3>Role Management</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderTop:'1px solid #eee'}}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role || '—'}</td>
              <td>
                <button onClick={() => updateRole(u.id, 'user')}>Set user</button>
                <button onClick={() => updateRole(u.id, 'admin')} style={{marginLeft:8}}>Set admin</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoles;
