#!/bin/bash

# Fix deployment structure for static deployment
# Moves files from dist/public/ to dist/ to match Replit's expected structure

echo "Fixing build structure for deployment..."

# Check if dist/public exists
if [ ! -d "dist/public" ]; then
    echo "No dist/public directory found. Run 'npm run build' first."
    exit 1
fi

echo "Moving files from dist/public/ to dist/..."

# Move all files from dist/public to dist
cd dist/public
for item in *; do
    if [ -e "$item" ]; then
        echo "Moving: $item"
        mv "$item" "../$item"
    fi
done

# Go back to dist and remove empty public directory
cd ..
rmdir public

echo "Build structure fixed! Files are now in dist/ for deployment."
echo "Your app should now deploy correctly on Replit."