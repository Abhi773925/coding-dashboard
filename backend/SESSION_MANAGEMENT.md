# Collaboration Session Management

This document describes the backend features for managing collaboration sessions with automatic cleanup and analytics.

## Features

### 1. Session Persistence
- All collaboration sessions are stored in MongoDB
- Sessions include code history, chat messages, execution history, and participant tracking
- Automatic TTL (Time To Live) index ensures sessions are deleted after 7 days of inactivity

### 2. Session Analytics
- Track daily, weekly, and monthly statistics for each user
- Language usage tracking
- Execution and collaboration metrics
- Analytics data is retained for 1 year

### 3. Automatic Cleanup
- **Inactive Room Cleanup**: Runs every 30 minutes to clean up rooms with no active users
- **Database Session Cleanup**: Marks sessions as inactive after 2 hours of no activity
- **Daily Cleanup**: Runs at midnight to remove old data and update statistics
- **TTL Index**: MongoDB automatically removes sessions after 7 days of inactivity

## API Endpoints

### Session Management
- `POST /api/sessions` - Create a new collaboration session
- `GET /api/sessions/:roomId` - Get session details
- `POST /api/sessions/:roomId/join` - Join a session
- `POST /api/sessions/:roomId/leave` - Leave a session
- `GET /api/sessions` - Get user's session history

### Analytics
- `GET /api/sessions/analytics` - Get user analytics and statistics
- `GET /api/sessions/stats` - Get global collaboration statistics

### Search & Discovery
- `GET /api/sessions/search` - Search public sessions

### Admin
- `POST /api/sessions/admin/cleanup` - Manual cleanup of inactive sessions

## Database Models

### CollaborationSession
```javascript
{
  roomId: String,           // Unique room identifier
  title: String,            // Session title
  participants: Array,      // List of participants with join/leave times
  currentCode: String,      // Current code state
  language: String,         // Programming language
  codeHistory: Array,       // History of code changes
  executionHistory: Array,  // History of code executions
  chatMessages: Array,      // Chat messages
  isActive: Boolean,        // Session status
  lastActivity: Date,       // Last activity timestamp (TTL index)
  settings: Object,         // Session settings
  metadata: Object          // Statistics and metrics
}
```

### SessionAnalytics
```javascript
{
  userId: ObjectId,         // User reference (optional for guests)
  guestId: String,          // Guest identifier
  date: Date,               // Analytics date (TTL index - 1 year)
  dailyStats: Object,       // Daily statistics
  weeklyStats: Object,      // Weekly statistics  
  monthlyStats: Object      // Monthly statistics
}
```

## Cleanup Schedule

### Real-time Cleanup
- **Socket Disconnection**: Immediate cleanup when users disconnect
- **Room Emptying**: Immediate cleanup when last user leaves

### Periodic Cleanup
- **Every 5 minutes**: Update active session analytics
- **Every 30 minutes**: Clean up inactive rooms and database sessions
- **Daily at midnight**: Clean up old analytics data

### Automatic Cleanup
- **7 days**: Sessions automatically deleted by MongoDB TTL index
- **1 year**: Analytics data automatically deleted by MongoDB TTL index

## Configuration

### Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

### TTL Settings
- Session TTL: 7 days (604800 seconds)
- Analytics TTL: 1 year (31536000 seconds)

## Usage Examples

### Creating a Session
```javascript
POST /api/sessions
{
  "title": "Algorithm Practice",
  "description": "Working on sorting algorithms",
  "settings": {
    "isPublic": true,
    "maxParticipants": 5
  }
}
```

### Joining a Session
```javascript
POST /api/sessions/ABC12345/join
{
  "name": "John Doe",
  "email": "john@example.com",
  "guestId": "guest_123"
}
```

### Getting Analytics
```javascript
GET /api/sessions/analytics?days=30
```

## Socket.IO Integration

The session management integrates with Socket.IO for real-time features:

- **Room Management**: Automatic room creation and cleanup
- **Real-time Updates**: Code changes, language switches, executions
- **Chat Integration**: Messages are saved to database
- **User Tracking**: Active users, join/leave events
- **Analytics Updates**: Real-time statistics updates

## Security Features

- **Guest Support**: Allow anonymous collaboration
- **User Authentication**: Support for logged-in users
- **Session Privacy**: Public/private session settings
- **Rate Limiting**: Built-in through Socket.IO
- **Data Validation**: Input validation on all endpoints

## Monitoring

### Health Check
```javascript
GET /api/health
```

Returns server status including session statistics:
```javascript
{
  "status": "ok",
  "sessions": {
    "active": 5,
    "total": 150,
    "analyticsRecords": 1200
  }
}
```

### Global Statistics
```javascript
GET /api/sessions/stats
```

Returns global collaboration statistics and leaderboards.
