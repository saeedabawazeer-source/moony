# Moony Swimwear - Modest Swimwear Collection

## Overview

Moony is a modern e-commerce application for modest swimwear collections. The application showcases elegant swimwear products with a focus on comfort, style, and UV protection. It features a clean, responsive design with product galleries, detailed product information, and collection-based browsing. The application is built as a full-stack web application with a React frontend and Express backend, designed to provide an elegant shopping experience for modest swimwear customers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI components
- **State Management**: React Query (@tanstack/react-query) for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Structure**: Organized into layout components (header, footer), product components (gallery, info, highlights), and reusable UI components

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript for type safety across the full stack
- **API Design**: RESTful endpoints for products and collections management
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Development**: Hot module replacement and live reload support through Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM for production deployment
- **Schema Management**: Drizzle Kit for database migrations and schema management
- **Development Storage**: In-memory storage with pre-populated product and collection data
- **Connection**: Neon serverless PostgreSQL driver for cloud database connectivity

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Architecture**: Prepared for session-based authentication with connect-pg-simple for PostgreSQL session storage

### Component Design System
- **UI Framework**: Radix UI primitives with custom styling through shadcn/ui
- **Design Tokens**: CSS custom properties for consistent theming and spacing
- **Typography**: Google Fonts integration with Playfair Display (serif) and Inter (sans-serif)
- **Icons**: Font Awesome for UI icons and custom starfish branding elements
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

### Development Workflow
- **Type Safety**: Shared TypeScript types between frontend and backend through shared schema
- **Path Aliases**: Configured import aliases for clean, maintainable code organization
- **Build Process**: Separate build targets for client (Vite) and server (esbuild)
- **Development Server**: Integrated Vite development server with Express backend proxy

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **Backend Framework**: Express.js with TypeScript support via tsx
- **Build Tools**: Vite for frontend builds, esbuild for server builds

### Database and ORM
- **Database Driver**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: Drizzle ORM with Drizzle Kit for schema management and migrations
- **Session Storage**: connect-pg-simple for PostgreSQL-backed sessions

### UI and Styling
- **CSS Framework**: Tailwind CSS with PostCSS and Autoprefixer
- **Component Library**: Radix UI primitives (@radix-ui/react-*) for accessible components
- **UI Components**: shadcn/ui component system built on Radix primitives
- **Styling Utilities**: class-variance-authority for component variants, clsx for conditional classes
- **Icons**: Font Awesome CDN, Lucide React for component icons

### Development and Tooling
- **TypeScript**: Full TypeScript support across frontend and backend
- **Validation**: Zod for runtime type validation and schema parsing
- **Development**: Replit-specific plugins for development environment integration
- **Font Loading**: Google Fonts for typography (Playfair Display, Inter)

### Additional Features
- **Date Handling**: date-fns for date manipulation and formatting
- **Carousel**: embla-carousel-react for image galleries and product showcases
- **Forms**: React Hook Form with Hookform resolvers for form validation
- **Command Interface**: cmdk for search and command palette functionality

## Deployment Configuration

### Static Deployment Fix
**Issue**: Vite builds static files to `dist/public/` but Replit static deployment expects files directly in `dist/`

**Solution**: Created post-build scripts to move files from `dist/public/` to `dist/` after build
- `fix-deployment.sh`: Shell script for moving files after build
- `scripts/build-for-deployment.js`: Node.js alternative script
- Process: Run `npm run build` then `./fix-deployment.sh` before deployment

**Architecture Decision**: Core configuration files (vite.config.ts, package.json, .replit) are locked and cannot be modified, requiring post-build fix approach

### Deployment Process
1. Build with `npm run build` (outputs to `dist/public/`)
2. Run `./fix-deployment.sh` to move files to `dist/`
3. Deploy via Replit interface - files now in expected location