import { NextResponse } from 'next/server';
import { prisma } from '@pexeso/lib/prisma/prisma';
import { verifyApiOrigin } from '@pexeso/_inc/functions/originValidation';
import bcrypt from 'bcrypt';

/**
 * Handles user registration via POST API using Postgres/Prisma.
 *
 * Workflow:
 * 1. Verifies request origin
 * 2. Parses and validates input data (name, email, password)
 * 3. Hashes the password using bcrypt
 * 4. Stores the user record in the Postgres `users` table via Prisma
 * 5. Handles unique email constraint errors
 *
 * @method POST
 * @returns JSON response with success or error
 */
// export async function POST(req: Request): Promise<NextResponse> { //maybe try this for TS
export async function POST(req: Request) {
  
  // ---------- 1. Verify request origin to prevent unauthorized API calls
  const origin = req.headers.get('origin');
  if (!verifyApiOrigin(origin)) {
    return NextResponse.json({ error: 'not_allowed_origin' }, { status: 403 });
  }

   // ---------- 2. Parse request body and check for required fields
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'missing_credentials' }, { status: 400 });
  }

  try {
    // ---------- 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------- 4. Create user record in Postgres via Prisma ORM
   await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // ---------- 5. Success response
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Registration error:', error);

    // ---------- Handle unique email conflict, error (P2002)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'email_registered' }, { status: 400 });
    }

    return NextResponse.json({ error: 'req_failed' }, { status: 500 });
  }
}
