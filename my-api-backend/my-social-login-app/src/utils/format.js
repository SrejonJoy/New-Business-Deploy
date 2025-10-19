export function formatTaka(value) {
  const n = Number(value) || 0;
  // format with 2 decimals and comma separators
  return '৳' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function drivePreview(url) {
  if (!url || typeof url !== 'string') return url;
  // common Google Drive share formats:
  // https://drive.google.com/file/d/FILEID/view?usp=sharing
  // https://drive.google.com/open?id=FILEID
  // https://drive.google.com/uc?id=FILEID&export=download
  try {
    const u = url.trim();
    const fileIdMatch = u.match(/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
  } catch (e) {
    // fallthrough
  }
  return url;
}

export function discountedPrice(product) {
  const price = Number(product.price) || 0;
  if (product.discount_percent) {
    return price * (1 - Number(product.discount_percent) / 100);
  }
  if (product.discount_fixed) {
    return Math.max(0, price - Number(product.discount_fixed));
  }
  return price;
}
