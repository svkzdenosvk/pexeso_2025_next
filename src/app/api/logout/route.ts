import { NextResponse } from 'next/server';
import {verifyApiOrigin} from '@pexeso/_inc/data'

//GET handler for logout user ->after click on log out buttton -> user´s cookie will be deleted
export async function GET(req: Request) {

  const origin = req.headers.get('origin');
  
  //origin protection
  if (!verifyApiOrigin(origin)) {
    return NextResponse.json(
      { error: 'not_allowed_origin' },
      { status: 403 }
    );
  }
  //creation od response with return { success: true }
  const response = NextResponse.json({ success: true });

  // delete authentication cookie  "token"
  //setup value to empty string and expired date in past
  response.cookies.set('token', '', {
    httpOnly: true, //cookies is not accessible via JS -> safer
    secure: true, // only via HTTPS
    sameSite: 'strict', // no cross-site requests
    path: '/', // applies for entire domain
    expires: new Date(0), // setup as expired
  });

  return response;
}
