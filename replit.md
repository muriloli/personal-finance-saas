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
- July 05, 2025. Successfully migrated from Replit Agent to standard Replit environment
  - Fixed server configuration to run on port 5000 with 0.0.0.0 binding
  - Set up PostgreSQL database with proper schema and seeding
  - Fixed transaction form schema to exclude userId field from frontend validation
  - Resolved authentication middleware integration
  - Connected to user's Supabase database for persistent data storage
  - All components now working correctly in standard Replit environment
- July 02, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.