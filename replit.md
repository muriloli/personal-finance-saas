# Personal Finance Micro SaaS Web Panel

## Overview

This is a comprehensive Personal Finance Micro SaaS web application built with modern web technologies. The system serves as a dashboard and management interface for users to track their financial transactions, which can be input through both the web interface and a WhatsApp AI bot integration. The application provides real-time financial insights, categorization, and reporting capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Session Management**: Custom session handling with database storage
- **API Design**: RESTful API with structured error handling

### Data Storage
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations in `./migrations` directory
- **Connection Pooling**: Neon serverless connection pool with WebSocket support

## Key Components

### Authentication & Authorization
- **Authentication Method**: CPF-based login system
- **Session Management**: JWT-like session tokens stored in database
- **Authorization**: Route-based protection with session validation
- **User Context**: React Context API for global auth state

### Financial Data Management
- **Transaction System**: Income/expense tracking with categorization
- **Category Management**: Default and custom categories with color coding
- **Data Sources**: Web input and WhatsApp bot integration markers
- **Real-time Updates**: Query invalidation for immediate UI updates

### User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme System**: Light/dark mode with CSS custom properties
- **Component Library**: Consistent design system using Radix UI primitives
- **Data Visualization**: Recharts for financial charts and analytics

### Business Logic
- **Transaction Processing**: Validation, categorization, and storage
- **Financial Analytics**: Dashboard metrics and trend analysis
- **Export Functionality**: CSV export for transaction data
- **Settings Management**: User preferences and notification controls

## Data Flow

1. **User Authentication**: CPF validation → Session creation → Token storage
2. **Transaction Input**: Form submission → Validation → Database storage → UI update
3. **Data Retrieval**: API request → Database query → Data transformation → UI rendering
4. **Real-time Updates**: Mutation → Cache invalidation → UI refresh

