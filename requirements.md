# Requirements Document

## Project Overview

**Project Name:** Phenix Scraper AI

**Description:** An AI-powered content creation and management platform that helps creators and businesses generate written content, design visuals, scrape YouTube data, and schedule posts with intelligent automation.

**Target Audience:** Content creators, social media managers, marketers, and businesses looking to streamline their content creation workflow.

---

## Functional Requirements

### 1. Landing Page

#### 1.1 Hero Section
- Display compelling headline with gradient text styling
- Show value proposition and key benefits
- Provide CTA buttons for "Start Creating Free" and "Try the Demo"
- Include trust indicators (e.g., "Trusted by 10,000+ creators")
- Implement animated background effects and grid patterns

#### 1.2 Features Section
- Display feature cards highlighting core capabilities:
  - AI Content Writer
  - Brand-Aligned Design
  - Smart Scheduling
  - Learning capabilities
  - Unified Dashboard
- Use icons and descriptions for each feature
- Implement scroll animations for visual engagement

#### 1.3 Dashboard Preview
- Show preview image/demo of the dashboard interface
- Provide visual context for potential users

#### 1.4 Call-to-Action Section
- Secondary CTA to encourage user conversion
- Clear messaging about platform benefits

#### 1.5 Footer
- Display company information
- Include relevant links and legal information

#### 1.6 Navigation
- Responsive navigation bar
- Links to main sections and dashboard

### 2. Dashboard

#### 2.1 Dashboard Layout
- Sidebar navigation with sections:
  - Dashboard (Content Manager)
  - Writer
  - Images
  - YouTube
  - Scheduler
  - Brand Settings
- Responsive design for mobile and desktop
- Active section highlighting

#### 2.2 Content Manager
- Central hub for managing all content
- Navigation to other dashboard sections
- Content history display
- Quick access to recent content

#### 2.3 Content Writer
- Generate content for multiple formats:
  - Blog posts
  - Social media posts
  - Email content
  - Captions
- Input fields for:
  - Content type selection
  - Topic/subject
  - Tone preference
  - Brand style
  - Additional context
- Real-time content generation
- Content editing and refinement
- Save and export functionality

#### 2.4 Image Generator
- AI-powered image creation
- Brand-aligned visual generation
- Image customization options
- Download and save functionality
- Integration with brand settings

#### 2.5 YouTube Scraper
- Search YouTube videos by query
- Get channel statistics and information
- Retrieve video details (title, description, stats)
- Get channel videos list
- Display video thumbnails and metadata
- Support for:
  - Video search with customizable result count
  - Channel lookup by ID or name
  - Individual video details
  - Channel video listings

#### 2.6 Scheduler
- Content scheduling interface
- AI-powered optimal posting time analysis
- Calendar view for scheduled content
- Multi-platform scheduling support
- Schedule management (create, edit, delete)

#### 2.7 Brand Settings
- Configure brand identity:
  - Brand voice/tone
  - Style guidelines
  - Color schemes
  - Logo and visual assets
- Save and apply brand settings across all features
- Brand consistency enforcement

### 3. Content Generation API

#### 3.1 Generate Content Endpoint
- Accept parameters:
  - Content type (blog, social, email, caption)
  - Topic
  - Tone (optional)
  - Brand style (optional)
  - Additional context (optional)
- Return generated content
- Error handling and validation

#### 3.2 Generate Image Endpoint
- Accept image generation parameters
- Return generated image URL or data
- Support brand-aligned styling

#### 3.3 Analyze Schedule Endpoint
- Analyze audience engagement patterns
- Recommend optimal posting times
- Return scheduling insights

#### 3.4 YouTube Scraper Endpoint
- Support multiple actions:
  - searchVideos
  - getChannelStats
  - getVideoDetails
  - getChannelVideos
- Return structured data with video/channel information
- Handle YouTube API integration

### 4. Data Management

#### 4.1 Content History
- Store generated content
- Track content versions
- Enable content retrieval and reuse
- Content categorization and tagging

#### 4.2 Brand Settings Storage
- Persist brand configuration
- Version control for brand guidelines
- User-specific brand profiles

#### 4.3 Schedule Storage
- Store scheduled posts
- Track posting status
- Maintain scheduling history

