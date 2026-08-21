import { neon } from '@neondatabase/serverless';

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Direct Neon client for serverless and browser environments
export const clientSql = neon(connectionString);

/**
 * Fast SWR (Stale-While-Revalidate) Cache Helper
 * Returns cached data immediately from localStorage, then fetches fresh data in background.
 */
export function getLocalCache<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const cached = localStorage.getItem(`umrt_cache_${key}`);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return fallback;
}

export function setLocalCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`umrt_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    // If quota exceeded, clean old items
    try {
      localStorage.clear();
      localStorage.setItem(`umrt_cache_${key}`, JSON.stringify(data));
    } catch {}
  }
}

/**
 * Compress and optimize image files on the client before saving to database.
 * Converts multi-megabyte camera photos into ~80KB high-quality WebP/JPEG data URLs
 * for ultra-fast database storage and instant page loading.
 */
export function compressImageFile(file: File, maxWidth = 1600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Render high quality smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as optimized WebP or JPEG
          let optimized = '';
          try {
            optimized = canvas.toDataURL('image/webp', quality);
          } catch {
            optimized = canvas.toDataURL('image/jpeg', quality);
          }

          // Use optimized if it is smaller than original
          const original = e.target?.result as string;
          if (optimized && optimized.length < original.length) {
            resolve(optimized);
          } else {
            resolve(original);
          }
        } catch (err) {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default clientSql;
