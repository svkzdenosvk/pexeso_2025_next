// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { adminAuth, adminDB } from '@pexeso/lib/firebase/firebase-admin';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  let userUid: string | null = null;

  try {
    // 1️⃣ Vytvorenie používateľa vo Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    userUid = userRecord.uid;

    // 2️⃣ Pokus o zápis do Firestore
    await adminDB.collection('users').doc(userUid).set({
      name,
      email,
      createdAt: new Date(),
    });
        
    // ✅ Všetko prebehlo úspešne
     return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error during registration:', error);

    // 3️⃣ Ak Firestore zlyhá, ale Auth už prešiel → pokus o zmazanie
    if (userUid) {
      try {
        await adminAuth.deleteUser(userUid);
        console.log('🧹 User deleted from Auth after Firestore failure');
      } catch (deleteError) {
        console.error('⚠️ Failed to rollback Auth user:', deleteError);
      }
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
