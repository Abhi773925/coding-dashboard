# 🚀 Profile Feature Documentation

## Overview

The Profile feature is a comprehensive multi-platform coding profile system that aggregates data from various coding platforms like LeetCode, GitHub, GeeksforGeeks, CodeChef, Codeforces, and HackerRank to create a unified developer profile.

## 🌟 Features

### ✅ **Multi-Platform Integration**
- **LeetCode**: Problem solving stats, contest ratings, badges, submission calendar
- **GitHub**: Repositories, contributions, stars, followers, language statistics
- **GeeksforGeeks**: Problem solving, badges, institute ranking
- **CodeChef**: Competitive programming stats
- **Codeforces**: Contest ratings and problem solving
- **HackerRank**: Skills assessment and challenges

### ✅ **Smart Caching System**
- 6-hour cache duration for platform data
- Reduces API calls and improves performance
- Background refresh scheduling
- Cache invalidation controls

### ✅ **Interactive UI Components**
- **ProfileDashboard**: Main dashboard with tabbed interface
- **ProfileHeader**: User info with edit capabilities
- **PlatformCards**: Platform connection and stats display
- **ActivityHeatmap**: GitHub-style activity visualization
- **SkillsOverview**: Technology stack and skill analysis
- **AchievementShowcase**: Badges and milestone tracking
- **ProfileStats**: Comprehensive statistics overview

### ✅ **Advanced Analytics**
- Profile completeness scoring
- Activity trends and insights
- Cross-platform skill analysis
- Achievement tracking system
- Performance recommendations

## 📁 File Structure

```
backend/
├── controllers/
│   └── profilecontrollers.js     # Main profile logic
├── models/
│   └── User.js                   # Enhanced user model
├── routes/
│   └── profileroutes.js          # Profile API routes
└── services/
    └── platformDataService.js    # Caching service

frontend/src/components/Profile/
├── ProfileDashboard.jsx          # Main dashboard component
├── ProfileHeader.jsx             # Profile header with edit
├── PlatformCards.jsx             # Platform connection cards
├── PlatformModal.jsx             # Platform connection modal
├── ProfileStats.jsx              # Statistics overview
├── ActivityHeatmap.jsx           # Activity visualization
├── SkillsOverview.jsx            # Skills and technologies
├── AchievementShowcase.jsx       # Badges and achievements
├── RecentActivity.jsx            # Recent activity feed
└── index.js                      # Components export
```

## 🛠 API Endpoints

### Profile Management
- `POST /api/profile/update` - Update platform usernames
- `POST /api/profile/update-basic` - Update basic profile info
- `GET /api/profile/user?email=...` - Get user profile with stats
- `POST /api/profile/validate` - Validate platform usernames

### Analytics & Public Access
- `GET /api/profile/score?email=...` - Get developer score
- `GET /api/profile/analytics?email=...` - Get profile analytics
- `GET /api/profile/public/:identifier` - Get public profile

## 🚀 Quick Start

### 1. Backend Setup

Install required dependencies:
```bash
cd backend
npm install axios cheerio
```

The User model has been enhanced with additional fields:
```javascript
// New fields added to User schema
bio: String,
location: String,
website: String,
codechef: String,
codeforces: String,
hackerrank: String,
platformStatsCache: Map, // For caching
preferences: Object      // User preferences
```

### 2. Frontend Integration

Import and use the profile components:
```jsx
import { ProfileDashboard } from './components/Profile';

function App() {
  return (
    <div className="App">
      <ProfileDashboard />
    </div>
  );
}
```

### 3. Testing the API

Use the demo page to test the functionality:
```bash
# Open in browser
http://localhost:3000/profile-demo.html
```

## 📊 Platform Data Examples

### LeetCode Response
```json
{
  "username": "rockstarabhishek",
  "problemStats": {
    "totalSolved": 1134,
    "difficulty": {
      "easy": 430,
      "medium": 383,
      "hard": 48
    }
  },
  "contestStats": {
    "rating": 1425,
    "attended": 1,
    "globalRanking": 24820
  },
  "badges": [...],
  "calendar": {
    "streak": 20,
    "totalActiveDays": 319,
    "submissionCalendar": {...}
  }
}
```