### Database Schema
- **Users**: CPF-based user accounts with activation status
- **Categories**: Income/expense categories with visual identifiers
- **Transactions**: Financial records with category relationships
- **Sessions**: Authentication tokens with expiration
- **Settings**: User preferences and configuration

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **@radix-ui/***: Accessible UI component primitives
- **recharts**: Data visualization library

### Development Tools
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

### Integration Services
- **Neon Database**: Serverless PostgreSQL hosting
- **WhatsApp API**: External bot integration (referenced in schema)

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon development instance
- **Environment Variables**: DATABASE_URL required for connection

### Production Build
- **Frontend**: Vite production build with optimizations
- **Backend**: ESBuild bundling for Node.js runtime
- **Static Assets**: Served from `dist/public` directory
- **Database**: Neon production instance with connection pooling

### Environment Configuration
- **NODE_ENV**: Controls development/production behavior
- **DATABASE_URL**: PostgreSQL connection string (required)
- **Session Configuration**: Database-backed session storage

## Changelog
- July 12, 2025. Enhanced financial trend chart requirements, fixed timezone issues, and improved tooltip information
  - Changed trend chart requirement from 3 transactions to 3 months of transaction data for more meaningful analysis
  - Updated multilingual messages explaining the 3-month requirement in Portuguese, English, and Spanish
  - Fixed timezone issue where transaction dates were appearing one day earlier than selected
  - Implemented proper date parsing in all formatDate functions to avoid UTC conversion issues
  - Enhanced date processing to prevent PostgreSQL timezone interpretation problems
  - Transaction dates now correctly reflect the user's selected date regardless of timezone
  - Improved income vs expenses chart tooltip to show detailed information with proper formatting
  - Added custom tooltip component displaying "Receita" and "Despesa" with currency values in BRL
  - Enhanced user experience with better hover information similar to reference design
  - Successfully completed migration from Replit Agent to standard Replit environment
- July 11, 2025. Enhanced login system with password authentication
  - Added password field to users schema and database structure
  - Updated login form to include password input field with validation
  - Implemented bcrypt password hashing for secure authentication
  - Enhanced login API to verify both CPF and password
  - Updated AuthService and useAuth hook to handle password parameter
  - Added password field to user registration system with validation
  - Created temporary migration route for setting passwords on existing users
  - Test user (CPF: 12345678901) created with default password: "123456"
  - Improved login security from CPF-only to CPF + password authentication
- July 10, 2025. Successfully completed migration from Replit Agent to standard Replit environment
  - Enhanced "Despesas por Categoria" chart with empty state message when no expenses exist
  - Added multilingual support for empty state: "Nenhuma despesa registrada ainda" (Portuguese), "No expenses recorded yet" (English), "No hay gastos registrados aún" (Spanish)
  - Empty state shows informative message with chart icon and guidance to start adding expenses
  - Chart conditionally displays empty state or normal pie chart with legend based on data availability
  - Migration completed successfully with all functionality working including authentication, transactions, dashboard, and charts
- July 10, 2025. Implemented automatic dashboard data refresh when returning from transaction pages
  - "Back to Dashboard" button reloads entire page to ensure fresh data display
  - Transaction creation/editing uses normal cache invalidation (no page reload)
  - Page reload only occurs when explicitly navigating back to dashboard via button
  - Improved pessimistic mode in financial trend chart with stronger negative projections
  - Fixed chart line connections between historical and projected data with dashed styling for projections
  - User preference: Selective page reload only for dashboard navigation, normal flow for transactions
- July 10, 2025. Removed "Principais Categorias" (Top Categories) component from dashboard per user request
  - Eliminated sidebar with top spending categories display
  - Recent Transactions component now uses full width instead of 2/3 grid layout
  - Simplified dashboard layout for cleaner, more focused interface
  - Removed unused TopCategory interface and related calculation functions
  - Updated component structure to be more streamlined and efficient
- July 08, 2025. Complete redesign of login page with glassmorphism aesthetic using system colors
  - Switched from purple/blue theme to system's white/black color palette for consistency
  - Implemented true glassmorphism effect with backdrop-blur and transparent backgrounds
  - Repositioned login form to left side as requested, with illustration on right
  - Removed Google login and signup options, keeping only CPF login
  - Added proper Terms of Service and Privacy Policy disclaimer text
  - Enhanced glassmorphism card with subtle borders and shadow effects
  - Created sophisticated light/dark mode support using system design tokens
  - Added subtle floating financial icons using system's primary and success colors
  - Implemented responsive design with clean, modern aesthetic
  - Enhanced form styling with improved focus states and animations
  - Removed visual clutter: charts, building illustrations, and extra graphics for cleaner design
  - Maintained only essential elements: login form, central content, and statistics cards
- July 08, 2025. Enhanced login page with modern animated design and financial theme
  - Added gradient background and floating financial icons with smooth animations
  - Implemented animated chart simulation with growing bars and real-time indicators
  - Enhanced form styling with focus effects, backdrop blur, and security shield icon
  - Added floating financial icons (TrendingUp, PieChart, BarChart3, DollarSign) with timed animations
  - Created custom CSS animations: fade-in, slide-up, float, and grow effects
  - Improved visual hierarchy with gradient text, animated check marks, and statistics display
  - Maintained financial context with relevant messaging and visual elements
  - Enhanced responsive design for better mobile experience
- July 08, 2025. Fixed data inconsistency between pie chart and top categories display
  - Corrected "Principais Categorias" to show only current month data, matching pie chart behavior
  - Both charts now use identical data sources for consistent category spending amounts
  - Fixed JavaScript initialization error in financial trend chart component
  - Improved data accuracy across all dashboard components
- July 08, 2025. Enhanced financial trend chart with perspective selector and improved optimistic mode
  - Added dropdown in upper right corner for selecting trend perspective (Pessimistic, Realistic, Optimistic)
  - Fixed issue where summary cards (Receitas, Despesas, Saldo Médio) didn't update with perspective changes
  - Made optimistic mode significantly more optimistic (80% trend factor, 15% max growth, 10% income boost)
  - Added full translation support for perspective selector in all languages
  - Cards now dynamically adjust values based on selected perspective for more accurate analysis
- July 08, 2025. Successfully completed migration from Replit Agent to standard Replit environment
  - Fixed chart text visibility in dark mode by adding proper foreground color variables
  - Enhanced XAxis and YAxis text colors in both main charts and financial trend chart components
  - All chart text now properly displays in white for dark mode and appropriate colors for light mode
  - Migration completed with all functionality working correctly
- July 08, 2025. Successfully migrated project from Replit Agent to standard Replit environment
  - Fixed database connection from Neon serverless to PostgreSQL (pg) driver for better Supabase compatibility
  - Resolved WebSocket connection issues by switching from @neondatabase/serverless to standard pg package
  - Fixed API request parameter order in apiRequest function (method, url, data) to match frontend calls
  - Connected to user's existing Supabase database with proper SSL configuration
  - Verified authentication working with existing users (CPF: 22222222222)
  - All database operations now working correctly with user's existing data
  - Transaction creation, dashboard, and all features fully operational
  - Project running on port 5000 with proper client/server separation and security practices
- July 08, 2025. Implemented Financial Trend Chart with improved styling and functionality
  - Created comprehensive 3-month historical analysis with 3-month projections
  - Fixed date parsing issue (transactionDate vs date field handling)
  - Updated styling to match other dashboard components using design system tokens
  - Added trend analysis cards with income, expenses, and balance direction indicators
  - Improved chart responsiveness and visual consistency with existing components
  - Fixed critical JavaScript error that was preventing page load
  - Chart now displays properly with user's existing transaction data
- July 08, 2025. Enhanced gauge chart with motivational messages and color-coded progress indicators
  - Added visual progress messages that change based on spending percentage vs monthly limit
  - Green zone (0-60%): "Gastos sob controle - parabéns! ✨" - positive reinforcement
  - Yellow zone (61-85%): "Cuidado para não extrapolar! ⚡" - cautionary alert
  - Red zone (86-100%+): "Gastos fora de controle! 📈" - urgent warning
  - Implemented multilingual support for motivational messages (Portuguese, English, Spanish)
  - Updated color thresholds to match user specifications for better visual feedback
  - Fixed transaction creation API endpoint by correcting parameter order in apiRequest function
- July 08, 2025. Implemented gauge chart feature for monthly expense tracking
  - Added interactive gauge chart component with speedometer design showing expense progress vs budget
  - Created modal dialog for setting/editing monthly expense limits with currency formatting
  - Integrated gauge chart into dashboard with responsive 3-column grid layout
  - Added visual indicators: green (0-70%), yellow (71-90%), red (91%+) for spending levels
  - Fixed API authentication issues and schema validation for user settings updates
  - Enhanced gauge design with smooth animations, drop shadows, and status indicators
- July 06, 2025. Fixed admin user authentication and routing system
  - Updated schema to match existing Supabase database structure (admin column instead of is_admin)
  - Connected to user's Supabase database using provided DATABASE_URL
  - Fixed admin privilege detection to read from database instead of hardcoded CPF list
  - Admin users now properly redirect to user registration screen instead of dashboard
  - Added missing `/api/users/register` endpoint with validation and duplicate prevention
  - Test user (CPF: 12345678901) updated with admin privileges for testing
  - User registration functionality now fully operational for admin users
- July 06, 2025. Fixed theme toggle and language switching bugs after user feedback
  - Fixed theme toggle showing incorrect state (now correctly shows target theme name)
  - Resolved language switching causing black screen issue by fixing language code mismatches
  - Updated i18n system to use consistent language codes (pt-BR, en, es)
  - Enhanced theme detection to properly handle "system" theme setting
  - All translation keys now properly display in Portuguese and Spanish
- July 06, 2025. Successfully migrated from Replit Agent to standard Replit environment
  - Fixed package.json script compatibility for Linux environment  
  - Resolved i18n translation file with duplicate key issues
  - Enhanced chart responsiveness for desktop screens (1200px+)
  - Charts now scale from 256px on medium screens to 384px on 2XL screens
  - Server running successfully on port 5000 with database connectivity
  - All features working correctly including authentication, transactions, and dashboard
- July 06, 2025. Fixed dashboard alignment issues after user feedback
  - Enhanced chart cards to have equal heights using flexbox layout
  - Improved financial cards text alignment with better spacing and responsive design
  - Applied proper flex layout for consistent card heights across all screen sizes
- July 05, 2025. Successfully migrated from Replit Agent to standard Replit environment
  - Fixed server configuration to run on port 5000 with 0.0.0.0 binding
  - Set up PostgreSQL database with proper schema and seeding
  - Fixed transaction form schema to exclude userId field from frontend validation
  - Resolved authentication middleware integration
  - Connected to user's Supabase database for persistent data storage
  - Implemented complete edit and delete functionality for transactions
  - Fixed query parameter handling in React Query client for filters to work properly
  - Implemented automatic redirect system for unauthenticated users
  - Enhanced light mode with softer, eye-friendly colors (warm grays instead of harsh whites)
  - Improved theme toggle button with smooth animations and better visual feedback
  - **Comprehensive Mobile Responsiveness**: Enhanced all screens for optimal mobile experience
    - Dashboard: Responsive header with collapsible elements, mobile-optimized cards and charts
    - Transaction forms: Mobile-friendly layouts with proper spacing and touch targets
    - Transaction list: Responsive table with mobile-optimized button layouts
    - Login page: Mobile-first design with appropriate sizing and spacing
    - All components now use responsive breakpoints (sm:, md:, lg:) for seamless mobile experience
  - All components now working correctly in standard Replit environment
  - **Migration completed**: All required packages installed, workflow running successfully, database connected
- July 06, 2025. Enhanced dark theme with varied colors and improved visual appeal
  - Replaced flat dark colors with rich, varied shades and blue tones
  - Added gradient backgrounds for cards and buttons
  - Enhanced shadows and borders for better depth
  - Improved contrast and readability in dark mode
  - Added subtle visual effects for hover states and focus
  - Fixed Top Categories functionality to display real spending data
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.