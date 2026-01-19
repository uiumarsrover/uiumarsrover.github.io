#!/bin/bash

# Simple CSS minification script for faster website loading
echo "🎨 Starting simple CSS minification..."

# Create minified CSS directory
mkdir -p css/minified

# Function to minify CSS
minify_css() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local output_file="css/minified/${filename%.css}.min.css"
    
    echo "Processing: $filename"
    
    # Remove comments, extra whitespace, and minify CSS
    cat "$input_file" | \
        sed 's/\/\*.*\*\///g' | \
        sed 's/[[:space:]]\+/ /g' | \
        sed 's/[[:space:]]*{[[:space:]]*/{/g' | \
        sed 's/[[:space:]]*}[[:space:]]*/}/g' | \
        sed 's/[[:space:]]*:[[:space:]]*/:/g' | \
        sed 's/[[:space:]]*;[[:space:]]*/;/g' | \
        sed 's/[[:space:]]*,[[:space:]]*/,/g' | \
        sed 's/[[:space:]]*$//' | \
        sed '/^[[:space:]]*$/d' > "$output_file"
    
    # Show size reduction
    original_size=$(du -h "$input_file" | cut -f1)
    minified_size=$(du -h "$output_file" | cut -f1)
    echo "✅ $filename: $original_size → $minified_size"
}

# Minify all CSS files
find css -name "*.css" -type f | while read -r css_file; do
    minify_css "$css_file"
done

echo "🎉 Simple CSS minification complete!"
echo "📁 Minified CSS saved in: css/minified/"
echo "💡 Update your HTML files to use the minified versions"
