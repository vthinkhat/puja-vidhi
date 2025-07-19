#!/bin/bash

# CSS migration script for Puja Vidhi HTML files
# This script replaces embedded CSS with centralized CSS imports

echo "🎨 Starting CSS migration for HTML files..."

# Files that still need CSS migration
files_with_css=(
    "puja/hanumaan-puja.html"
    "puja/lakshmi-chaturvimsati.html"
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

# Function to migrate CSS for a single file
migrate_css() {
    local file="$1"
    echo "  🔄 Migrating CSS in $file"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Read the file and process it
    in_head=false
    in_style=false
    
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Check if we're in the head section
        if [[ "$line" =~ \<head\> ]]; then
            in_head=true
        fi
        
        # Check if we're entering a style block
        if [[ "$line" =~ \<style\> ]]; then
            in_style=true
            # Replace the entire CSS section with centralized imports
            echo '    <link rel="icon" type="image/x-icon" href="../favicon.ico">' >> "$temp_file"
            echo '    ' >> "$temp_file"
            echo '    <!-- Centralized Styles -->' >> "$temp_file"
            echo '    <link rel="stylesheet" href="../styles/common.css">' >> "$temp_file"
            continue
        fi
        
        # Skip everything until we close the style block
        if [[ "$in_style" == true ]]; then
            if [[ "$line" =~ \</style\> ]]; then
                in_style=false
            fi
            continue
        fi
        
        # Skip font import lines in head
        if [[ "$in_head" == true && ("$line" =~ "preconnect" || "$line" =~ "fonts.googleapis.com") ]]; then
            continue
        fi
        
        # Check if we're leaving the head section
        if [[ "$line" =~ \</head\> ]]; then
            in_head=false
        fi
        
        # For DOCTYPE and html tag, ensure proper attributes
        if [[ "$line" =~ "<!DOCTYPE html>" ]]; then
            echo "<!DOCTYPE html>" >> "$temp_file"
        elif [[ "$line" =~ "<html>" ]]; then
            echo '<html lang="kn">' >> "$temp_file"
        elif [[ "$line" =~ "<head>" ]]; then
            echo '<head>' >> "$temp_file"
            echo '    <meta charset="UTF-8">' >> "$temp_file"
            echo '    <meta name="viewport" content="width=device-width, initial-scale=1.0">' >> "$temp_file"
        else
            echo "$line" >> "$temp_file"
        fi
    done < "$file"
    
    # Replace the original file
    mv "$temp_file" "$file"
}

# Function to update buttons
update_buttons() {
    local file="$1"
    if grep -q 'onclick="toggleVisibility"' "$file" && ! grep -q 'class="toggle-btn"' "$file"; then
        echo "  🔘 Updating button in $file"
        sed -i 's/<button onclick="toggleVisibility"/<button class="toggle-btn" onclick="toggleVisibility"/g' "$file"
    fi
}

# Count total files
total_files=${#files_with_css[@]}
echo "📁 Processing $total_files files with embedded CSS..."
echo

# Process each file
count=0
for file in "${files_with_css[@]}"; do
    count=$((count + 1))
    echo "[$count/$total_files] Processing: $file"
    
    if [ -f "$file" ]; then
        # Migrate CSS
        migrate_css "$file"
        
        # Update buttons if needed
        update_buttons "$file"
        
        echo "  ✅ Completed: $file"
    else
        echo "  ❌ File not found: $file"
    fi
    echo
done

echo "🎉 CSS migration completed!"
echo
echo "📊 Final Summary:"

# Count remaining files with embedded styles
remaining_css=$(find . -name "*.html" -exec grep -l "<style>" {} \; 2>/dev/null | wc -l)
echo "  - Files still with embedded CSS: $remaining_css"

# Count files using centralized CSS
centralized_css=$(find . -name "*.html" -exec grep -l "styles/common.css" {} \; 2>/dev/null | wc -l)
echo "  - Files using centralized CSS: $centralized_css"

# Count files with toggle buttons
toggle_buttons=$(find . -name "*.html" -exec grep -l 'class="toggle-btn"' {} \; 2>/dev/null | wc -l)
echo "  - Files with updated buttons: $toggle_buttons"

echo
if [ "$remaining_css" -eq 0 ]; then
    echo "🎊 SUCCESS: All embedded CSS has been migrated!"
else
    echo "⚠️  WARNING: $remaining_css files still have embedded CSS"
fi 