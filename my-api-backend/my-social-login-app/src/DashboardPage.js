import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WelcomeModal from './components/WelcomeModal';
import CookieConsent from './components/CookieConsent';
import { formatTaka, drivePreview, discountedPrice } from './utils/format';

axios.defaults.withCredentials = true;

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user when the component loads
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (error) {
        console.error('Not authenticated', error);
        navigate('/login'); // Redirect to login if not authenticated
      }
    };
    fetchUser();
  }, [navigate]);

  // Welcome modal state: show only if no welcome cookie
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    try {
      const match = document.cookie.match(new RegExp('(^| )welcome_shown=([^;]+)'));
      if (!match) {
        setShowWelcome(true);
      }
    } catch (e) {
      // ignore
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    document.cookie = 'welcome_shown=1; path=/; max-age=' + 60 * 60 * 24 * 365;
    setShowWelcome(false);
  };

  const handleCookieAccept = async () => {
    try {
      // Initialize CSRF cookie for Laravel Sanctum after consent
      await axios.get('/sanctum/csrf-cookie');
    } catch (e) {
      console.warn('Failed to fetch CSRF cookie after accepting cookies', e);
    }
  };

  const handleLogout = async () => {
    try {
      // Ensure CSRF cookie/token is present for the POST
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  // Products state for public listing (hooks must be declared unconditionally)
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [imageErrorIds, setImageErrorIds] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await axios.get('/api/public/products');
        setProducts(res.data || []);
      } catch (e) {
        console.error('Failed to fetch public products', e);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {showWelcome && <WelcomeModal onClose={closeWelcome} />}
  <CookieConsent onAccept={handleCookieAccept} />
      <h1>Welcome, {user.name}</h1>
      <p>You are logged in.</p>
      <p>Your email is: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      <h2>Available Jerseys</h2>
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No jerseys available.</p>
      ) : (
        Array.isArray(products) && products.length > 0 ? (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:16}}>
            {products.map(p => (
              <div key={p.id} style={{border:'1px solid #eee',borderRadius:8,overflow:'hidden',background:'#fff',display:'flex',flexDirection:'column',cursor:'pointer'}} onClick={() => navigate(`/product/${p.id}`)}>
                <div style={{height:160,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid #f0f0f0'}}>
                  {p.image && !imageErrorIds.includes(p.id) ? (
                    <img
                      alt={p.title}
                      src={drivePreview(p.image)}
                      style={{maxHeight:150,maxWidth:'100%',objectFit:'contain'}}
                      onError={() => setImageErrorIds(ids => Array.from(new Set([...ids, p.id])))}
                    />
                  ) : (
                    <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f7f7f7'}}>
                      <svg width="80" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="14" rx="2" stroke="#ccc" strokeWidth="1.5"/>
                        <path d="M3 19h18" stroke="#eee" strokeWidth="1.5"/>
                      </svg>
                      {p.image ? (
                        <div style={{marginTop:8,fontSize:12}}>
                          <a href={drivePreview(p.image)} target="_blank" rel="noreferrer" style={{color:'#0b5fff'}}>Open image</a>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                <div style={{padding:12,flex:1,display:'flex',flexDirection:'column'}}>
                  {(p.discount_percent || p.discount_fixed) && (
                    <div style={{position:'absolute',left:12,top:12,zIndex:3}}>
                      <div style={{background:'#ff5252',color:'#fff',padding:'4px 8px',borderRadius:12,fontSize:12,fontWeight:700}}>{p.discount_percent ? `🔥 ${p.discount_percent}%` : `🔥 ৳${p.discount_fixed}`}</div>
                    </div>
                  )}
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null
      )}
    </div>
  );
};

export default DashboardPage;