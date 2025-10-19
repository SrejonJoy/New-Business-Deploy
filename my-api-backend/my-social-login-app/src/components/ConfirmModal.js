import React, { useEffect, useState } from 'react';

export function showConfirm(message, title = 'Confirm') {
  return new Promise((resolve) => {
    const id = Date.now() + Math.random();
    // dispatch the modal event; the ConfirmModal listener will receive the detail including resolve
    window.dispatchEvent(new CustomEvent('app-confirm', { detail: { id, message, title, resolve } }));
  });
}

export default function ConfirmModal() {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setModal(e.detail);
    };
    window.addEventListener('app-confirm', handler);
    return () => window.removeEventListener('app-confirm', handler);
  }, []);

  if (!modal) return null;

  const ok = () => { modal.resolve(true); setModal(null); };
  const no = () => { modal.resolve(false); setModal(null); };

  return (
    <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10000}}>
      <div style={{position:'absolute',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)'}} />
      <div style={{background:'#fff',padding:20,borderRadius:8,boxShadow:'0 12px 40px rgba(0,0,0,0.2)',zIndex:10001,maxWidth:520,width:'90%'}}>
        <h3 style={{marginTop:0}}>{modal.title || 'Confirm'}</h3>
        <p>{modal.message}</p>
        <div style={{textAlign:'right'}}>
          <button onClick={no} style={{marginRight:8}}>No</button>
          <button onClick={ok} style={{background:'#d32f2f',color:'#fff'}}>Yes</button>
        </div>
      </div>
    </div>
  );
}
