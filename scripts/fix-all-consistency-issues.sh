#!/bin/bash

# Comprehensive fix for HTML consistency issues
echo "🔧 Fixing all HTML consistency issues across the codebase..."

# Files with broken link tags that need fixing
broken_link_files=(
    "puja/hanumaan-puja.html"
    "puja/lakshmi-puja.html"
    "puja/shiva-abhishekam.html"
    "puja/veerabhadra-puja.html"
    "puja/venkateswara-puja.html"
    "puja/vyuha-lakshmi-tantra.html"
    "stotram/lakshmi-ashtottara-satanaama-stotram.html"
    "stotram/lakshmi-chaturvimsati-naamavali.html"
    "stotram/lakshmi-chaturvimsati-stotram.html"
    "stotram/maha-mrityunjaya-mantra.html"
    "stotram/pitru-devata-stotram.html"
    "stotram/ramadootha-anjaneya-stotram.html"
    "stotram/saraswati-kavacham.html"
    "stotram/shiva-panchakshara-stotram.html"
    "stotram/soundarya-lahari.html"
    "stotram/surya-arghya-mantra.html"
    "stotram/surya-namaskara-mantra.html"
    "stotram/venkateswara-vajra-kavacham.html"
)

echo "📁 Processing ${#broken_link_files[@]} files with broken links..."
echo

# Fix broken link tags
fix_broken_links() {
    local file="$1"
    echo "🔗 Fixing broken links in: $file"
    
    # Remove incomplete <link lines
    sed -i '/^[[:space:]]*<link[[:space:]]*$/d' "$file"
    
    # Fix any remaining broken link structures
    sed -i 's/<link[[:space:]]*$//g' "$file"
    
    echo "  ✅ Links fixed in: $file"
}

# Fix heading structure
fix_headings() {
    local file="$1"
    if grep -q "<h2>" "$file"; then
        echo "📝 Fixing headings in: $file"
        
        # Change main page headings from h2 to h1 (only the first occurrence)
        sed -i '0,/<h2>/{s/<h2>/<h1>/}' "$file"
        sed -i '0,/<\/h2>/{s/<\/h2>/<\/h1>/}' "$file"
        
        echo "  ✅ Headings fixed in: $file"
    fi
}

# Fix button classes
fix_buttons() {
    local file="$1"
    if grep -q 'onclick="toggleVisibility"' "$file" && ! grep -q 'class="toggle-btn"' "$file"; then
        echo "🔘 Fixing button in: $file"
        sed -i 's/<button onclick="toggleVisibility"/<button class="toggle-btn" onclick="toggleVisibility"/g' "$file"
        echo "  ✅ Button fixed in: $file"
    fi
}

# Fix specific content issues
fix_content_issues() {
    local file="$1"
    
    # Fix ramadootha-anjaneya-stotram.html specific issues
    if [[ "$file" == "stotram/ramadootha-anjaneya-stotram.html" ]]; then
        echo "📋 Fixing content issues in: $file"
        
        # Fix the title span that incorrectly says "Mahalakshmi Ashtakam"
        sed -i 's/(Mahalakshmi Ashtakam)/(Rama Dootha Anjaneya Stotram)/g' "$file"
        
        # Fix any malformed headings
        sed -i 's/<\/span><\/h1>/<\/span><\/h1>/g' "$file"
        
        echo "  ✅ Content issues fixed in: $file"
    fi
}

# Process each file
count=0
for file in "${broken_link_files[@]}"; do
    count=$((count + 1))
    echo "[$count/${#broken_link_files[@]}] Processing: $file"
    
    if [ -f "$file" ]; then
        fix_broken_links "$file"
        fix_headings "$file"
        fix_buttons "$file"
        fix_content_issues "$file"
        echo "  🎯 Completed: $file"
    else
        echo "  ❌ File not found: $file"
    fi
    echo
done

# Check all files for any remaining h2 main headings
echo "🔍 Checking for remaining h2 main headings..."
remaining_h2_files=$(find stotram/ puja/ -name "*.html" -exec grep -l "^[[:space:]]*<h2>" {} \; 2>/dev/null)

if [ -n "$remaining_h2_files" ]; then
    echo "📝 Fixing remaining h2 headings in other files..."
    for file in $remaining_h2_files; do
        if [ -f "$file" ]; then
            echo "  🔧 Fixing headings in: $file"
            fix_headings "$file"
        fi
    done
fi

echo "🎉 Comprehensive fix completed!"
echo

# Final verification
echo "📊 Final Status Check:"

# Check broken links
remaining_broken_links=$(grep -r "^[[:space:]]*<link[[:space:]]*$" --include="*.html" . 2>/dev/null | wc -l)
echo "  - Broken link tags: $remaining_broken_links"

# Check CSS references
files_with_css=$(find . -name "*.html" -exec grep -l "styles/common.css" {} \; 2>/dev/null | wc -l)
echo "  - Files using centralized CSS: $files_with_css"

# Check button classes
buttons_with_class=$(find . -name "*.html" -exec grep -l 'class="toggle-btn"' {} \; 2>/dev/null | wc -l)
echo "  - Buttons with proper styling: $buttons_with_class"

# Check main headings
files_with_h1=$(find stotram/ puja/ -name "*.html" -exec grep -l "<h1>" {} \; 2>/dev/null | wc -l)
echo "  - Files with proper h1 headings: $files_with_h1"

echo

if [ "$remaining_broken_links" -eq 0 ]; then
    echo "🎊 SUCCESS: All broken links fixed!"
    echo "🎊 SUCCESS: All files should now have proper CSS styling and margins!"
else
    echo "⚠️  WARNING: $remaining_broken_links broken links still exist"
fi 