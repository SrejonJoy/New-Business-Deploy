import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AdminJerseyDiscount() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) {
      const fetchList = async () => {
        try {
          const res = await axios.get('/api/admin/products');
          setProducts(res.data || []);
        } catch (e) {
          console.error(e);
          alert('Failed to load products');
        }
      };
      fetchList();
      return;
    }
    const fetch = async () => {
      try {
        const res = await axios.get('/api/admin/products');
        const p = res.data.find(x => String(x.id) === String(id));
        if (!p) { alert('Product not found'); navigate('/admin/jersey'); return; }
        setProduct(p);
      } catch (e) {
        console.error(e);
        alert('Failed to load product');
      }
    };
    fetch();
  }, [id, navigate]);

  const apply = async () => {
    if (!id) return;
    if (!value) return alert('Please enter discount value');
    try {
      await axios.get('/sanctum/csrf-cookie');
      await axios.post(`/api/admin/products/${id}/discount`, { type, value });
      alert('Discount applied');
      navigate('/admin/jersey');
    } catch (e) {
      console.error(e);
      alert('Discount failed: ' + (e.response?.data?.message || e.message));
    }
  };

  if (!id) {
    return (
      <div style={{padding:20}}>
        <h3>Select a jersey to discount</h3>
        {products.length === 0 ? <p>No products.</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {products.map(p => (
              <div key={p.id} style={{border:'1px solid #eee',padding:12,borderRadius:8}}>
                <div style={{fontWeight:700}}>{p.title}</div>
                <div style={{color:'#666'}}>{p.team_name || ''}</div>
                <div style={{marginTop:8}}>
                  <button onClick={() => navigate(`/admin/jersey/discount?id=${p.id}`)}>Discount</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!product) return <div><p>Loading product...</p></div>;

  return (
    <div style={{padding:20}}>
      <h3>Apply Discount to Jersey #{product.id}</h3>
      <p><strong>{product.title}</strong> — {product.team_name || ''} ({product.league || ''})</p>
      <p>Price: {product.price} — Prev: {product.prev_price || 'N/A'}</p>
      <div style={{marginBottom:8}}>
        <label>
          <input type="radio" checked={type==='percent'} onChange={() => setType('percent')} /> Percent
        </label>
        <label style={{marginLeft:12}}>
          <input type="radio" checked={type==='fixed'} onChange={() => setType('fixed')} /> Fixed
        </label>
      </div>
      <div style={{marginBottom:8}}>
        <label>Value: <input value={value} onChange={e => setValue(e.target.value)} /></label>
      </div>
      <button onClick={apply}>Apply Discount</button>
      <button onClick={() => navigate('/admin/jersey')} style={{marginLeft:8}}>Cancel</button>
    </div>
  );
}
