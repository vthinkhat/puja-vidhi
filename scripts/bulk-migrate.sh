#!/bin/bash

# Bulk migration script for Puja Vidhi HTML files
# This script replaces embedded CSS and JavaScript with centralized versions

echo "🚀 Starting bulk migration of HTML files..."

# Array of files that still need migration
files_to_migrate=(
    "stotram/ganpati-sankata-nashana-stotram.html"
    "stotram/kanakadhara-stotram.html"
    "stotram/lakshmi-ashtakam.html"
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
    "puja/hanumaan-puja.html"
    "puja/lakshmi-chaturvimsati.html"
    "puja/lakshmi-puja.html"
    "puja/shiva-abhishekam.html"
    "puja/veerabhadra-puja.html"
    "puja/venkateswara-puja.html"
    "puja/vyuha-lakshmi-tantra.html"
)

# Function to update button elements
update_buttons() {
    local file="$1"
    if grep -q 'onclick="toggleVisibility"' "$file"; then
        echo "  → Updating button in $file"
        sed -i 's/<button onclick="toggleVisibility"/<button class="toggle-btn" onclick="toggleVisibility"/g' "$file"
    fi
}

# Function to replace JavaScript sections  
replace_javascript() {
    local file="$1"
    if grep -q "function toggleVisibility" "$file"; then
        echo "  → Replacing JavaScript in $file"
        # Create a temporary file with the new script tag
        temp_file=$(mktemp)
        
        # Copy everything before the script tag
        sed '/.*<script>/,$d' "$file" > "$temp_file"
        
        # Add the new script tag
        echo '    <!-- Centralized Scripts -->' >> "$temp_file"
        echo '    <script src="../scripts/common.js"></script>' >> "$temp_file"
        echo '</body>' >> "$temp_file"
        echo '</html>' >> "$temp_file"
        
        # Replace the original file
        mv "$temp_file" "$file"
    fi
}

# Count total files
total_files=${#files_to_migrate[@]}
echo "📁 Processing $total_files files..."
echo

# Process each file
count=0
for file in "${files_to_migrate[@]}"; do
    count=$((count + 1))
    echo "[$count/$total_files] Processing: $file"
    
    if [ -f "$file" ]; then
        # Update buttons if they exist
        update_buttons "$file"
        
        # Replace JavaScript if it exists
        replace_javascript "$file"
        
        echo "  ✅ Completed: $file"
    else
        echo "  ❌ File not found: $file"
    fi
    echo
done

echo "🎉 Bulk migration completed!"
echo
echo "📊 Summary:"
echo "  - Total files processed: $total_files"
echo "  - Buttons updated: $(grep -l 'class="toggle-btn"' "${files_to_migrate[@]}" 2>/dev/null | wc -l)"
echo "  - JavaScript replaced: $(grep -l 'scripts/common.js' "${files_to_migrate[@]}" 2>/dev/null | wc -l)"
echo
echo "🔍 To verify migration:"
echo "  ./scripts/migrate-remaining-files.sh" 