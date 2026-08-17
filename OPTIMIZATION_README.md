# 🚀 Website Optimization Guide for Faster Loading

This guide will help you optimize your UMRT website for faster loading while keeping everything the same visually.

## 📋 What Will Be Optimized

1. **Images** - Compressed and resized for web
2. **CSS** - Minified to remove unnecessary characters
3. **HTML** - Compressed by removing extra whitespace
4. **Server** - Added compression and caching headers

## 🛠️ Quick Start

### Option 1: Run All Optimizations (Recommended)
```bash
chmod +x optimize_website.sh
./optimize_website.sh
```

### Option 2: Run Individual Optimizations
```bash
# Optimize images only
./optimize_images.sh

# Minify CSS only
./minify_css.sh

# Optimize HTML only
./optimize_html.sh
```

## 📁 What Gets Created

After running the optimization scripts, you'll have:

```
your-website/
├── images/
│   └── optimized/          # Compressed images
├── css/
│   └── minified/           # Minified CSS files
├── html_optimized/         # Compressed HTML files
└── .htaccess               # Server optimizations
```

## 🔄 How to Use Optimized Files

### 1. Update Image References
Replace image paths in your HTML files:
```html
<!-- Before -->
<img src="images/team_2025_1.jpg" alt="Team 2025">

<!-- After -->
<img src="images/optimized/team_2025_1_opt.jpg" alt="Team 2025">
```

### 2. Update CSS References
Replace CSS file references:
```html
<!-- Before -->
<link rel="stylesheet" href="css/style.css">

<!-- After -->
<link rel="stylesheet" href="css/minified/style.min.css">
```

### 3. Replace HTML Files
Copy optimized HTML files from `html_optimized/` to replace originals.

## 📊 Expected Results

- **Images**: 30-70% size reduction
- **CSS**: 20-40% size reduction  
- **HTML**: 10-30% size reduction
- **Overall**: 25-50% faster loading

## 🌐 Server Optimizations

The `.htaccess` file includes:
- **GZIP compression** for text files
- **Browser caching** for static assets
- **Cache control headers** for better performance

## ⚠️ Important Notes

1. **Backup first** - Always backup your original files
2. **Test thoroughly** - Ensure everything works after optimization
3. **Keep originals** - Don't delete original files until you're satisfied
4. **Image quality** - Optimized images maintain visual quality

## 🧪 Testing Performance

### Before/After Comparison
```bash
# Check file sizes
du -sh images/
du -sh css/
du -sh *.html

# Test loading speed
# Use browser dev tools or online tools like:
# - PageSpeed Insights
# - GTmetrix
# - WebPageTest
```

## 🆘 Troubleshooting

### Common Issues:
1. **Images not loading** - Check file paths in optimized folder
2. **CSS not working** - Verify minified CSS file paths
3. **Server errors** - Ensure `.htaccess` is supported by your hosting

### Rollback:
If something goes wrong, simply restore your original files from backup.

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify file paths are correct
3. Ensure all optimized files were created
4. Test with a simple HTML file first

---

**🎯 Goal**: Faster website loading while maintaining exact same appearance and functionality.

**⏱️ Time Investment**: 5-10 minutes to run scripts + 15-30 minutes to update file references.

**💡 Pro Tip**: Run optimizations before deploying to production, not during development.
