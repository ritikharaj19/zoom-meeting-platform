import { NextResponse } from 'next/server';
import { db } from '../../db';

export async function GET(request, { params }) {
  const { id } = params;
  const meeting = db.meetings.find(m => m.meeting_id === id);
  
  if (!meeting) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  
  return NextResponse.json(meeting);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const index = db.meetings.findIndex(m => m.meeting_id === id);
  if (index !== -1) {
    db.meetings.splice(index, 1);
  }
  return NextResponse.json({ success: true });
}

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();
  const index = db.meetings.findIndex(m => m.meeting_id === id);
  
  if (index !== -1) {
    db.meetings[index] = { ...db.meetings[index], ...body };
    return NextResponse.json(db.meetings[index]);
  }
  return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
}
