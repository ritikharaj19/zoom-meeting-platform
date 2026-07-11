import { NextResponse } from 'next/server';
import { db } from '../db';

export async function GET() {
  return NextResponse.json(db.meetings);
}

export async function POST(request) {
  const body = await request.json();
  const meetingId = Math.random().toString(36).substring(2, 11) + '-' + Math.random().toString(36).substring(2, 5);
  
  const newMeeting = {
    id: Date.now().toString(),
    meeting_id: meetingId,
    title: body.title || 'Instant Meeting',
    start_time: body.start_time || new Date().toISOString(),
    duration: body.duration || 60,
    created_at: new Date().toISOString()
  };
  
  db.meetings.push(newMeeting);
  
  return NextResponse.json(newMeeting, { status: 201 });
}
