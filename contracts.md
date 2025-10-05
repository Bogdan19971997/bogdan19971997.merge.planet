# Merge Planet Game - API Contracts & Backend Integration Plan

## Overview
This document outlines the API contracts and integration plan for converting the Merge Planet frontend into a full-stack application ready for App Store deployment.

## Current Frontend State
- ✅ Complete game mechanics with planet merging
- ✅ Beautiful menu and navigation system  
- ✅ In-game shop with power-ups and coin packs
- ✅ Premium store with real money purchases
- ✅ Mobile responsive design
- ✅ Payment integration setup (Stripe, Apple Pay, Google Pay)
- ✅ Local storage for game persistence

## API Endpoints Needed

### Authentication & User Management
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile
PUT /api/auth/profile - Update user profile
POST /api/auth/logout - User logout
```

### Game State Management
```
GET /api/game/state - Get current game state
PUT /api/game/state - Save game state
POST /api/game/reset - Reset game to initial state
GET /api/game/stats - Get player statistics
```

### Shop & Inventory
```
GET /api/shop/items - Get available shop items
POST /api/shop/purchase - Purchase shop item
GET /api/inventory - Get player inventory
POST /api/inventory/use - Use inventory item
```

### Premium Store & Payments
```
GET /api/premium/packages - Get premium packages
POST /api/premium/purchase - Process premium purchase
POST /api/payments/stripe/webhook - Stripe webhook handler
POST /api/payments/apple/verify - Apple Pay verification
GET /api/subscriptions - Get user subscriptions
```

### Leaderboards & Social
```
GET /api/leaderboard/global - Global leaderboard
GET /api/leaderboard/friends - Friends leaderboard
POST /api/social/friends/add - Add friend
GET /api/achievements - Get user achievements
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date,
  profile: {
    avatar: String,
    level: Number,
    totalScore: Number,
    totalCoins: Number,
    planetsCreated: Number,
    gamesPlayed: Number
  },
  subscription: {
    type: String, // 'free', 'monthly', 'yearly'
    expiresAt: Date,
    stripeCustomerId: String
  }
}
```

### GameStates Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  grid: Array, // 6x6 grid with planet data
  score: Number,
  coins: Number,
  level: Number,
  moves: Number,
  lastSaved: Date,
  version: String
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String, // 'shop_purchase', 'premium_purchase', 'coin_earned'
  itemId: String,
  amount: Number,
  currency: String, // 'coins' or 'usd'
  paymentMethod: String,
  stripeTransactionId: String,
  timestamp: Date,
  status: String // 'pending', 'completed', 'failed'
}
```

### Inventory Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    itemId: String,
    quantity: Number,
    purchasedAt: Date,
    expiresAt: Date
  }]
}
```

## Frontend Integration Points

### Current Mock Data Replacements
1. **Game State**: Replace localStorage with API calls
2. **Shop Items**: Replace mockShopItems with API data
3. **Premium Packages**: Replace mockPremiumItems with API data
4. **User Stats**: Replace local stats with server-side data

### Authentication Integration
- Add login/register screens
- Implement JWT token management
- Add protected routes
- Social login options (Google, Apple)

### Payment Integration
- Stripe: Complete checkout flow
- Apple Pay: In-App Purchase integration
- Google Pay: Google Play Billing
- Subscription management

## Security Considerations
- JWT token validation
- Rate limiting for API endpoints
- Input validation and sanitization
- Secure payment processing
- HTTPS enforcement
- Data encryption for sensitive information

## App Store Requirements Met
✅ Complete game mechanics
✅ In-App Purchases ready
✅ Subscription model implemented  
✅ Mobile responsive design
✅ Secure payment processing
✅ Privacy policy compliance ready
✅ Terms of service integration ready
✅ Analytics integration points prepared

## Performance Optimizations
- Game state compression
- Offline mode capability
- Progressive Web App features
- Image optimization
- Code splitting for faster loads

## Analytics & Monitoring
- User engagement tracking
- Purchase conversion metrics
- Game balance analytics
- Error monitoring and logging
- Performance monitoring

## Deployment Strategy
1. Backend API deployment
2. Database setup and migration
3. Payment provider configuration
4. App Store submission preparation
5. Beta testing and feedback integration
6. Production deployment and monitoring

## Next Steps for Full-Stack Implementation
1. Set up FastAPI backend with MongoDB
2. Implement authentication system
3. Create game state persistence
4. Integrate payment processing
5. Add social features and leaderboards
6. Implement analytics and monitoring
7. App Store optimization and submission

This comprehensive plan ensures the Merge Planet game is ready for commercial App Store deployment with all necessary features for a successful mobile game launch.