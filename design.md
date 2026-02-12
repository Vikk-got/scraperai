# Design Document

## Project Overview

**Project Name:** Phenix Scraper AI

**Architecture:** Single Page Application (SPA) with serverless backend

**Design Philosophy:** Clean, modern, and intuitive interface with AI-powered automation that learns and adapts to user preferences.

---

## System Architecture

### 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React SPA (Vite + TypeScript)              │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │  Landing   │  │ Dashboard  │  │   Routing  │    │  │
│  │  │    Page    │  │   Pages    │  │  (Router)  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │         UI Components (shadcn/ui)              │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer (Supabase)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Supabase Edge Functions                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │  │   Generate   │  │   Generate   │  │  Analyze  │ │  │
│  │  │   Content    │  │    Image     │  │ Schedule  │ │  │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │  │
│  │  ┌──────────────┐                                    │  │
│  │  │   YouTube    │                                    │  │
│  │   Scraper    │                                    │  │
│  │  └──────────────┘                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Supabase PostgreSQL Database                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │  │
│  │  │  Users   │  │ Content  │  │  Brand Settings  │  │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │  │
│  │  ┌──────────┐  ┌──────────┐                         │  │
│  │  │ Schedule │  │ History  │                         │  │
│  │  └──────────┘  └──────────┘                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  YouTube API │  │  AI Content  │  │  AI Image    │     │
│  │              │  │  Generation  │  │  Generation  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2. Component Architecture

