import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@pexeso/lib/firebase/firebase-admin';

//checking cookies if user is logged in
export async function GET() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decoded.uid);

    return NextResponse.json({
      isLoggedIn: true,
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
    });
  } catch (err) {
    console.error('Auth check error:', err);
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}
