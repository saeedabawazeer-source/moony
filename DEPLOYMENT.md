# Deployment Fix for Replit Static Deployment

## Problem
The deployment was failing because:
- Vite builds static files to `dist/public/` directory
- Replit static deployment expects files directly in `dist/` directory
- Core configuration files (vite.config.ts, package.json, .replit) cannot be modified

## Solution
Created a post-build script that moves files from `dist/public/` to `dist/` to match Replit's expectations.

## How to Deploy

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Fix the Directory Structure
```bash
./fix-deployment.sh
```

### Step 3: Deploy on Replit
Click the "Deploy" button in your Replit interface. The files will now be in the correct location for static deployment.

## Files Created

### `fix-deployment.sh`
- Shell script that moves files from `dist/public/` to `dist/`
- Makes the structure compatible with Replit's static deployment
- Can be run after every build

### `scripts/build-for-deployment.js`
- Node.js version of the fix script
- Alternative option for environments where shell scripts aren't preferred

## Deployment Process
1. The build process creates files in `dist/public/` (due to Vite configuration)
2. The fix script moves all files from `dist/public/` to `dist/`
3. The `dist/public/` directory is removed
4. Replit deployment finds the static files in the expected `dist/` location

## Automated Solution
For automated deployments, you can chain the commands:
```bash
npm run build && ./fix-deployment.sh
```

This ensures the files are always in the correct location for deployment.