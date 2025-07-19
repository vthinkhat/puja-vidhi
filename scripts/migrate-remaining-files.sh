#!/bin/bash

# Migration helper script for Puja Vidhi codebase improvements
# This script helps identify and migrate remaining files to the new structure

echo "🔍 Puja Vidhi Migration Helper"
echo "==============================="

# Function to count files needing migration
count_files_needing_migration() {
    echo "📊 Files that still need migration:"
    echo
    
    echo "Stotram files with old CSS structure:"
    grep -l "Baloo Tamma.*system-ui" stotram/*.html | wc -l
    echo
    
    echo "Puja files with old CSS structure:"
    grep -l "Baloo Tamma.*system-ui" puja/*.html | wc -l
    echo
    
    echo "Files with old JavaScript structure:"
    grep -l "function toggleVisibility" stotram/*.html puja/*.html | wc -l
    echo
}

# Function to list specific files needing migration
list_files_needing_migration() {
    echo "📋 Specific files needing migration:"
    echo
    
    echo "=== Stotram files with embedded CSS ==="
    grep -l "font-family.*Baloo Tamma" stotram/*.html | head -10
    echo
    
    echo "=== Puja files with embedded CSS ==="
    grep -l "font-family.*Baloo Tamma" puja/*.html | head -10
    echo
    
    echo "=== Files with embedded JavaScript ==="
    grep -l "function toggleVisibility" stotram/*.html puja/*.html | head -10
    echo
}

# Function to create a sample migration for a single file
create_migration_example() {
    local file="$1"
    if [ -z "$file" ]; then
        echo "Usage: create_migration_example <filename>"
        return 1
    fi
    
    echo "🔧 Migration steps for $file:"
    echo
    echo "1. Replace CSS section:"
    echo "   FROM: <link href='fonts...' ...> + <style>...</style>"
    echo "   TO:   <link rel='stylesheet' href='../styles/common.css'>"
    echo
    echo "2. Update button class:"
    echo "   FROM: <button onclick='toggleVisibility()'>"
    echo "   TO:   <button class='toggle-btn' onclick='toggleVisibility()'>"
    echo
    echo "3. Replace JavaScript:"
    echo "   FROM: <script>function toggleVisibility(){...}</script>"
    echo "   TO:   <script src='../scripts/common.js'></script>"
    echo
}

# Function to validate a migrated file
validate_migrated_file() {
    local file="$1"
    if [ -z "$file" ]; then
        echo "Usage: validate_migrated_file <filename>"
        return 1
    fi
    
    echo "✅ Validation checklist for $file:"
    echo
    
    # Check if file uses new CSS structure
    if grep -q "styles/common.css" "$file"; then
        echo "✓ Uses centralized CSS"
    else
        echo "❌ Still uses embedded CSS"
    fi
    
    # Check if file uses new JS structure
    if grep -q "scripts/common.js" "$file"; then
        echo "✓ Uses centralized JavaScript"
    else
        echo "❌ Still uses embedded JavaScript"
    fi
    
    # Check for proper button class
    if grep -q "toggle-btn" "$file"; then
        echo "✓ Uses proper button styling"
    else
        echo "❌ Missing button class"
    fi
    
    # Check for old embedded styles
    if grep -q "<style>" "$file"; then
        echo "⚠️  Still contains embedded styles"
    else
        echo "✓ No embedded styles found"
    fi
    
    echo
}

# Main menu
while true; do
    echo
    echo "Choose an option:"
    echo "1) Count files needing migration"
    echo "2) List specific files needing migration"
    echo "3) Show migration example for a file"
    echo "4) Validate a migrated file"
    echo "5) Exit"
    echo
    read -p "Enter choice (1-5): " choice
    
    case $choice in
        1)
            count_files_needing_migration
            ;;
        2)
            list_files_needing_migration
            ;;
        3)
            read -p "Enter filename to show migration example: " filename
            create_migration_example "$filename"
            ;;
        4)
            read -p "Enter filename to validate: " filename
            validate_migrated_file "$filename"
            ;;
        5)
            echo "Migration helper complete! 🎉"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please enter 1-5."
            ;;
    esac
done 