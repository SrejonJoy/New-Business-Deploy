export function showToast(message, type = 'success', timeout = 3500) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type, timeout } }));
}

export default showToast;
