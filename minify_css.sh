#!/bin/bash

# CSS minification script for faster website loading
echo "🎨 Starting CSS minification..."

# Check if css-minify is available
if ! command -v css-minify &> /dev/null; then
    echo "📦 Installing css-minify..."
    npm install -g css-minify
fi

# Create minified CSS directory
mkdir -p css/minified

# Minify all CSS files
echo "🔧 Minifying CSS files..."
for css_file in css/*.css; do
    if [ -f "$css_file" ]; then
        filename=$(basename "$css_file")
        output="css/minified/${filename%.css}.min.css"
        
        echo "Processing: $filename"
        css-minify "$css_file" -o "$output"
        
        # Show size reduction
        original_size=$(du -h "$css_file" | cut -f1)
        minified_size=$(du -h "$output" | cut -f1)
        echo "✅ $filename: $original_size → $minified_size"
    fi
done

echo "🎉 CSS minification complete!"
echo "📁 Minified CSS saved in: css/minified/"
echo "💡 Update your HTML files to use the minified versions"
