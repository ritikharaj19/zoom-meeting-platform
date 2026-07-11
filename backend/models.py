from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    display_name = Column(String)
    
    # Relationships
    meetings_hosted = relationship("Meeting", back_populates="host")
    participations = relationship("Participant", back_populates="user")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(String, unique=True, index=True)
    title = Column(String, default="Instant Meeting")
    description = Column(String, nullable=True)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    duration_minutes = Column(Integer, nullable=True) # None for instant
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Foreign Keys
    host_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relationships
    host = relationship("User", back_populates="meetings_hosted")
    participants = relationship("Participant", back_populates="meeting")

class Participant(Base):
    __tablename__ = "participants"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    guest_name = Column(String, nullable=True) # For non-logged in users
    joined_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_host = Column(Boolean, default=False)
    
    # Relationships
    meeting = relationship("Meeting", back_populates="participants")
    user = relationship("User", back_populates="participations")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    sender_name = Column(String, nullable=True) # Fallback for guests
    content = Column(String)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    meeting = relationship("Meeting", backref="messages")
    sender = relationship("User", backref="messages_sent")
