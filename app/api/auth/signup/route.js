import { NextResponse } from 'next/server';
import { db } from '../../db';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    
    if (db.users.find(u => u.email === email)) {
      return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 });
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    
    db.users.push(newUser);
    const { password: _, ...userData } = newUser;
    
    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
