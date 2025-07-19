import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@pexeso/lib/firebase/firebase-admin';
import {verifyApiOrigin} from '@pexeso/_inc/data'

// GET handler -> checking if user is logged in from cookies 
export async function GET(req: Request) {

  const origin = req.headers.get('origin');
  
  //origin protection
  if (!verifyApiOrigin(origin)) {
    return NextResponse.json(
      { error: 'not_allowed_origin' },
      { status: 403 }
    );
  }
  
  // loading cookies
  const cookieStore = await cookies(); 
  //get token cookies value if exists
  const token = cookieStore.get('token')?.value;

  //if token not exists -> user is not logged in
  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    //token validation by Firebase Admin SDK
    const decoded = await adminAuth.verifyIdToken(token);
    //loading  info about user by UID from token
    const user = await adminAuth.getUser(decoded.uid);

    // return info that user is logged in and info about user
    return NextResponse.json({
      isLoggedIn: true,
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
    });
  } catch (err) {
    //error during verification of token (expired, invalid, ...)
    console.error('Auth check error:', err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
