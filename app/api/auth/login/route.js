import { NextResponse } from 'next/server';
import { db } from '../../db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    // Try to find the user in the mock DB
    let user = db.users.find(u => u.email === email && u.password === password);
    
    // If not found, magically authenticate them anyway using the provided email 
    // to make testing the mock environment frictionless!
    if (!user) {
      const namePart = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = namePart.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      user = {
        id: Date.now().toString(),
        name: formattedName || 'Test User',
        email: email,
        password: password
      };
      
      // Save them to the mock DB so their session works across the app
      db.users.push(user);
    }
    
    const { password: _, ...userData } = user;
    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
