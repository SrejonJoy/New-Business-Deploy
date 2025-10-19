import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { cartSyncFromServer } from '../utils/cart';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
        const res = await axios.get('/api/user');
        if (mounted) setUser(res.data);
      } catch (e) {
        // not authenticated or error
      }
    };
    fetchUser();
    return () => { mounted = false; };
  }, []);

  // when user logs in, try syncing local cart to server
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const list = JSON.parse(raw);
      if (list.length === 0) return;
      // send to server via axios so CSRF cookie is used
      axios.post('/api/cart', { items: list }).catch(() => {});
      // also attempt to replace local cart with server version (in case server has saved cart)
      try { cartSyncFromServer(); } catch(e) {}
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    const calc = () => {
      try {
        const raw = localStorage.getItem('cart') || '[]';
        const list = JSON.parse(raw);
        const count = list.reduce((s, it) => s + (it.qty || 0), 0);
        setCartCount(count);
      } catch (e) { setCartCount(0); }
    };
    calc();
    const h = (e) => setCartCount(e.detail?.count || 0);
    window.addEventListener('cart-updated', h);
    return () => window.removeEventListener('cart-updated', h);
  }, []);

  const isAdmin = user && user.role === 'admin';

  return (
    <header>
      <div style={styles.topBar}>
        <div style={styles.topLeft}></div>
        <div style={styles.topRight}>
          {isAdmin && <a href="/admin/roles" style={styles.topLink}>Admin Control</a>}
          <a href="/track-order" style={styles.topLink}>Track Order</a>
          <a href="/help" style={styles.topLink}>Help</a>
          <a href="/account" style={styles.topLink}>My Account</a>
          <Link to="/cart" style={styles.topLink}>Cart {cartCount > 0 ? <span style={styles.badge}>{cartCount}</span> : null}</Link>
        </div>
      </div>

      <div style={styles.middleBar}>
        <div style={styles.logo}>
          <img onClick={() => navigate('/dashboard')} src={require('../assets/kitbag-logo.svg').default} alt="Kitbag" style={{height:40,cursor:'pointer'}} />
        </div>
        <div style={styles.searchWrap}>
          <input placeholder="What can we help you find?" style={styles.search} />
        </div>
        <div style={styles.info}>
          <p style={{margin:0}}>365 DAY RETURNS</p>
          <p style={{margin:0}}>FAST WORLDWIDE DELIVERY</p>
        </div>
      </div>

      <nav style={styles.lowerBar}>
        <a href="/premier" style={styles.navItem}>PREMIER LEAGUE</a>
        <a href="/laliga" style={styles.navItem}>LALIGA</a>
        <a href="/ligue1" style={styles.navItem}>LIGUE 1</a>
        <a href="/seriea" style={styles.navItem}>SERIE A</a>
        <a href="/bundesliga" style={styles.navItem}>BUNDESLIGA</a>
        <a href="/mls" style={styles.navItem}>MLS</a>
        <a href="/other" style={styles.navItem}>OTHER LEAGUES</a>
        <a href="/international" style={styles.navItem}>INTERNATIONAL TEAMS</a>
        <a href="/more" style={styles.navItem}>MORE</a>
        <a href="/outlet" style={styles.navItem}>OUTLET</a>
      </nav>

      <nav style={styles.cricketBar} aria-label="cricket-leagues">
        <a href="/cricket/international" style={styles.cricketItem}>International</a>
        <a href="/cricket/ipl" style={styles.cricketItem}>IPL</a>
        <a href="/cricket/bpl" style={styles.cricketItem}>BPL</a>
        <a href="/cricket/ncl" style={styles.cricketItem}>NCL</a>
        <a href="/cricket/bbl" style={styles.cricketItem}>BBL</a>
        <a href="/cricket/concept" style={styles.cricketItem}>Concept</a>
        <a href="/cricket/retro" style={styles.cricketItem}>Retro</a>
        <a href="/cricket/test" style={styles.cricketItem}>Test</a>
        <a href="/cricket/customized" style={styles.cricketItem}>Customized</a>
      </nav>
    </header>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
    background: '#fff',
    borderBottom: '1px solid #eee',
  },
  topRight: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  topLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: 14,
    cursor: 'pointer',
  },
  middleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
  },
  logo: {
    fontSize: 28,
    fontWeight: 700,
  },
  searchWrap: {
    flex: 1,
    padding: '0 24px',
  },
  search: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 4,
    border: '1px solid #ddd',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    textAlign: 'right',
    minWidth: 180,
  },
  lowerBar: {
    display: 'flex',
    gap: 8,
    padding: '8px 16px',
    background: '#f3f3f3',
    borderTop: '1px solid #e6e6e6',
  },
  navItem: {
    padding: '10px 12px',
    fontSize: 13,
    color: '#333',
    cursor: 'pointer',
  },
  cricketBar: {
    display: 'flex',
    gap: 8,
    padding: '6px 16px',
    background: '#fff',
    borderTop: '1px solid #eee',
  },
  cricketItem: {
    padding: '8px 10px',
    fontSize: 13,
    color: '#333',
    cursor: 'pointer',
  },
  badge: {
    display: 'inline-block',
    background: '#d23f2f',
    color: '#fff',
    borderRadius: 12,
    padding: '2px 8px',
    marginLeft: 8,
    fontSize: 12,
    verticalAlign: 'middle'
  }
};

export default Header;