### GitHub Response
```json
{
  "profile": {
    "name": "Abhishek Kumar",
    "login": "Abhi773925",
    "bio": "Full-stack developer...",
    "followers": 50,
    "following": 75
  },
  "stats": {
    "publicRepos": 25,
    "totalStars": 150
  },
  "contributions": {
    "total": 1200
  },
  "languages": [
    { "name": "JavaScript", "count": 15 },
    { "name": "Python", "count": 8 }
  ]
}
```

## 🎨 UI Components

### ProfileDashboard
Main component with tabbed interface:
- Overview: Quick stats and recent activity
- Platforms: Detailed platform connections
- Skills: Technology stack analysis
- Activity: Heatmap visualization
- Achievements: Badges and milestones
- Analytics: Performance insights

### Key Features
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatic theme detection
- **Smooth Animations**: Framer Motion animations
- **Real-time Updates**: Live data fetching
- **Interactive Elements**: Hover effects and transitions

## 🔧 Configuration

### Environment Variables
```env
# Add these to your .env file
GITHUB_API_TOKEN=your_github_token (optional)
LEETCODE_SESSION=your_leetcode_session (optional)
CACHE_DURATION=21600000 # 6 hours in ms
```

### Platform Rate Limits
- **GitHub**: 60 requests/hour (unauthenticated), 5000 (authenticated)
- **LeetCode**: No official limits, but respect fair usage
- **GeeksforGeeks**: Web scraping, use responsibly

## 📈 Analytics & Scoring

### Developer Score Calculation
```javascript
// LeetCode: problems × 10 + rating + badges × 50
// GitHub: repos × 5 + stars × 10 + contributions × 0.5
// GeeksforGeeks: problems × 5 + coding_score
```

### Achievement System
- **Legendary**: 1000+ problems, expert ratings
- **Epic**: 500+ problems, advanced skills
- **Rare**: 100+ problems, consistent activity
- **Common**: Basic achievements

## 🛡️ Security & Privacy

### Data Privacy
- Users control profile visibility
- Public/private profile settings
- No sensitive data storage
- Cached data encryption (planned)

### Rate Limiting
- Smart caching reduces API calls
- Background refresh scheduling
- Respect platform rate limits
- Error handling for failed requests

## 🚀 Performance Optimizations

### Caching Strategy
- **Platform Data**: 6-hour cache duration
- **Background Refresh**: Non-blocking updates
- **Memory Efficiency**: Map-based storage
- **Cache Invalidation**: Manual and automatic

### Frontend Optimizations
- **Lazy Loading**: Components load on demand
- **Memoization**: React.memo for expensive components
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: WebP support with fallbacks

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: Platform activity alerts
- **Social Features**: Follow other developers
- **Leaderboards**: Platform-wise rankings
- **Data Export**: PDF/JSON profile export
- **Mobile App**: React Native implementation

### Platform Additions
- **Stack Overflow**: Reputation and badges
- **Kaggle**: Competition rankings
- **TopCoder**: Algorithm competitions
- **AtCoder**: Japanese competitive programming

## 🐛 Troubleshooting

### Common Issues

**1. Platform validation fails**
```javascript
// Check username format and platform availability
// Ensure platform profile is public
```

**2. Cached data not updating**
```javascript
// Clear cache manually via API
await fetch('/api/profile/clear-cache', { method: 'POST' });
```

**3. Rate limit exceeded**
```javascript
// Implement exponential backoff
// Use authenticated requests where possible
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/profile-enhancement`
3. Make changes and test thoroughly
4. Submit pull request with detailed description

### Code Standards
- Follow ESLint configuration
- Use TypeScript for type safety
- Write comprehensive tests
- Document new features

## 📞 Support

For issues and questions:
- 📧 Email: support@prepmate.site
- 🐙 GitHub: [Create an issue](https://github.com/Abhi773925/prepmate/issues)
- 💬 Discord: [Join our community](https://discord.gg/prepmate)

---

Built with ❤️ by [Abhishek Kumar](https://github.com/Abhi773925) for the PrepMate community.
