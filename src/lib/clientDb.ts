import { neon } from '@neondatabase/serverless';

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL || 'postgresql://neondb_owner:npg_5ryfmk4YAxKR@ep-damp-pine-ayign3qd-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Direct Neon client for serverless and browser environments
export const clientSql = neon(connectionString);

// Memory cache tier for instantaneous 0ms client route transitions
const memoryCache = new Map<string, { data: any; timestamp: number }>();
// In-flight request deduplication map to prevent redundant concurrent queries
const inFlightRequests = new Map<string, Promise<any>>();

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes default TTL

/**
 * Fast SWR (Stale-While-Revalidate) Cache Helper
 * Checks in-memory cache first, then localStorage, and returns data immediately.
 */
export function getLocalCache<T>(key: string, fallback: T): T {
  // 1. Check in-memory tier (instant 0ms)
  const mem = memoryCache.get(key);
  if (mem) {
    return mem.data as T;
  }

  if (typeof window === 'undefined') return fallback;

  // 2. Check localStorage tier
  try {
    const raw = localStorage.getItem(`umrt_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Support both legacy raw payload and new wrapped { data, timestamp }
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'timestamp' in parsed) {
        memoryCache.set(key, { data: parsed.data, timestamp: parsed.timestamp });
        return parsed.data as T;
      }
      memoryCache.set(key, { data: parsed, timestamp: Date.now() });
      return parsed as T;
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return fallback;
}

export function isCacheFresh(key: string, maxAgeMs = DEFAULT_CACHE_TTL_MS): boolean {
  const mem = memoryCache.get(key);
  if (mem && (Date.now() - mem.timestamp < maxAgeMs)) {
    return true;
  }
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(`umrt_cache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'timestamp' in parsed) {
        return (Date.now() - parsed.timestamp) < maxAgeMs;
      }
    }
  } catch {}
  return false;
}

export function setLocalCache<T>(key: string, data: T): void {
  const entry = { data, timestamp: Date.now() };
  memoryCache.set(key, entry);

  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`umrt_cache_${key}`, JSON.stringify(entry));
  } catch (e) {
    // If storage quota exceeded, clear stale cache and retry
    try {
      localStorage.clear();
      localStorage.setItem(`umrt_cache_${key}`, JSON.stringify(entry));
    } catch {}
  }
}

/**
 * Intelligent fetcher with in-flight deduplication and SWR caching.
 * Prevents multiple components from firing identical queries simultaneously.
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { ttlMs?: number; forceRefresh?: boolean } = {}
): Promise<T> {
  const { ttlMs = DEFAULT_CACHE_TTL_MS, forceRefresh = false } = options;

  if (!forceRefresh && isCacheFresh(key, ttlMs)) {
    return getLocalCache<T>(key, null as unknown as T);
  }

  // If identical request is already in-flight, return the shared promise
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  const promise = fetcher()
    .then((result) => {
      setLocalCache(key, result);
      inFlightRequests.delete(key);
      return result;
    })
    .catch((err) => {
      inFlightRequests.delete(key);
      throw err;
    });

  inFlightRequests.set(key, promise);
  return promise;
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

export const ADMIN_AUTH_SALT = 'umrt_mars_rover_secret_salt_2026';

/**
 * Browser-compatible HMAC-SHA256 password hasher using Web Crypto API.
 * Exactly matches Node.js crypto.createHmac('sha256', salt).update(pass).digest('hex').
 */
export async function hashPasswordClient(password: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const enc = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(ADMIN_AUTH_SALT),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await window.crypto.subtle.sign('HMAC', key, enc.encode(password));
    return Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return password;
}

export default clientSql;
