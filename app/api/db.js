if (!global.db) {
  global.db = { meetings: [
    { id: '1', meeting_id: '87818370076', title: 'My Meeting', start_time: new Date().toISOString(), duration: 60, created_at: new Date().toISOString() },
    { id: '2', meeting_id: '89570292244', title: 'My Meeting', start_time: new Date().toISOString(), duration: 60, created_at: new Date().toISOString() }
  ] };
}
if (!global.db.users) {
  global.db.users = [{ id: '1', email: 'rritikha@gmail.com', password: 'password123', name: 'Ritikha Raj' }];
}
export const db = global.db;
