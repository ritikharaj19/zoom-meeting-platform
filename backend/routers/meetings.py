from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api/meetings",
    tags=["meetings"]
)

@router.post("/", response_model=schemas.Meeting)
def create_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(get_db)):
    # Generate unique 9-11 digit meeting ID similar to zoom
    meeting_id = str(uuid.uuid4().int)[:10] 
    db_meeting = models.Meeting(
        meeting_id=meeting_id,
        title=meeting.title,
        description=meeting.description,
        start_time=meeting.start_time,
        duration_minutes=meeting.duration_minutes
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@router.get("/", response_model=List[schemas.Meeting])
def get_meetings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    meetings = db.query(models.Meeting).order_by(models.Meeting.created_at.desc()).offset(skip).limit(limit).all()
    return meetings

@router.get("/{meeting_id}", response_model=schemas.Meeting)
def get_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(models.Meeting).filter(models.Meeting.meeting_id == meeting_id).first()
    if meeting is None:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting
