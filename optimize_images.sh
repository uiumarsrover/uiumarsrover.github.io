#!/bin/bash

# Image optimization script for faster website loading
echo "🚀 Starting image optimization..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually"
        exit 1
    fi
fi

# Create optimized images directory
mkdir -p images/optimized

# Optimize JPG images
echo "📸 Optimizing JPG images..."
find images -name "*.jpg" -type f | while read -r file; do
    filename=$(basename "$file")
    output="images/optimized/${filename%.jpg}_opt.jpg"
    
    # Resize if larger than 1200px and compress
    convert "$file" -resize "1200x1200>" -quality 85 "$output"
    
    # Show size reduction
    original_size=$(du -h "$file" | cut -f1)
    optimized_size=$(du -h "$output" | cut -f1)
    echo "✅ $filename: $original_size → $optimized_size"
done

# Optimize PNG images
echo "🖼️ Optimizing PNG images..."
find images -name "*.png" -type f | while read -r file; do
    filename=$(basename "$file")
    output="images/optimized/${filename%.png}_opt.png"
    
    # Resize if larger than 1200px and compress
    convert "$file" -resize "1200x1200>" -quality 85 "$output"
    
    # Show size reduction
    original_size=$(du -h "$file" | cut -f1)
    optimized_size=$(du -h "$output" | cut -f1)
    echo "✅ $filename: $original_size → $optimized_size"
done

echo "🎉 Image optimization complete!"
echo "📁 Optimized images saved in: images/optimized/"
echo "💡 Update your HTML files to use the optimized versions"
