import crypto from 'crypto';

// Salt for password hashing
const SALT = process.env.ADMIN_AUTH_SALT || 'umrt_mars_rover_secret_salt_2026';

// Hash password with SHA-256 and salt
export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SALT).update(password).digest('hex');
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Generate simple secure session token
export function generateSessionToken(email: string): string {
  const payload = {
    email,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const str = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', SALT).update(str).digest('hex');
  return Buffer.from(str).toString('base64') + '.' + sig;
}

// Verify session token
export function verifySessionToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };
  try {
    const [encodedPayload, sig] = token.split('.');
    if (!encodedPayload || !sig) return { valid: false };

    const str = Buffer.from(encodedPayload, 'base64').toString('utf-8');
    const expectedSig = crypto.createHmac('sha256', SALT).update(str).digest('hex');

    if (sig !== expectedSig) return { valid: false };

    const payload = JSON.parse(str);
    // Token valid for 7 days
    if (Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false };
  }
}