---

## Non-Functional Requirements

### 5. Performance

#### 5.1 Response Time
- Content generation: < 10 seconds
- Image generation: < 15 seconds
- YouTube data retrieval: < 3 seconds
- Page load time: < 2 seconds
- Dashboard navigation: < 500ms

#### 5.2 Scalability
- Support concurrent users
- Handle multiple API requests simultaneously
- Efficient database queries

### 6. Security

#### 6.1 Authentication
- Secure user authentication via Supabase
- API key protection
- Environment variable management

#### 6.2 Data Protection
- Secure API endpoints
- Input validation and sanitization
- Protection against common vulnerabilities (XSS, CSRF)

#### 6.3 API Security
- Rate limiting on API endpoints
- API key authentication
- Secure communication (HTTPS)

### 7. Usability

#### 7.1 User Interface
- Intuitive and clean design
- Responsive layout (mobile, tablet, desktop)
- Consistent design language using shadcn/ui components
- Accessible UI components
- Dark/light theme support

#### 7.2 User Experience
- Clear navigation and information architecture
- Helpful error messages and feedback
- Loading states and progress indicators
- Toast notifications for user actions
- Smooth animations and transitions

### 8. Compatibility

#### 8.1 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

#### 8.2 Device Support
- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

### 9. Maintainability

#### 9.1 Code Quality
- TypeScript for type safety
- ESLint configuration for code standards
- Component-based architecture
- Reusable hooks and utilities
- Clear file organization

#### 9.2 Testing
- Unit tests with Vitest
- Component testing with React Testing Library
- Test coverage for critical paths

#### 9.3 Documentation
- Code comments for complex logic
- README with setup instructions
- API documentation
- Component documentation

### 10. Reliability

#### 10.1 Error Handling
- Graceful error handling throughout the application
- User-friendly error messages
- Fallback UI for failed states
- Retry mechanisms for API calls

#### 10.2 Availability
- 99.9% uptime target
- Proper error boundaries in React
- Fallback content for failed API calls

---

## Technical Requirements

### 11. Technology Stack

#### 11.1 Frontend
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19 (build tool)
- React Router DOM 6.30.1 (routing)
- TanStack Query 5.83.0 (data fetching)
- Framer Motion 12.33.0 (animations)

#### 11.2 UI Framework
- shadcn/ui components
- Radix UI primitives
- Tailwind CSS 3.4.17
- Lucide React (icons)

#### 11.3 Backend
- Supabase (BaaS)
- Supabase Edge Functions (serverless)
- Supabase Database (PostgreSQL)

#### 11.4 Form Management
- React Hook Form 7.61.1
- Zod 3.25.76 (validation)

#### 11.5 Development Tools
- ESLint (linting)
- Vitest (testing)
- TypeScript ESLint

### 12. API Integration

#### 12.1 Supabase Integration
- Supabase client configuration
- Environment variable management
- Type-safe database queries

#### 12.2 External APIs
- YouTube Data API (via scraper function)
- AI content generation API
- Image generation API

### 13. Deployment

#### 13.1 Build Process
- Production build optimization
- Development build for testing
- Environment-specific configurations

#### 13.2 Hosting
- Static site hosting compatible
- CDN support
- Custom domain support

---

## Constraints and Assumptions

### 14. Constraints

- Must use Supabase as the backend platform
- Must maintain compatibility with Lovable platform
- API rate limits from external services (YouTube, AI providers)
- Browser API limitations

### 15. Assumptions

- Users have modern browsers with JavaScript enabled
- Users have stable internet connection
- External APIs (YouTube, AI services) are available and functional
- Supabase services are operational
- Users understand basic content creation concepts

---

## Future Enhancements

### 16. Potential Features

- Multi-user collaboration
- Content templates library
- Advanced analytics and insights
- Social media platform integrations (direct posting)
- Content calendar with team management
- A/B testing for content
- SEO optimization suggestions
- Multi-language support
- Content performance tracking
- AI model fine-tuning with user data
- Export to various formats (PDF, DOCX, etc.)
- Content approval workflows
- Integration with design tools (Figma, Canva)
- Voice-to-text content generation
- Batch content generation
- Content versioning and rollback
