import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AdminJerseyEdit() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  function DetailsEditor({ value = [], onChange }) {
    const [items, setItems] = useState(value);
    useEffect(() => setItems(value || []), [value]);
    const update = (i, v) => { const next = items.slice(); next[i] = v; setItems(next); onChange(next); };
    const add = () => { const next = items.concat(''); setItems(next); onChange(next); };
    const remove = (i) => { const next = items.slice(); next.splice(i,1); setItems(next); onChange(next); };
    return (
      <div>
        {items.map((it, idx) => (
          <div key={idx} style={{marginBottom:6}}>
            <input style={{width:'80%'}} value={it} onChange={e => update(idx, e.target.value)} />
            <button type="button" onClick={() => remove(idx)} style={{marginLeft:6}}>Remove</button>
          </div>
        ))}
        <div><button type="button" onClick={add}>Add detail</button></div>
      </div>
    );
  }

  useEffect(() => {
    if (!id) {
      // load list of products for selection
      const fetchList = async () => {
        setLoading(true);
        try {
          const res = await axios.get('/api/admin/products');
          setProducts(res.data || []);
        } catch (e) {
          console.error(e);
          alert('Failed to load products');
        } finally { setLoading(false); }
      };
      fetchList();
      return;
    }
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/admin/products`);
        const p = res.data.find(x => String(x.id) === String(id));
        if (!p) {
          alert('Product not found');
          navigate('/admin/jersey');
          return;
        }
        setProduct(p);
      } catch (e) {
        console.error(e);
        alert('Failed to load product');
      } finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.get('/sanctum/csrf-cookie');
      const payload = { ...product };
      await axios.put(`/api/admin/products/${id}`, payload);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Updated', type: 'success', timeout: 2500 } }));
      navigate('/admin/jersey');
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Update failed: ' + (err.response?.data?.message || err.message), type: 'error', timeout: 5000 } }));
    }
  };

  if (!id) {
    return (
      <div style={{padding:20}}>
        <h3>Select a jersey to edit</h3>
        {loading ? <p>Loading...</p> : products.length === 0 ? <p>No products.</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
            {products.map(p => (
              <div key={p.id} style={{border:'1px solid #eee',padding:12,borderRadius:8}}>
                <div style={{fontWeight:700}}>{p.title}</div>
                <div style={{color:'#666'}}>{p.team_name || ''}</div>
                <div style={{marginTop:8}}>
                  <button onClick={() => navigate(`/admin/jersey/edit?id=${p.id}`)}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading || !product) return <div><p>Loading product...</p></div>;

  return (
    <div style={{padding:20}}>
      <h3>Edit Jersey #{product.id}</h3>
      <form onSubmit={submit}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <label>Jersey Name: <input required value={product.title || ''} onChange={e => setProduct(p => ({...p, title: e.target.value}))} /></label>
          <label>Team Name: <input value={product.team_name || ''} onChange={e => setProduct(p => ({...p, team_name: e.target.value}))} /></label>
          <label>Year: <input value={product.year || ''} onChange={e => setProduct(p => ({...p, year: e.target.value}))} /></label>

          <div>
            <label>Type:</label>
            <div>
              <label><input type="radio" name="type" checked={product.jersey_type==='football'} onChange={() => setProduct(p => ({...p, jersey_type:'football'}))} /> Football</label>
              <label style={{marginLeft:12}}><input type="radio" name="type" checked={product.jersey_type==='cricket'} onChange={() => setProduct(p => ({...p, jersey_type:'cricket'}))} /> Cricket</label>
            </div>
          </div>

          <label>League:
            <select value={product.league || ''} onChange={e => setProduct(p => ({...p, league: e.target.value}))}>
              <option value="">-- select --</option>
              {product.jersey_type === 'football' ? (
                ['PREMIER LEAGUE','LALIGA','LIGUE 1','SERIE A','BUNDESLIGA','MLS','OTHER LEAGUES','INTERNATIONAL TEAMS'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))
              ) : (
                ['International','IPL','BPL','NCL','BBL','Concept','Retro','Test','Customized'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))
              )}
            </select>
          </label>

          <label>Prev Price: <input type="number" value={product.prev_price || ''} onChange={e => setProduct(p => ({...p, prev_price: e.target.value}))} /></label>
          <label>New Price: <input required type="number" value={product.price || ''} onChange={e => setProduct(p => ({...p, price: e.target.value}))} /></label>

          <label>Availability:
            <select value={product.in_stock ? 'in' : 'out'} onChange={e => setProduct(p => ({...p, in_stock: e.target.value === 'in'}))}>
              <option value="in">In Stock</option>
              <option value="out">Not in Stock</option>
            </select>
          </label>

          <label>Image URL (Google Drive link): <input value={product.image || ''} onChange={e => setProduct(p => ({...p, image: e.target.value}))} /></label>

          <label>Size Chart (URL or text): <input value={product.size_chart || ''} onChange={e => setProduct(p => ({...p, size_chart: e.target.value}))} /></label>

          <div style={{gridColumn:'1 / -1'}}>
            <label>Sizes (tick available):</label>
            <div>
              {['XS','S','M','L','XL','2XL','3XL'].map(sz => (
                <label key={sz} style={{marginRight:8}}>
                  <input type="checkbox" checked={(product.sizes || []).includes(sz)} onChange={e => {
                    setProduct(p => {
                      const sizes = new Set(p.sizes || []);
                      if (e.target.checked) sizes.add(sz); else sizes.delete(sz);
                      return {...p, sizes: Array.from(sizes)};
                    });
                  }} /> {sz}
                </label>
              ))}
            </div>
          </div>

          <label>Shipping Time (days): <input type="number" value={product.shipping_time_days || ''} onChange={e => setProduct(p => ({...p, shipping_time_days: e.target.value}))} /></label>
          <label>Brand (optional): <input value={product.brand || ''} onChange={e => setProduct(p => ({...p, brand: e.target.value}))} /></label>

          <label>Country of Origin (optional): <input value={product.country_of_origin || ''} onChange={e => setProduct(p => ({...p, country_of_origin: e.target.value}))} /></label>
          <label>Fabric (optional): <input value={product.fabric || ''} onChange={e => setProduct(p => ({...p, fabric: e.target.value}))} /></label>

          <div style={{gridColumn:'1 / -1'}}>
            <label>Details (custom features):</label>
            <DetailsEditor value={product.details || []} onChange={v => setProduct(p => ({...p, details: v}))} />
          </div>

          <div style={{gridColumn:'1 / -1'}}>
            <label>Description: <textarea value={product.description || ''} onChange={e => setProduct(p => ({...p, description: e.target.value}))} /></label>
          </div>

        </div>
        <div style={{marginTop:12}}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/admin/jersey')} style={{marginLeft:8}}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
