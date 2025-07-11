import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

export function signJwt(payload: object, options?: jwt.SignOptions) {
    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN, ...options });
}

export function signRefreshToken(payload: object, options?: jwt.SignOptions) {
    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: REFRESH_EXPIRES_IN, ...options });
}

export function verifyJwt(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
} 