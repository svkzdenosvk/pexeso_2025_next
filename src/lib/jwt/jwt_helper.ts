import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface JwtPayload {
  id: number;
  email: string;
}

/**
 * Generates a signed JWT token for given user data.
 * @param id - User ID
 * @param email - User email
 * @returns Signed JWT string
 */
export function signToken(id: number, email: string): string {
      const payload: JwtPayload = { id, email };

//   return jwt.sign({ id, email }, JWT_SECRET, {
      return jwt.sign(payload, JWT_SECRET, {

    expiresIn: JWT_EXPIRES_IN  } as jwt.SignOptions );
}

/**
 * Verifies and decodes a JWT token.
 * @param token - JWT string from cookies
 * @returns Decoded payload if valid, otherwise null
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
