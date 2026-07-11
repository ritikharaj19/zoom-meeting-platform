from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

import models
from database import engine
from routers import meetings

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zoom Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router)

class ConnectionManager:
    def __init__(self):
        # meeting_id -> list of websocket connections
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, meeting_id: str):
        await websocket.accept()
        if meeting_id not in self.active_connections:
            self.active_connections[meeting_id] = []
        self.active_connections[meeting_id].append(websocket)

    def disconnect(self, websocket: WebSocket, meeting_id: str):
        if meeting_id in self.active_connections:
            self.active_connections[meeting_id].remove(websocket)
            if not self.active_connections[meeting_id]:
                del self.active_connections[meeting_id]

    async def broadcast(self, message: str, meeting_id: str, sender: WebSocket):
        if meeting_id in self.active_connections:
            for connection in self.active_connections[meeting_id]:
                if connection != sender:
                    await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{meeting_id}")
async def websocket_endpoint(websocket: WebSocket, meeting_id: str):
    await manager.connect(websocket, meeting_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the WebRTC signaling data to others in the room
            await manager.broadcast(data, meeting_id, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, meeting_id)
        # Notify others that someone left
        leave_msg = json.dumps({"type": "user-left"})
        await manager.broadcast(leave_msg, meeting_id, websocket)

@app.get("/")
def read_root():
    return {"message": "Zoom Clone API"}
