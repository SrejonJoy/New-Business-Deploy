import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const buttonBase = {
  padding: '14px 20px',
  fontSize: '16px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer',
  margin: '6px 8px',
  minWidth: '180px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
};

const activeExtra = {
  border: '1px solid #0b5fff',
  boxShadow: '0 6px 18px rgba(11,95,255,0.12)',
  background: 'linear-gradient(180deg,#fff,#f0f6ff)'
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (p) => () => navigate(p);
  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  return (
    <div style={{ padding: 22 }}>
      <h2>Admin Control Panel</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }} role="tablist">
        <button
          type="button"
          onClick={go('/admin/roles')}
          aria-pressed={isActive('/admin/roles')}
          style={{ ...(isActive('/admin/roles') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Role Management
        </button>

        <button
          type="button"
          onClick={go('/admin/orders')}
          aria-pressed={isActive('/admin/orders')}
          style={{ ...(isActive('/admin/orders') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Order History
        </button>

        <button
          type="button"
          onClick={go('/admin/payments')}
          aria-pressed={isActive('/admin/payments')}
          style={{ ...(isActive('/admin/payments') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Payment History
        </button>

        <button
          type="button"
          onClick={go('/admin/jersey')}
          aria-pressed={isActive('/admin/jersey')}
          style={{ ...(isActive('/admin/jersey') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Add a Jersey
        </button>

        <button
          type="button"
          onClick={go('/admin/jersey/edit')}
          aria-pressed={isActive('/admin/jersey/edit')}
          style={{ ...(isActive('/admin/jersey/edit') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Edit Jersey
        </button>

        <button
          type="button"
          onClick={go('/admin/jersey/remove')}
          aria-pressed={isActive('/admin/jersey/remove')}
          style={{ ...(isActive('/admin/jersey/remove') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Remove Jersey
        </button>

        <button
          type="button"
          onClick={go('/admin/jersey/discount')}
          aria-pressed={isActive('/admin/jersey/discount')}
          style={{ ...(isActive('/admin/jersey/discount') ? { ...buttonBase, ...activeExtra } : buttonBase) }}
        >
          Discount Jersey
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <Outlet />
      </div>
    </div>
  );
}
