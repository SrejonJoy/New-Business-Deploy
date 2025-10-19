import React from 'react';

const WelcomeModal = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose} aria-label="Close">×</button>
        <div style={styles.logo}>[KITBAG]</div>
        <h2>WELCOME</h2>
        <p>
          For the best experience, accept cookies and continue browsing.
        </p>
        <button style={styles.continue} onClick={onClose}>Continue</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    width: 520,
    background: '#fff',
    padding: 24,
    borderRadius: 8,
    textAlign: 'center',
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    border: 'none',
    background: 'transparent',
    fontSize: 20,
    cursor: 'pointer',
  },
  logo: {
    fontWeight: '700',
    fontSize: 28,
    marginBottom: 8,
  },
  continue: {
    background: '#c94b3b',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 12,
  },
};

export default WelcomeModal;
