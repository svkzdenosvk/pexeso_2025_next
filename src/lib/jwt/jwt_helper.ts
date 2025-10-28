import jwt /*, { SignOptions }*/ from "jsonwebtoken";
import type {  My_Type_Unique_User} from '@pexeso/_inc/my_types';

// /** TREBA PREPISAT KOMENTáRE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//  * 🔐 JWT Helper Utilities
//  * ----------------------------------------------------------
//  * This module handles creation and verification of JWT tokens
//  * used for authenticating users in the application.
//  *
//  * Functions:
//  *  • signToken() → Creates a signed JWT for a given user
//  *  • verifyToken() → Validates and decodes an existing token
//  *
//  * Required environment variables:
//  *  • JWT_SECRET="your_secret_key"
//  *  • JWT_EXPIRES_IN="7d"   (optional, default 7 days)
//  *
//  * Dependencies:
//  *  • jsonwebtoken
//  */
type MsString = `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`; // napr. 15m, 7d, 2h

// Load environment variables
const JWT_SHORT_SECRET = process.env.JWT_SHORT_SECRET!;
const JWT_LONG_SECRET = process.env.JWT_LONG_SECRET as string;
const JWT_SHORT_EXPIRES_IN : MsString= process.env.JWT_SHORT_IN as MsString || '15m';
const JWT_LONG_EXPIRES_IN : MsString = process.env.JWT_LONG_EXPIRES_IN as MsString || "7d"; 

/** Create short-lived access token */
export function signShortToken(id: number, email: string): string {
  const payload: My_Type_Unique_User = { id, email };
  
   return jwt.sign(payload, JWT_SHORT_SECRET,{expiresIn: JWT_SHORT_EXPIRES_IN});

}

/** Create long-lived refresh token */
export function signLongToken(id: number): string {
  return jwt.sign({ id }, JWT_LONG_SECRET, { expiresIn: JWT_LONG_EXPIRES_IN });
}

/** Verify access token */
export function verifyShortToken(token: string) {
  try {
    return jwt.verify(token, JWT_SHORT_SECRET) as My_Type_Unique_User;
  } catch {
    return null;
  }
}

/** Verify refresh token */
export function verifyLongToken(token: string) {
  try {
    return jwt.verify(token, JWT_LONG_SECRET) as { id: number };
  } catch {
    return null;
  }
}

// /**
//  * Generates a signed JWT token for given user data.
//  * @param {number} id - User ID
//  * @param {string} email - User email
//  * @returns Signed JWT string
//  */
// export function signToken(id: number, email: string): string {
//       const payload: My_Type_Unique_User = { id, email }; // Token payload

//       return jwt.sign(payload, JWT_SECRET, {

//     expiresIn: JWT_EXPIRES_IN,  // Expiration time (e.g. '7d')
//     } as jwt.SignOptions ); 
// }

// /**
//  * Verifies and decodes a JWT token.
//  * @param {string} token - JWT string from cookies
//  * @returns Decoded payload if valid, otherwise null
//  */
// export function verifyToken(token: string): My_Type_Unique_User | null {
//   try {
//     return jwt.verify(token, JWT_SECRET) as My_Type_Unique_User; // Returns decoded payload
//   } catch (error) {
//     console.error('JWT verification failed:', error);  // Log invalid/expired token
//     return null; // Invalid token
//   }
// }
