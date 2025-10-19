import React, { useEffect, useState } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      const t = { id, ...e.detail };
      setToasts(ts => [...ts, t]);
      setTimeout(() => setToasts(ts => ts.filter(x => x.id !== id)), e.detail.timeout || 3500);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  return (
    <div style={{position:'fixed',right:12,top:12,zIndex:9999}}>
      {toasts.map(t => (
        <div key={t.id} style={{background: t.type==='error' ? '#ff5252' : '#323232', color:'#fff', padding:'8px 12px', borderRadius:6, marginBottom:8, boxShadow:'0 6px 18px rgba(0,0,0,0.12)'}}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
