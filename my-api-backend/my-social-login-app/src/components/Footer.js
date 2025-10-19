import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <h4 style={styles.heading}>Customer Service</h4>
          <a href="/help" style={styles.link}>Help</a>
          <a href="/track-order" style={styles.link}>Track Order</a>
          <a href="/size-chart" style={styles.link}>Size Chart</a>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Worry Free Shopping</h4>
          <a href="/promo-terms" style={styles.link}>Promo Terms and Exclusions</a>
          <a href="/coupons" style={styles.link}>Coupons & Promotions</a>
          <a href="/transfer-shield" style={styles.link}>Transfer Shield</a>
          <a href="/safe-shopping" style={styles.link}>Safe Shopping</a>
          <a href="/delivery" style={styles.link}>Delivery & Shipping</a>
          <a href="/returns" style={styles.link}>365-Day Returns</a>
        </div>

        <div style={styles.column}>
          <h4 style={styles.heading}>Information</h4>
          <a href="/account" style={styles.link}>My Account</a>
          <a href="/about" style={styles.link}>About Us</a>
          <a href="/affiliate" style={styles.link}>Affiliate Program</a>
          <a href="/discounts" style={styles.link}>Student & Key Worker Discount</a>
        </div>

        <div style={{...styles.column, ...styles.rightColumn}}>
          <div style={{textAlign:'right'}}>
            <p style={{margin:0}}>Stay updated on sales, new items and more</p>
            <button style={styles.signup}>SIGN UP & SAVE 15%</button>
            <div style={{marginTop:12, textAlign:'right'}}>
              <div style={{fontWeight:700, marginBottom:6}}>Follow Us</div>
              <div style={styles.socials}>
                <button aria-label="facebook" style={{...styles.iconLink, ...styles.iconButton}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99H7.898v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.467h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.127 22 16.99 22 12z" fill="#fff"/></svg></button>
                <button aria-label="x" style={{...styles.iconLink, ...styles.iconButton}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.364 5.636L5.636 18.364M5.636 5.636L18.364 18.364" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                <button aria-label="instagram" style={{...styles.iconLink, ...styles.iconButton}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#fff" strokeWidth="2"/><path d="M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                <button aria-label="youtube" style={{...styles.iconLink, ...styles.iconButton}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.5s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.9-.9C16.7 5 12 5 12 5s-4.7 0-7.3.6c-.4 0-1.2.1-1.9.9-.6.6-.8 2-.8 2S2 10.2 2 11.9v.2c0 1.7.2 3.4.2 3.4s.2 1.4.8 2c.7.8 1.6.8 2 .9C7.3 20 12 20 12 20s4.7 0 7.3-.6c.4 0 1.2-.1 1.9-.9.6-.6.8-2 .8-2s.2-1.7.2-3.4v-.2c0-1.7-.2-3.4-.2-3.4z" stroke="#fff" strokeWidth="0.4"/><path d="M10 14.5l4-2.5-4-2.5v5z" fill="#fff"/></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#f5f5f5',
    padding: '28px 0',
    marginTop: 24,
  },
  container: {
    display: 'flex',
    gap: 24,
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 16px',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
    minWidth: 160,
  },
  rightColumn: {
    maxWidth: 320,
    flex: '0 0 320px',
  },
  heading: {
    margin: 0,
    marginBottom: 10,
    fontSize: 16,
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    fontSize: 14,
    cursor: 'pointer',
  },
  signup: {
    background: '#c94b3b',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 8,
  },
  socials: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  social: {
    width: 32,
    height: 32,
    borderRadius: 16,
    background: '#111',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    cursor: 'pointer',
  },
  iconButton: {
    background: '#111',
    border: 'none',
    padding: 8,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Footer;
