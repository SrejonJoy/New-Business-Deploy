import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatTaka, drivePreview, discountedPrice } from './utils/format';
import { cartAdd } from './utils/cart';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [others, setOthers] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [imageError, setImageError] = useState(false);
  const [selectedSize, setSelectedSize] = useState((product && (product.sizes || [])[0]) || null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/public/products');
        const list = res.data || [];
        const p = list.find(x => String(x.id) === String(id));
        setProduct(p || null);
        // choose 'you may also like' list: same league first, then same jersey_type, then fallback recent
        const candidates = list.filter(x => String(x.id) !== String(id));
        const sameLeague = candidates.filter(x => x.league && p && x.league === p.league);
        const sameType = candidates.filter(x => p && x.jersey_type && x.jersey_type === p.jersey_type && (!sameLeague.includes(x)));
        const rest = candidates.filter(x => !sameLeague.includes(x) && !sameType.includes(x));
        setOthers([...sameLeague, ...sameType, ...rest].slice(0,5));
        // initialize size selection after product loaded
        if (p) {
          const initial = (p.sizes && p.sizes.length > 0) ? p.sizes[0] : null;
          setSelectedSize(initial);
        }
      } catch (e) {
        console.error('Failed to fetch products', e);
      }
    };
    fetch();
  }, [id]);

  if (!product) return <div style={{padding:20}}><p>Loading product...</p></div>;

  const toggle = (key) => setExpanded(e => ({...e, [key]: !e[key]}));

  return (
    <div style={{display:'flex',gap:24,padding:24}}>
  <div style={{flex:'1 1 60%'}}>
        <div style={{background:'#fff',padding:12,borderRadius:8,border:'1px solid #eee'}}>
          {product.image && !imageError ? (
            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',borderRadius:6}}>
              <img src={drivePreview(product.image)} alt={product.title} style={{width:'100%',height:'auto',objectFit:'contain',borderRadius:6,maxHeight:'80vh'}} onError={() => setImageError(true)} />
            </div>
          ) : (
            <div style={{width:'100%',height:560,display:'flex',alignItems:'center',justifyContent:'center',background:'#f7f7f7',borderRadius:6}}>
              <div>No Image</div>
            </div>
          )}
        </div>

        <div style={{marginTop:16}}>
          <h2 style={{margin:0}}>{product.title}</h2>
          <div style={{color:'#666',marginBottom:8}}>{product.team_name || ''} {product.league ? `— ${product.league}` : ''}</div>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontSize:20,fontWeight:800,color:'#b12704'}}>{formatTaka(discountedPrice(product))}</div>
            {product.prev_price ? <div style={{textDecoration:'line-through',color:'#999'}}>{formatTaka(product.prev_price)}</div> : null}
          </div>
        </div>

        <div style={{marginTop:18}}>
          {['Details','Size Chart','Shipping','Description'].map((k) => (
            <div key={k} style={{borderTop:'1px solid #eee',padding:'12px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontWeight:700}}>{k}</div>
                <button onClick={() => toggle(k)} style={{border:'none',background:'transparent',fontSize:20}}>{expanded[k] ? '−' : '+'}</button>
              </div>
              {expanded[k] ? (
                <div style={{marginTop:8,color:'#333'}}>
                  {k === 'Details' && (product.details || []).length > 0 ? (
                    <ul>{(product.details || []).map((d, i) => <li key={i}>{d}</li>)}</ul>
                  ) : k === 'Size Chart' ? (
                    product.size_chart ? <div>{product.size_chart}</div> : <div>No size chart provided.</div>
                  ) : k === 'Shipping' ? (
                    <div>Ships in {product.shipping_time_days || 'N/A'} days.</div>
                  ) : k === 'Description' ? (
                    <div>{product.description || 'No description provided.'}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <aside style={{width:360}}>
        <div style={{padding:12,border:'1px solid #eee',borderRadius:8,background:'#fff'}}>
          <h4 style={{marginTop:0}}>Purchase</h4>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:18,fontWeight:800,color:'#b12704'}}>{formatTaka(discountedPrice(product))}</div>
            {product.prev_price ? <div style={{textDecoration:'line-through',color:'#999'}}>{formatTaka(product.prev_price)}</div> : null}
          </div>

          <div style={{marginBottom:12}}>
            <div style={{marginBottom:6,fontWeight:700}}>Size</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {(product.sizes || ['S','M','L']).map(sz => (
                <button key={sz} onClick={() => setSelectedSize(sz)} style={{padding:'8px 10px',borderRadius:6,border: selectedSize===sz ? '2px solid #0b5fff' : '1px solid #ddd',background: selectedSize===sz ? '#e8f0ff' : '#fff'}}>{sz}</button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <div style={{marginBottom:6,fontWeight:700}}>Quantity</div>
            <select value={qty} onChange={e => setQty(Number(e.target.value))} style={{padding:8,borderRadius:6}}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={{display:'flex',gap:8}}>
            <button disabled={!product.in_stock} onClick={async () => {
              try {
                await cartAdd(product, qty, selectedSize);
                window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Added to cart', type: 'success', timeout: 2500 } }));
                navigate('/cart');
              } catch (err) {
                window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: err.message || 'Add to cart failed', type: 'error', timeout: 4000 } }));
              }
            }} style={{flex:1,background: product.in_stock ? '#0b5fff' : '#bdbdbd',color:'#fff',border:'none',padding:'12px 14px',borderRadius:8,cursor: product.in_stock ? 'pointer' : 'not-allowed'}}>Add to Cart</button>

            <button onClick={() => window.open(drivePreview(product.image), '_blank')} style={{padding:'12px 14px',borderRadius:8,border:'1px solid #ddd',background:'#fff'}}>View Image</button>
          </div>

          <div style={{marginTop:16,borderTop:'1px solid #eee',paddingTop:12}}>
            <h4 style={{marginTop:0}}>You May Also Like</h4>
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:12}}>
              {others.map(o => (
                <div key={o.id} style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:72,height:72,flex:'0 0 72px'}}>
                    {o.image ? <img src={drivePreview(o.image)} alt={o.title} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:6}} /> : <div style={{width:'100%',height:'100%',background:'#f2f2f2'}}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{o.title}</div>
                    <div style={{color:'#999',fontSize:13}}>{formatTaka(discountedPrice(o))}</div>
                  </div>
                  <div>
                    <button onClick={() => navigate(`/product/${o.id}`)} style={{border:'none',background:'#0b5fff',color:'#fff',padding:'8px 10px',borderRadius:6}}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
