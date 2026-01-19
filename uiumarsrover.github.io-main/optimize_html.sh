#!/bin/bash

# HTML optimization script for faster website loading
echo "🌐 Starting HTML optimization..."

# Create optimized HTML directory
mkdir -p html_optimized

# Function to optimize HTML
optimize_html() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local output_file="html_optimized/$filename"
    
    echo "Processing: $filename"
    
    # Remove comments, extra whitespace, and minify HTML
    cat "$input_file" | \
        sed 's/<!--.*-->//g' | \
        sed 's/[[:space:]]\+/ /g' | \
        sed 's/>[[:space:]]*</></g' | \
        sed 's/[[:space:]]*$//' | \
        sed '/^[[:space:]]*$/d' > "$output_file"
    
    # Show size reduction
    original_size=$(du -h "$input_file" | cut -f1)
    optimized_size=$(du -h "$output_file" | cut -f1)
    echo "✅ $filename: $original_size → $optimized_size"
}

# Optimize all HTML files
find . -name "*.html" -type f | while read -r html_file; do
    optimize_html "$html_file"
done

echo "🎉 HTML optimization complete!"
echo "📁 Optimized HTML saved in: html_optimized/"
