// Utility to build image URLs for Strapi-hosted media
export const STRAPI_IMAGE_BASE = import.meta.env.VITE_LOCALHOST_IMAGE || 'http://localhost:1340'

export function getImageUrl(path) {
  if (!path) return '/data/urbex.jpg'
  // If path looks like an absolute URL, return it as-is
  if (/^https?:\/\//i.test(path)) return path
  // Ensure leading slash for consistency
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${STRAPI_IMAGE_BASE}${normalized}`
}


