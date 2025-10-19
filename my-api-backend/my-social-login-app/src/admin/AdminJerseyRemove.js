import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import { showConfirm } from '../components/ConfirmModal';

// use showConfirm from ConfirmModal which dispatches the event and returns a Promise

export default function AdminJerseyRemove() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
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

  const remove = async () => {
    if (!id) return;
    try {
      const confirmed = await showConfirm('Are you sure you want to delete this product?');
      if (!confirmed) return;
      await axios.get('/sanctum/csrf-cookie');
      await axios.delete(`/api/admin/products/${id}`);
      showToast('Deleted', 'success');
      navigate('/admin/jersey');
    } catch (e) {
      console.error(e);
      showToast('Delete failed: ' + (e.response?.data?.message || e.message), 'error');
    }
  };

  if (!id) {
    return (
      <div style={{padding:20}}>
        <h3>Select a jersey to delete</h3>
        {products.length === 0 ? <p>No products.</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {products.map(p => (
              <div key={p.id} style={{border:'1px solid #eee',padding:12,borderRadius:8}}>
                <div style={{fontWeight:700}}>{p.title}</div>
                <div style={{color:'#666'}}>{p.team_name || ''}</div>
                <div style={{marginTop:8}}>
                  <button onClick={async () => {
                    try {
                      const confirmed = await showConfirm('Delete "' + p.title + '"?');
                      if (!confirmed) return;
                      await axios.get('/sanctum/csrf-cookie');
                      await axios.delete(`/api/admin/products/${p.id}`);
                      showToast('Deleted', 'success');
                      // refresh list
                      setProducts(products.filter(x => x.id !== p.id));
                    } catch (e) {
                      console.error(e);
                      showToast('Delete failed', 'error');
                    }
                  }} style={{background:'red',color:'#fff'}}>Delete</button>
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
      <h3>Remove Jersey #{product.id}</h3>
      <p><strong>{product.title}</strong> — {product.team_name || ''} ({product.league || ''})</p>
      <p>Price: {product.price} — Prev: {product.prev_price || 'N/A'}</p>
      <p>Sizes: {(product.sizes || []).join(', ')}</p>
      <button onClick={remove} style={{background:'red',color:'white'}}>Delete</button>
      <button onClick={() => navigate('/admin/jersey')} style={{marginLeft:8}}>Cancel</button>
    </div>
  );
}
