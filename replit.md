# YouTube Video Player

## Overview

This is a modern YouTube video player application that supports multiple URL formats including standard links, short links, and embedded URLs. The application is built using a full-stack TypeScript architecture with React on the frontend and Express on the backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds
- **UI Components**: Comprehensive set of Radix UI-based components via shadcn/ui

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **API Pattern**: RESTful API with `/api` prefix
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for compilation

### Database Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon Database)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: @neondatabase/serverless for serverless connections

## Key Components

### Frontend Components
1. **UrlInput**: Handles YouTube URL input with validation
2. **VideoPlayer**: Displays embedded YouTube videos or placeholder
3. **FeaturesSection**: Showcases application capabilities
4. **UI Components**: Complete shadcn/ui component library

### Backend Components
1. **Routes**: RESTful API endpoints (to be implemented)
2. **Storage**: Abstracted storage interface with in-memory implementation
3. **Vite Integration**: Development server with HMR support

### Shared Components
1. **Schema**: Drizzle ORM schema definitions
2. **Type Safety**: Shared TypeScript types between frontend and backend

## Data Flow

1. **URL Processing**: User inputs YouTube URL → Validation → Video ID extraction
2. **Video Loading**: Video ID → YouTube embed URL generation → Player display
3. **State Management**: React Query manages loading states and caching
4. **API Communication**: Frontend communicates with backend via RESTful endpoints

## External Dependencies

### Core Technologies
- **React Ecosystem**: React, React Query, React Hook Form
- **UI Framework**: Radix UI primitives with shadcn/ui styling
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Development Tools**: Vite, TypeScript, Tailwind CSS

### Third-party Services
- **YouTube**: Video embedding and playback
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development environment integration

## Deployment Strategy

### Development
- **Command**: `npm run dev`
- **Process**: tsx runs server with Vite middleware for frontend
- **Features**: Hot module replacement, TypeScript compilation, API proxying

### Production
- **Build**: `npm run build` compiles both frontend (Vite) and backend (esbuild)
- **Start**: `npm run start` runs compiled Express server
- **Assets**: Static frontend assets served from Express

### Database Management
- **Schema**: `npm run db:push` applies schema changes to database
- **Migrations**: Drizzle Kit manages migration files in `/migrations`

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Added download functionality with yt-dlp integration
  * Added downloads table to schema
  * Created download API endpoints for video info and download management
  * Implemented DownloadModal component with format selection
  * Added one-click download capability to video player
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```