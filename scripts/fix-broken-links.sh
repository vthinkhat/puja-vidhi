#!/bin/bash

# Fix broken link tags and buttons created by CSS migration script
echo "🔧 Fixing broken link tags and buttons..."

# Files with broken link tags
broken_files=(
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
    "stotram/vishnu-sahasranamam.html"
)

echo "📁 Processing ${#broken_files[@]} files with broken links..."

for file in "${broken_files[@]}"; do
    if [ -f "$file" ]; then
        echo "🔧 Fixing: $file"
        
        # Remove broken link tags (lines that have rel="stylesheet"> but no href)
        sed -i '/rel="stylesheet">$/d' "$file"
        
        # Add toggle-btn class to buttons if missing
        if grep -q 'onclick="toggleVisibility"' "$file" && ! grep -q 'class="toggle-btn"' "$file"; then
            sed -i 's/<button onclick="toggleVisibility"/<button class="toggle-btn" onclick="toggleVisibility"/g' "$file"
        fi
        
        echo "  ✅ Fixed: $file"
    else
        echo "  ❌ File not found: $file"
    fi
done

echo "🎉 Broken link fix completed!"
echo

# Verify results
remaining_broken=$(grep -r "rel=\"stylesheet\">" --include="*.html" . | grep -v "href=" | wc -l)
echo "📊 Remaining broken links: $remaining_broken"

if [ "$remaining_broken" -eq 0 ]; then
    echo "🎊 SUCCESS: All broken links fixed!"
else
    echo "⚠️  WARNING: $remaining_broken broken links still exist"
fi 