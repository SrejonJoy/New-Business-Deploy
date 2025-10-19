import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatTaka, drivePreview, discountedPrice } from '../utils/format';

const AdminJersey = () => {
  // small details editor for key/value feature list
  function DetailsEditor({ value = [], onChange }) {
    const [items, setItems] = useState(value);
    useEffect(() => setItems(value || []), [value]);
    const update = (i, v) => {
      const next = items.slice(); next[i] = v; setItems(next); onChange(next);
    };
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
  const initialForm = {
    title: '', name: '', team_name: '', year: '', jersey_type: 'football', league: '',
    price: '', prev_price: '', in_stock: true, image: '', size_chart: '', sizes: [], shipping_time_days: '',
    brand: '', country_of_origin: '', fabric: '', details: [], description: ''
  };
  const [form, setForm] = useState(initialForm);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageErrorIds, setImageErrorIds] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
        // Use the admin-protected endpoint (requires admin user)
        const res = await axios.get('/api/admin/products');
        setProducts(res.data);
      } catch (e) {
      console.error('Failed to fetch products', e);
      // build readable error
      const status = e.response?.status;
      const body = e.response?.data || e.response?.statusText;
      const msg = `Fetch failed${status ? ' (status ' + status + ')' : ''}: ${JSON.stringify(body) || e.message}`;
      setError(msg);
      // also show a browser alert for quick visibility
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: msg, type: 'error', timeout: 6000 } }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      try {
        console.debug('[admin] ensuring CSRF cookie before submit');
        await axios.get('/sanctum/csrf-cookie');
        await axios.post('/api/admin/products', form);
      } catch (err) {
        console.warn('[admin] submit failed, status=', err?.response?.status, err?.message);
        if (err?.response?.status === 419) {
          // try to refresh CSRF cookie and retry once
          try { console.debug('[admin] 419 received, retrying after CSRF refresh'); await axios.get('/sanctum/csrf-cookie'); await axios.post('/api/admin/products', form); }
          catch(e) { throw e; }
        } else throw err;
      }
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Product created', type: 'success', timeout: 3000 } }));
      setForm(initialForm);
      fetchProducts();
    } catch (e) {
      console.error(e);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Create product failed: ' + (e.response?.data?.message || e.message), type: 'error', timeout: 6000 } }));
    }
  };

  // Upload image file to backend and set form.image to returned URL
  const uploadImage = async (file) => {
    if (!file) return;
    try {
      // ensure CSRF cookie and retry-on-419
      try {
        console.debug('[admin] prefetching CSRF cookie for upload');
        await axios.get('/sanctum/csrf-cookie');
      } catch(e) {
        console.warn('[admin] CSRF prefetch failed, will attempt upload and retry on 419', e && e.message);
      }
      const fd = new FormData();
      fd.append('image', file);
      let res;
      try {
        console.debug('[admin] starting image upload to /api/admin/products/upload', file && file.name, file && file.size);
        res = await axios.post('/api/admin/products/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(pct);
            }
          }
        });
      } catch (err) {
        if (err?.response?.status === 419) {
          // refresh CSRF cookie then retry once
          try { console.debug('[admin] upload received 419, fetching CSRF cookie and retrying upload'); await axios.get('/sanctum/csrf-cookie'); res = await axios.post('/api/admin/products/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (progressEvent) => { if (progressEvent.total) { const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total); setUploadProgress(pct); } } }); }
          catch (e) { throw e; }
        } else throw err;
      }
      if (res.data && res.data.url) {
        setForm(f => ({ ...f, image: res.data.url }));
        setUploadPreview(res.data.url);
        setUploadProgress(0);
        window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Image uploaded', type: 'success' } }));
      }
    } catch (e) {
      console.error('Upload failed', e);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Image upload failed: ' + (e.response?.data?.message || e.message), type: 'error' } }));
    }
  };

  const fetchPublic = async () => {
    try {
      const resp = await axios.get('/api/public/products');
      console.log('Public products:', resp.data);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Public products count: ' + (resp.data?.length || 0), type: 'success' } }));
    } catch (e) {
      console.error('Public fetch failed', e);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Public fetch failed: ' + (e.response?.status ? e.response.status + ' ' + JSON.stringify(e.response.data) : e.message), type: 'error' } }));
    }
  };

  const goEdit = (id) => navigate(`/admin/jersey/edit?id=${id}`);
  const goRemove = (id) => navigate(`/admin/jersey/remove?id=${id}`);
  const goDiscount = (id) => navigate(`/admin/jersey/discount?id=${id}`);

  return (
    <div style={{padding:20}}>
      <h3>Add a Jersey</h3>
  <form onSubmit={submit}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <label>Jersey Name: <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></label>
          <label>Team Name: <input value={form.team_name} onChange={e => setForm(f => ({...f, team_name: e.target.value}))} /></label>
          <label>Year: <input value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} /></label>

          <div>
            <label>Type:</label>
            <div>
              <label><input type="radio" name="type" checked={form.jersey_type==='football'} onChange={() => setForm(f => ({...f, jersey_type:'football'}))} /> Football</label>
              <label style={{marginLeft:12}}><input type="radio" name="type" checked={form.jersey_type==='cricket'} onChange={() => setForm(f => ({...f, jersey_type:'cricket'}))} /> Cricket</label>
            </div>
          </div>

          <label>League:
            <select value={form.league} onChange={e => setForm(f => ({...f, league: e.target.value}))}>
              <option value="">-- select --</option>
              {form.jersey_type === 'football' ? (
                // football leagues (from attachment first row)
                ['PREMIER LEAGUE','LALIGA','LIGUE 1','SERIE A','BUNDESLIGA','MLS','OTHER LEAGUES','INTERNATIONAL TEAMS'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))
              ) : (
                // cricket leagues (from second image)
                ['International','IPL','BPL','NCL','BBL','Concept','Retro','Test','Customized'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))
              )}
            </select>
          </label>

          <label>Prev Price: <input type="number" value={form.prev_price} onChange={e => setForm(f => ({...f, prev_price: e.target.value}))} /></label>
          <label>New Price: <input required type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} /></label>

          <label>Availability:
            <select value={form.in_stock ? 'in' : 'out'} onChange={e => setForm(f => ({...f, in_stock: e.target.value === 'in'}))}>
              <option value="in">In Stock</option>
              <option value="out">Not in Stock</option>
            </select>
          </label>

          <label>Image URL (Google Drive link): <input value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} /></label>
          <label>Or upload image: <input type="file" accept="image/*" onChange={e => {
            const f = e.target.files && e.target.files[0];
            if (f) {
              // show local preview immediately
              const reader = new FileReader();
              reader.onload = () => setUploadPreview(reader.result);
              reader.readAsDataURL(f);
            }
            uploadImage(e.target.files && e.target.files[0]);
          }} /></label>
          {uploadProgress > 0 && (
            <div style={{marginTop:6}}>
              Uploading: {uploadProgress}%
            </div>
          )}
          {uploadPreview && (
            <div style={{marginTop:6}}>
              <img src={uploadPreview} alt="preview" style={{maxHeight:120,maxWidth:'100%'}} />
            </div>
          )}

          <label>Size Chart (URL or text): <input value={form.size_chart} onChange={e => setForm(f => ({...f, size_chart: e.target.value}))} /></label>

          <div style={{gridColumn:'1 / -1'}}>
            <label>Sizes (tick available):</label>
            <div>
              {['XS','S','M','L','XL','2XL','3XL'].map(sz => (
                <label key={sz} style={{marginRight:8}}>
                  <input type="checkbox" checked={form.sizes.includes(sz)} onChange={e => {
                    setForm(f => {
                      const sizes = new Set(f.sizes);
                      if (e.target.checked) sizes.add(sz); else sizes.delete(sz);
                      return {...f, sizes: Array.from(sizes)};
                    });
                  }} /> {sz}
                </label>
              ))}
            </div>
          </div>

          <label>Shipping Time (days): <input type="number" value={form.shipping_time_days} onChange={e => setForm(f => ({...f, shipping_time_days: e.target.value}))} /></label>
          <label>Brand (optional): <input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} /></label>

          <label>Country of Origin (optional): <input value={form.country_of_origin} onChange={e => setForm(f => ({...f, country_of_origin: e.target.value}))} /></label>
          <label>Fabric (optional): <input value={form.fabric} onChange={e => setForm(f => ({...f, fabric: e.target.value}))} /></label>

          <div style={{gridColumn:'1 / -1'}}>
            <label>Details (key/value pairs) - add custom features:</label>
            <DetailsEditor value={form.details} onChange={v => setForm(f => ({...f, details: v}))} />
          </div>

          <div style={{gridColumn:'1 / -1'}}>
            <label>Description: <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></label>
          </div>

        </div>
        <div style={{marginTop:12}}>
          <button type="submit">Add Jersey</button>
          <button type="button" onClick={fetchPublic} style={{marginLeft:12}}>Load public products (debug)</button>
        </div>
      </form>

      <hr />
      <h3>Existing Jerseys</h3>
      {loading ? <p>Loading...</p> : error ? (
        <div style={{color:'red'}}>Error loading products: {error}</div>
      ) : products.length === 0 ? <p>No products yet.</p> : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
            {products.map(p => (
              <div key={p.id} style={{border:'1px solid #eee',borderRadius:8,overflow:'hidden',background:'#fff',display:'flex',flexDirection:'column',position:'relative'}}>
                {/* badges */}
                <div style={{position:'absolute',left:8,top:8,zIndex:2}}>
                  {p.prev_price && (!p.in_stock || (p.sizes && p.sizes.length <= 2)) && (
                    <div style={{background:'#ffb74d',color:'#7a3f00',padding:'4px 8px',borderRadius:12,fontSize:12,fontWeight:700}}>Almost Gone!</div>
                  )}
                </div>
                { (p.discount_percent || p.discount_fixed) && (
                  <div style={{position:'absolute',right:8,top:8,zIndex:2}}>
                    <div style={{background:'#e53935',color:'#fff',padding:'4px 8px',borderRadius:12,fontSize:12,fontWeight:700}}>{p.discount_percent ? `${p.discount_percent}% OFF` : `৳${p.discount_fixed} OFF`}</div>
                  </div>
                )}

                <div style={{height:180,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid #f0f0f0'}}>
                  {p.image && !imageErrorIds.includes(p.id) ? (
                    <img
                      alt={p.title}
                      src={drivePreview(p.image)}
                      style={{maxHeight:170,maxWidth:'100%',objectFit:'contain'}}
                      onError={() => setImageErrorIds(ids => Array.from(new Set([...ids, p.id])))}
                    />
                  ) : (
                    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#f7f7f7'}}>
                      <svg width="80" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="14" rx="2" stroke="#ccc" strokeWidth="1.5"/>
                        <path d="M3 19h18" stroke="#eee" strokeWidth="1.5"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div style={{padding:12,flex:1,display:'flex',flexDirection:'column'}}>
                  <div style={{marginBottom:6}}>
                    <div style={{fontWeight:700,fontSize:15}}>{p.title}</div>
                    <div style={{color:'#666',fontSize:13}}>{p.team_name || ''} {p.league ? `— ${p.league}` : ''}</div>
                  </div>

                  <div style={{marginTop:'auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div>
                      {p.prev_price ? <div style={{color:'#999',fontSize:13}}><s>{formatTaka(p.prev_price)}</s></div> : null}
                      <div style={{color:'#b12704',fontSize:18,fontWeight:700}}>{formatTaka(discountedPrice(p))}</div>
                    </div>

                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:12,color: p.in_stock ? 'green' : 'red'}}>{p.in_stock ? 'In Stock' : 'Not in Stock'}</div>
                      <div style={{marginTop:8}}>
                        <button onClick={() => goEdit(p.id)} style={{marginRight:6}}>Edit</button>
                        <button onClick={() => goRemove(p.id)} style={{marginRight:6}}>Remove</button>
                        <button onClick={() => goDiscount(p.id)}>Discount</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default AdminJersey;
