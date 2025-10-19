import axios from 'axios';

export async function cartAdd(item, qty = 1, size = null) {
  try {
    const raw = localStorage.getItem('cart') || '[]';
    const list = JSON.parse(raw);
    // simple key: id + size
    const key = `${item.id}::${size || ''}`;
    const existing = list.find(x => x.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      list.push({ key, id: item.id, title: item.title, price: item.price, image: item.image, qty, size });
    }
    // attempt server-side add if user is authenticated (session cookie)
    try {
      // use axios so XSRF cookie is handled (axios.defaults.withCredentials = true is set elsewhere)
      let resp;
      try {
        resp = await axios.post('/api/cart/add', { id: item.id, title: item.title, price: item.price, image: item.image, qty, size });
      } catch (err) {
        if (err?.response?.status === 419) {
          // try to fetch CSRF cookie then retry once
          try { await axios.get('/sanctum/csrf-cookie'); resp = await axios.post('/api/cart/add', { id: item.id, title: item.title, price: item.price, image: item.image, qty, size }); } catch(e) {}
        } else throw err;
      }
      if (resp && resp.data) {
        const data = resp.data;
        if (data?.items) {
          localStorage.setItem('cart', JSON.stringify(data.items));
          const count = data.items.reduce((s, it) => s + (it.qty || 0), 0);
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count } }));
          return true;
        }
        if (data?.message) throw new Error(data.message);
      }
    } catch (e) {
      // ignore network/auth errors and fallback to local
    }

    // fallback: persist locally and notify
    localStorage.setItem('cart', JSON.stringify(list));
    try { window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: list.reduce((s, it) => s + (it.qty || 0), 0) } })); } catch(e){}
    return true;
  } catch (e) {
    console.error('Failed to add to cart', e);
    return false;
  }
}

export function cartGet() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch (e) { return []; }
}

export async function cartUpdateItem(key, qty) {
    try {
      let resp;
      try { resp = await axios.post('/api/cart/update-item', { key, qty }); } catch (err) {
        if (err?.response?.status === 419) { try { await axios.get('/sanctum/csrf-cookie'); resp = await axios.post('/api/cart/update-item', { key, qty }); } catch(e) {} } else { throw err; }
      }
      if (resp && resp.data && resp.data.items) {
        localStorage.setItem('cart', JSON.stringify(resp.data.items));
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: resp.data.items.reduce((s, it) => s + (it.qty || 0), 0) } }));
        return resp.data.items;
      }
    } catch (e) {
      // ignore
    }
  // fallback: update locally
  const list = cartGet().map(x => x.key === key ? { ...x, qty } : x);
  localStorage.setItem('cart', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: list.reduce((s, it) => s + (it.qty || 0), 0) } }));
  return list;
}

export async function cartRemoveItem(key) {
  try {
    let resp;
    try { resp = await axios.post('/api/cart/remove-item', { key }); } catch (err) {
      if (err?.response?.status === 419) { try { await axios.get('/sanctum/csrf-cookie'); resp = await axios.post('/api/cart/remove-item', { key }); } catch(e) {} } else { throw err; }
    }
    if (resp && resp.data && resp.data.items) {
      localStorage.setItem('cart', JSON.stringify(resp.data.items));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: resp.data.items.reduce((s, it) => s + (it.qty || 0), 0) } }));
      return resp.data.items;
    }
  } catch (e) {}
  const list = cartGet().filter(x => x.key !== key);
  localStorage.setItem('cart', JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: list.reduce((s, it) => s + (it.qty || 0), 0) } }));
  return list;
}

export async function cartSyncFromServer() {
  try {
    let resp;
    try { resp = await axios.get('/api/cart'); } catch (err) {
      if (err?.response?.status === 419) { try { await axios.get('/sanctum/csrf-cookie'); resp = await axios.get('/api/cart'); } catch(e) {} } else { /* ignore */ }
    }
    if (resp && resp.data && resp.data.items) {
      localStorage.setItem('cart', JSON.stringify(resp.data.items));
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: resp.data.items.reduce((s, it) => s + (it.qty || 0), 0) } }));
      return resp.data.items;
    }
  } catch (e) {
    // ignore unauthenticated or network errors
  }
  return null;
}
