import React, { useState, useEffect } from 'react';

const COOKIE_NAME = 'cookie_consent';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

const CookieConsent = ({ onAccept }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_NAME);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    setCookie(COOKIE_NAME, 'accepted');
    setVisible(false);
    if (onAccept) onAccept();
  };

  const reject = () => {
    setCookie(COOKIE_NAME, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.container} role="dialog" aria-label="cookie-consent">
      <div style={styles.box}>
        <div style={{flex:1}}>
          Select "Accept" to agree to cookies for a better experience.
        </div>
        <div style={styles.actions}>
          <button onClick={reject} style={styles.reject}>Reject</button>
          <button onClick={accept} style={styles.accept}>Accept</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    left: 16,
    right: 16,
    bottom: 16,
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
  },
  box: {
    maxWidth: 900,
    background: '#fff',
    padding: 12,
    borderRadius: 6,
    boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    marginLeft: 12,
    display: 'flex',
    gap: 8,
  },
  accept: {
    background: '#000',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  reject: {
    background: 'transparent',
    color: '#000',
    border: '1px solid #ddd',
    padding: '8px 12px',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default CookieConsent;
