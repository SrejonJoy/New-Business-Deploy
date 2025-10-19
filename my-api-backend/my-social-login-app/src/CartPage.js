import React, { useEffect, useState } from 'react';
import { cartGet, cartUpdateItem, cartRemoveItem } from './utils/cart';
import { useNavigate } from 'react-router-dom';
import { formatTaka } from './utils/format';

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => { setItems(cartGet()); }, []);
  const navigate = useNavigate();

  // no-op: updates happen via per-item APIs and via cartGet()

  const total = items.reduce((s, it) => s + (Number(it.price || 0) * (it.qty || 1)), 0);

  return (
    <div style={{padding:24,display:'grid',gridTemplateColumns:'1fr 360px',gap:24}}>
      <div>
        <h2>Your Cart</h2>
        {items.length === 0 ? <p>Your cart is empty.</p> : (
          <div style={{display:'grid',gap:12}}>
            {items.map(it => (
              <div key={it.key} style={{display:'flex',gap:12,alignItems:'center',border:'1px solid #eee',padding:12,borderRadius:8}}>
                <div style={{width:84,height:84,background:'#f6f6f6'}}>
                  {it.image ? <img src={it.image} alt={it.title} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : null}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{it.title}</div>
                  <div>Size: {it.size || 'N/A'}</div>
                  <div style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
                    <button onClick={async () => { const newQty = Math.max(1, (it.qty||1)-1); await cartUpdateItem(it.key, newQty); setItems(cartGet()); }} style={smallBtn}>−</button>
                    <div style={{minWidth:32,textAlign:'center'}}>{it.qty}</div>
                    <button onClick={async () => { const newQty = (it.qty||1)+1; await cartUpdateItem(it.key, newQty); setItems(cartGet()); }} style={smallBtn}>+</button>
                    <button onClick={async () => { await cartRemoveItem(it.key); setItems(cartGet()); }} style={{marginLeft:12,color:'#fff',background:'#d32f2f',border:'none',padding:'8px 10px',borderRadius:6}}>Remove</button>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontWeight:700}}>{formatTaka(Number(it.price) * (it.qty || 1))}</div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      <aside style={{position:'relative'}}>
        <div style={{position:'sticky',top:24,padding:16,border:'1px solid #eee',borderRadius:8,background:'#fff'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{fontWeight:700}}>Order Summary</div>
            <div style={{color:'#999'}}>{items.length} items</div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><div>Subtotal</div><div>{formatTaka(total)}</div></div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><div>Shipping</div><div>{formatTaka(0)}</div></div>
          <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:18,marginBottom:16}}><div>Total</div><div>{formatTaka(total)}</div></div>
          <button style={{width:'100%',background:'#0b5fff',color:'#fff',padding:'12px 14px',borderRadius:8,border:'none',fontWeight:700}}>Proceed to Checkout</button>
          <button onClick={() => navigate('/dashboard')} style={{width:'100%',marginTop:8,background:'#fff',color:'#0b5fff',padding:'10px 12px',borderRadius:8,border:'1px solid #0b5fff'}}>Continue Shopping</button>
        </div>
      </aside>
    </div>
  );
}

const smallBtn = {
  border: '1px solid #ddd',
  background: '#fff',
  padding: '6px 10px',
  borderRadius: 6,
  cursor: 'pointer'
};
