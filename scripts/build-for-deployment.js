#!/usr/bin/env node
/**
 * Post-build script to fix deployment structure
 * Moves files from dist/public/ to dist/ for static deployment compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function moveFiles() {
  const distDir = path.join(rootDir, 'dist');
  const publicDir = path.join(distDir, 'public');
  
  // Check if dist/public exists
  if (!fs.existsSync(publicDir)) {
    console.log('No dist/public directory found, skipping file move');
    return;
  }
  
  console.log('Moving files from dist/public/ to dist/ for deployment...');
  
  try {
    // Get list of files and directories in dist/public
    const items = fs.readdirSync(publicDir);
    
    for (const item of items) {
      const srcPath = path.join(publicDir, item);
      const destPath = path.join(distDir, item);
      
      // Remove destination if it exists
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }
      
      // Move the item
      fs.renameSync(srcPath, destPath);
      console.log(`Moved: ${item}`);
    }
    
    // Remove the now-empty public directory
    fs.rmSync(publicDir, { recursive: true, force: true });
    console.log('Removed empty public directory');
    
    console.log('Build structure fixed for deployment');
  } catch (error) {
    console.error('Error during file move:', error);
    process.exit(1);
  }
}

moveFiles();