#### 2.1 Frontend Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base components
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── DashboardLayout.tsx
│   │   ├── ContentManager.tsx
│   │   ├── ContentWriter.tsx
│   │   ├── ImageGenerator.tsx
│   │   ├── YouTubeScraper.tsx
│   │   ├── Scheduler.tsx
│   │   └── BrandSettings.tsx
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── DashboardPreview.tsx
│   ├── CTASection.tsx
│   └── Footer.tsx
├── pages/
│   ├── Index.tsx              # Landing page
│   ├── Dashboard.tsx          # Main dashboard
│   └── NotFound.tsx           # 404 page
├── hooks/
│   ├── useContentGenerator.ts
│   ├── useImageGenerator.ts
│   ├── useYouTubeScraper.ts
│   ├── useScheduleAnalyzer.ts
│   ├── useBrandSettings.ts
│   └── useContentHistory.ts
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client setup
│       └── types.ts           # Database types
├── lib/
│   └── utils.ts               # Utility functions
└── App.tsx                    # Root component
```

---

## Data Models

### 3. Database Schema

#### 3.1 Users Table
```typescript
interface User {
  id: string;                  // UUID, primary key
  email: string;               // Unique
  created_at: timestamp;
  updated_at: timestamp;
  subscription_tier?: string;  // free, pro, enterprise
}
```

#### 3.2 Content Table
```typescript
interface Content {
  id: string;                  // UUID, primary key
  user_id: string;             // Foreign key to users
  type: 'blog' | 'social' | 'email' | 'caption';
  topic: string;
  tone?: string;
  content: string;             // Generated content
  brand_style?: string;
  created_at: timestamp;
  updated_at: timestamp;
  status: 'draft' | 'published' | 'scheduled';
}
```

#### 3.3 Brand Settings Table
```typescript
interface BrandSettings {
  id: string;                  // UUID, primary key
  user_id: string;             // Foreign key to users
  brand_name: string;
  brand_voice: string;
  tone: string;
  style_guidelines: json;      // Flexible JSON structure
  color_scheme: json;
  logo_url?: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

#### 3.4 Schedule Table
```typescript
interface Schedule {
  id: string;                  // UUID, primary key
  user_id: string;             // Foreign key to users
  content_id: string;          // Foreign key to content
  platform: string;            // social media platform
  scheduled_time: timestamp;
  status: 'pending' | 'published' | 'failed';
  created_at: timestamp;
  updated_at: timestamp;
}
```

#### 3.5 Images Table
```typescript
interface Image {
  id: string;                  // UUID, primary key
  user_id: string;             // Foreign key to users
  prompt: string;
  image_url: string;
  brand_aligned: boolean;
  created_at: timestamp;
}
```

#### 3.6 YouTube Data Cache Table
```typescript
interface YouTubeCache {
  id: string;                  // UUID, primary key
  user_id: string;             // Foreign key to users
  query_type: 'video' | 'channel';
  query_params: json;
  result_data: json;
  cached_at: timestamp;
  expires_at: timestamp;
}
```

---

## API Design

### 4. Edge Functions

#### 4.1 Generate Content Function

**Endpoint:** `/functions/v1/generate-content`

**Method:** POST

**Request Body:**
```typescript
{
  type: 'blog' | 'social' | 'email' | 'caption';
  topic: string;
  tone?: string;
  brandStyle?: string;
  additionalContext?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  content: string;
  metadata?: {
    wordCount: number;
    estimatedReadTime: number;
  };
  error?: string;
}
```

**Flow:**
1. Validate request parameters
2. Retrieve user's brand settings (if available)
3. Construct AI prompt with context
4. Call AI content generation API
5. Post-process and format content
6. Store in database
7. Return generated content

#### 4.2 Generate Image Function

**Endpoint:** `/functions/v1/generate-image`

**Method:** POST

**Request Body:**
```typescript
{
  prompt: string;
  brandSettings?: {
    colorScheme: string[];
    style: string;
  };
  dimensions?: {
    width: number;
    height: number;
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  imageUrl: string;
  error?: string;
}
```

#### 4.3 YouTube Scraper Function

**Endpoint:** `/functions/v1/youtube-scraper`

**Method:** POST

**Request Body:**
```typescript
{
  action: 'searchVideos' | 'getChannelStats' | 'getVideoDetails' | 'getChannelVideos';
  query?: string;
  videoId?: string;
  channelId?: string;
  maxResults?: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: VideoResult[] | ChannelResult | VideoResult;
  error?: string;
}
```

**Actions:**
- `searchVideos`: Search YouTube for videos matching query
- `getChannelStats`: Get channel information and statistics
- `getVideoDetails`: Get detailed information about a specific video
- `getChannelVideos`: Get list of videos from a channel

#### 4.4 Analyze Schedule Function

**Endpoint:** `/functions/v1/analyze-schedule`

**Method:** POST

**Request Body:**
```typescript
{
  userId: string;
  platform: string;
  contentType: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  recommendations: {
    optimalTimes: timestamp[];
    reasoning: string;
    engagementPrediction: number;
  };
  error?: string;
}
```

---

## UI/UX Design

### 5. Design System

#### 5.1 Color Palette

**Primary Colors:**
- Primary: `hsl(38, 92%, 50%)` - Warm orange/gold
- Background: `hsl(var(--background))`
- Foreground: `hsl(var(--foreground))`

**Semantic Colors:**
- Success: Green variants
- Error: Red variants
- Warning: Yellow variants
- Info: Blue variants

**Theme Support:**
- Light mode
- Dark mode
- System preference detection

#### 5.2 Typography

**Font Family:**
- System font stack for optimal performance
- Fallback to sans-serif

**Font Sizes:**
- Heading 1: 3.5rem - 4rem (56px - 64px)
- Heading 2: 2rem - 2.5rem (32px - 40px)
- Heading 3: 1.5rem - 2rem (24px - 32px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

#### 5.3 Spacing System

Based on Tailwind CSS spacing scale (4px base unit):
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

#### 5.4 Component Patterns

**Buttons:**
- Primary: Solid background with primary color
- Secondary: Outlined with border
- Ghost: Transparent with hover effect
- Hero: Large, prominent CTA buttons
- Sizes: sm, md, lg, xl

**Cards:**
- Glass effect with backdrop blur
- Subtle borders and shadows
- Hover animations
- Consistent padding

**Forms:**
- Clear labels and placeholders
- Inline validation
- Error states with messages
- Loading states
- Success feedback

**Navigation:**
- Sticky header
- Responsive mobile menu
- Active state indicators
- Smooth transitions

### 6. Page Layouts

#### 6.1 Landing Page Layout

**Structure:**
```
┌─────────────────────────────────────┐
│           Navbar (Fixed)            │
├─────────────────────────────────────┤
│                                     │
│          Hero Section               │
│     (Full viewport height)          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│        Features Section             │
│      (Grid of feature cards)        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      Dashboard Preview              │
│     (Screenshot/mockup)             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│         CTA Section                 │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

**Key Features:**
- Gradient background with animated glow effects
- Grid pattern overlay for depth
- Scroll-triggered animations
- Responsive breakpoints

#### 6.2 Dashboard Layout

**Structure:**
```
┌──────────┬──────────────────────────────┐
│          │                              │
│          │      Dashboard Header        │
│          │                              │
│          ├──────────────────────────────┤
│          │                              │
│ Sidebar  │                              │
│          │      Main Content Area       │
│ - Home   │                              │
│ - Writer │    (Dynamic based on         │
│ - Images │     active section)          │
│ - YouTube│                              │
│ - Sched. │                              │
│ - Brand  │                              │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

**Responsive Behavior:**
- Desktop: Persistent sidebar
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation or hamburger menu

### 7. User Flows

#### 7.1 Content Generation Flow

```
1. User navigates to Content Writer
   ↓
2. User selects content type (blog/social/email/caption)
   ↓
3. User enters topic and optional parameters
   ↓
4. User clicks "Generate"
   ↓
5. Loading state displayed
   ↓
6. AI generates content
   ↓
7. Content displayed in editor
   ↓
8. User can edit, regenerate, or save
   ↓
9. Content saved to history
```

#### 7.2 YouTube Scraper Flow

```
1. User navigates to YouTube section
   ↓
2. User selects action (search/channel/video)
   ↓
3. User enters query or ID
   ↓
4. User clicks "Search" or "Get Data"
   ↓
5. Loading state displayed
   ↓
6. API fetches YouTube data
   ↓
7. Results displayed in cards/list
   ↓
8. User can view details or use data for content
```

#### 7.3 Scheduling Flow

```
1. User creates or selects content
   ↓
2. User navigates to Scheduler
   ↓
3. User selects platform and date/time
   ↓
4. AI suggests optimal posting times
   ↓
5. User confirms or adjusts schedule
   ↓
6. Schedule saved
   ↓
7. Confirmation displayed
```

---

## State Management

### 8. Client State

#### 8.1 React Query (TanStack Query)

**Purpose:** Server state management and caching

**Usage:**
- API data fetching
- Caching responses
- Background refetching
- Optimistic updates

**Key Queries:**
- `useContentHistory` - Fetch user's content history
- `useBrandSettings` - Fetch brand configuration
- `useScheduledPosts` - Fetch scheduled content

#### 8.2 React Hooks

**Custom Hooks:**
- `useContentGenerator` - Content generation logic
- `useImageGenerator` - Image generation logic
- `useYouTubeScraper` - YouTube data fetching
- `useScheduleAnalyzer` - Schedule optimization
- `useBrandSettings` - Brand settings management
- `useContentHistory` - Content history management

**Built-in Hooks:**
- `useState` - Local component state
- `useEffect` - Side effects
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values

#### 8.3 Form State

**React Hook Form:**
- Form validation with Zod schemas
- Error handling
- Field registration
- Submit handling

---

## Security Design

### 9. Authentication & Authorization

#### 9.1 Authentication Flow

```
1. User visits application
   ↓
2. Supabase checks for existing session
   ↓
3. If no session → Redirect to login
   ↓
4. User authenticates (email/password, OAuth)
   ↓
5. Supabase creates session
   ↓
6. JWT token stored in browser
   ↓
7. Token included in API requests
```

#### 9.2 API Security

**Edge Functions:**
- API key validation
- JWT token verification
- Rate limiting per user
- Input sanitization
- CORS configuration

**Environment Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- Server-side secrets for AI APIs

### 10. Data Security

#### 10.1 Data Protection

- HTTPS for all communications
- Encrypted data at rest (Supabase)
- Row-level security (RLS) policies
- User data isolation

#### 10.2 Input Validation

- Client-side validation with Zod
- Server-side validation in Edge Functions
- XSS prevention
- SQL injection prevention (via Supabase ORM)

---

## Performance Optimization

### 11. Frontend Optimization

#### 11.1 Code Splitting

- Route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy features

#### 11.2 Asset Optimization

- Image optimization and lazy loading
- SVG icons (Lucide React)
- Minification and compression
- Tree shaking unused code

#### 11.3 Rendering Optimization

- React.memo for expensive components
- useMemo and useCallback for optimization
- Virtual scrolling for long lists
- Debouncing user inputs

### 12. Backend Optimization

#### 12.1 Caching Strategy

- React Query caching for API responses
- YouTube data caching in database
- Stale-while-revalidate pattern
- Cache invalidation on updates

#### 12.2 API Optimization

- Batch requests where possible
- Pagination for large datasets
- Selective field fetching
- Connection pooling (Supabase)

---

## Error Handling

### 13. Error Strategy

#### 13.1 Frontend Error Handling

**Error Boundaries:**
- Catch React component errors
- Display fallback UI
- Log errors for debugging

**API Error Handling:**
- Try-catch blocks in async functions
- User-friendly error messages
- Toast notifications for errors
- Retry mechanisms for transient failures

**Validation Errors:**
- Form field validation
- Inline error messages
- Prevent invalid submissions

#### 13.2 Backend Error Handling

**Edge Functions:**
- Input validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)
- Detailed error logging

**Error Response Format:**
```typescript
{
  success: false;
  error: string;
  details?: any;
}
```

---

## Testing Strategy

### 14. Testing Approach

#### 14.1 Unit Testing

**Tools:** Vitest, React Testing Library

**Coverage:**
- Utility functions
- Custom hooks
- Component logic
- Form validation

#### 14.2 Integration Testing

**Coverage:**
- API integration
- Form submissions
- Navigation flows
- State management

#### 14.3 E2E Testing (Future)

**Tools:** Playwright or Cypress

**Coverage:**
- Critical user journeys
- Content generation flow
- Scheduling flow
- Authentication flow

---

## Deployment Architecture

### 15. Deployment Strategy

#### 15.1 Frontend Deployment

**Build Process:**
```bash
npm run build
```

**Output:**
- Optimized static files
- Minified JavaScript
- Compressed assets
- Source maps (optional)

**Hosting Options:**
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

#### 15.2 Backend Deployment

**Supabase:**
- Managed PostgreSQL database
- Edge Functions auto-deployed
- Automatic scaling
- Global CDN

#### 15.3 CI/CD Pipeline

**Automated Workflow:**
1. Code push to repository
2. Run linting and tests
3. Build application
4. Deploy to staging
5. Run smoke tests
6. Deploy to production

---

## Monitoring & Analytics

### 16. Observability

#### 16.1 Application Monitoring

- Error tracking (Sentry or similar)
- Performance monitoring
- User session recording
- API response times

#### 16.2 Analytics

- User behavior tracking
- Feature usage metrics
- Conversion funnels
- A/B testing results

#### 16.3 Logging

- Frontend error logs
- Backend function logs
- API request logs
- Database query logs

---

## Accessibility

### 17. Accessibility Standards

#### 17.1 WCAG Compliance

**Target:** WCAG 2.1 Level AA

**Key Areas:**
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus indicators
- ARIA labels and roles
- Alt text for images

#### 17.2 Semantic HTML

- Proper heading hierarchy
- Semantic elements (nav, main, footer)
- Form labels and descriptions
- Button vs link usage

---

## Scalability Considerations

### 18. Growth Planning

#### 18.1 Database Scaling

- Indexed columns for queries
- Partitioning for large tables
- Read replicas for heavy read loads
- Connection pooling

#### 18.2 API Scaling

- Rate limiting per user tier
- Caching frequently accessed data
- Async processing for heavy tasks
- Queue system for batch operations

#### 18.3 Frontend Scaling

- CDN for static assets
- Service worker for offline support
- Progressive Web App (PWA) features
- Optimized bundle sizes

---

## Maintenance & Updates

### 19. Maintenance Plan

#### 19.1 Regular Updates

- Dependency updates (monthly)
- Security patches (as needed)
- Feature releases (bi-weekly)
- Bug fixes (continuous)

#### 19.2 Backup Strategy

- Database backups (daily)
- Point-in-time recovery
- Disaster recovery plan
- Data retention policies

#### 19.3 Documentation

- API documentation
- Component documentation
- User guides
- Developer onboarding docs
