#!/bin/bash

# Main website optimization script for faster loading
echo "🚀 Starting comprehensive website optimization..."
echo "================================================"

# Make scripts executable
chmod +x optimize_images.sh
chmod +x minify_css.sh
chmod +x optimize_html.sh

# Run image optimization
echo ""
echo "📸 Step 1: Optimizing images..."
./optimize_images.sh

# Run CSS minification
echo ""
echo "🎨 Step 2: Minifying CSS..."
./minify_css.sh

# Run HTML optimization
echo ""
echo "🌐 Step 3: Optimizing HTML..."
./optimize_html.sh

# Create a summary report
echo ""
echo "📊 OPTIMIZATION SUMMARY"
echo "======================="
echo "✅ Images optimized and saved in: images/optimized/"
echo "✅ CSS minified and saved in: css/minified/"
echo "✅ HTML optimized and saved in: html_optimized/"
echo ""
echo "💡 NEXT STEPS:"
echo "1. Update your HTML files to use optimized images"
echo "2. Update your HTML files to use minified CSS"
echo "3. Replace original files with optimized versions"
echo "4. Test website loading speed"
echo ""
echo "🎉 Website optimization complete!"
