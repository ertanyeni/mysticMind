# mysticMind - Product Requirements Document (PRD)

## 1. Project Overview

### 1.1 Project Description
mysticMind is a mobile application that allows users to record, analyze, and track their dreams using artificial intelligence. The app provides a personal dream journal experience with AI-powered dream interpretation capabilities.

### 1.2 Target Audience
- Individuals interested in dream analysis and interpretation
- Users who want to maintain a personal dream journal
- People seeking AI-powered insights about their dreams
- Both casual users (guest access) and dedicated dream journalers

### 1.3 Platform & Technology Stack
- **Platform**: iOS and Android (React Native + TypeScript)
- **Backend**: Supabase
  - Authentication
  - Database
  - Email services
- **AI Integration**: OpenAI API
- **State Management**: React Query / Zustand or Redux Toolkit
- **Navigation**: Expo Router
- **Development Framework**: Expo
- **Internationalization**: i18n

## 2. User Scenarios

### 2.1 Authentication Approach (MVP Focus)
1. **Guest User Access**
   - Users can access the app without registration
   - Experience core dream journaling functionality
   - Data stored locally on device
   - Option to register later and preserve data

2. **User Registration Requirements**
   - Required fields:
     - First name
     - Last name
     - Date of birth
     - Gender (using predefined enum gender_type)
     - Email address
     - Username
     - Password (minimum 8 characters, at least one uppercase, one lowercase, one number)
   - Email verification required
   - No social login options (Google, Apple) in MVP

3. **Login Options**
   - Email and password login only
   - Password reset functionality

### 2.2 Guest User Flow
1. User opens app without registration
2. Can immediately start recording dreams
3. Access AI interpretation features
4. Data stored locally
5. Option to register later

### 2.3 Registered User Flow
1. Email registration with required personal info
2. Full access to all features
3. Cloud sync of dream entries
4. Cross-device access
5. Profile customization

### 2.4 Core User Journeys
1. **Dream Recording**
   - Open app
   - Navigate to dream entry
   - Record dream details
   - Add tags
   - Save entry

2. **Dream Analysis**
   - View saved dream
   - Request AI interpretation
   - View interpretation results
   - Save/export analysis

3. **Dream Journal Management**
   - Browse past entries
   - Search/filter dreams
   - View statistics
   - Export journal

## 3. Technical Requirements

### 3.1 Performance Requirements
- App launch time < 2 seconds
- Smooth scrolling (60 fps)
- Offline-first functionality
- Efficient data caching
- Optimized image loading

### 3.2 Security Requirements
- Secure authentication
- Encrypted data storage
- Secure API communication
- Token management
- Input validation

### 3.3 Technical Specifications
- TypeScript strict mode enabled
- React Native best practices
- Modular architecture
- Clean code principles
- Comprehensive testing

## 4. Screen List

### 4.1 Authentication Screens
- Welcome Screen
- Login Screen (email only)
- Registration Screen (with required fields)
- Forgot Password Screen

### 4.2 Main App Screens
- Home Screen
- Dream Entry Screen
- AI Interpretation Screen
- Dream Archive Screen
- Profile Screen
- Settings Screen

## 5. Database Structure

### 5.1 Users Table
```sql
users (
  id: uuid PRIMARY KEY,
  email: string UNIQUE,
  username: string UNIQUE,
  first_name: string,
  last_name: string,
  birth_date: date,
  gender: gender_type ENUM,
  created_at: timestamp,
  updated_at: timestamp,
  preferences: jsonb
  /* Note: Password is stored in auth.users table managed by Supabase Auth */
)
```

### 5.2 Dreams Table
```sql
dreams (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  title: string,
  content: text,
  date: timestamp,
  tags: string[],
  ai_interpretation: text,
  created_at: timestamp,
  updated_at: timestamp,
  is_private: boolean
)
```

### 5.3 Tags Table
```sql
tags (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  name: string,
  color: string,
  created_at: timestamp
)
```

## 6. API Requirements

### 6.1 Authentication APIs
- Register (with required personal info)
- Login (email only)
- Logout
- Password Reset
- Email Verification

### 6.2 Dream Management APIs
- Create Dream
- Update Dream
- Delete Dream
- Get Dreams List
- Get Dream Details
- Search Dreams

### 6.3 AI Integration APIs
- Get Dream Interpretation
- Save Interpretation
- Update Interpretation

### 6.4 User Management APIs
- Update Profile
- Update Preferences
- Get User Statistics

## 7. Feature Backlog

### 7.1 MVP Features (Phase 1)
- [x] Basic dream entry
- [x] Guest user support
- [x] Email-only authentication
- [x] Required registration fields (name, DOB, gender, email, username, password)
- [x] Basic AI interpretation
- [x] Dream archive
- [x] Dark mode
- [x] Basic profile management

### 7.2 Future Features (Phase 2)
- [ ] Advanced AI analysis
- [ ] Dream patterns visualization
- [ ] Export functionality
- [ ] Social features
- [ ] Premium features
- [ ] PWA support
- [ ] Social login options (Google, Apple)

## 8. MVP Definition & Roadmap

### 8.1 MVP Scope
- Core dream journaling functionality
- Basic AI interpretation
- Guest and registered user support (email only)
- Essential UI/UX features
- Basic offline support
- Required user registration fields (including username, password, and gender as enum)

### 8.2 Development Phases

#### Phase 1: Foundation (Weeks 1-4)
- Project setup
- Basic UI components
- Authentication flow (Guest & Email)
- Database structure with required user fields

#### Phase 2: Core Features (Weeks 5-8)
- Dream entry functionality
- AI integration
- Basic offline support
- Profile management

#### Phase 3: Polish (Weeks 9-12)
- UI/UX refinement
- Performance optimization
- Testing
- Bug fixes

#### Phase 4: Launch Preparation (Weeks 13-16)
- Final testing
- App store preparation
- Documentation
- Launch

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)
- User registration rate
- Daily active users
- Dream entry frequency
- AI interpretation usage
- User retention rate
- App store ratings

### 9.2 Quality Metrics
- App crash rate
- Load time performance
- API response times
- User satisfaction scores

## 10. Maintenance & Support

### 10.1 Regular Maintenance
- Weekly bug fixes
- Monthly feature updates
- Quarterly security audits
- Performance monitoring

### 10.2 Support Channels
- In-app support
- Email support
- FAQ documentation
- User guides

## 11. Risks & Mitigation

### 11.1 Technical Risks
- AI API costs
- Data synchronization issues
- Performance problems
- Security vulnerabilities

### 11.2 Business Risks
- User adoption
- Market competition
- Revenue generation
- User retention

## 12. Appendix

### 12.1 Design Guidelines
- Color palette
- Typography
- Component library
- Animation guidelines

### 12.2 Development Guidelines
- Coding standards
- Git workflow
- Testing requirements
- Documentation requirements 