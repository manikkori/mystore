// In-memory cache for fast product transitions
const cache = new Map();

export const setCachedProduct = (id, product) => {
  if (id && product) {
    cache.set(String(id), product);
  }
};

export const getCachedProduct = (id) => {
  if (!id) return null;
  return cache.get(String(id)) || null;
};

export const setCachedProductsList = (products) => {
  if (Array.isArray(products)) {
    products.forEach((p) => {
      if (p && p._id) {
        cache.set(String(p._id), p);
      }
    });
  }
};
