#!/bin/bash
# Script to process images: rename, crop, optimize
# Run this after uploading images to images/raw/

RAW_DIR="/home/crybaby/toree-farm/images/raw"
OPT_DIR="/home/crybaby/toree-farm/images/optimized"

# Install imagemagick if not present
if ! command -v convert &> /dev/null; then
    echo "Installing ImageMagick..."
    sudo apt update && sudo apt install -y imagemagick
fi

# Install webp if not present
if ! command -v cwebp &> /dev/null; then
    echo "Installing webp tools..."
    sudo apt install -y webp
fi

# List images and prompt for identification
echo "Images in raw folder:"
ls -1 "$RAW_DIR"/*.jpg "$RAW_DIR"/*.png "$RAW_DIR"/*.jpeg 2>/dev/null || echo "No images found. Please upload images to $RAW_DIR"

# For each image, you need to manually identify and rename
# Example: mv "$RAW_DIR/image1.jpg" "$RAW_DIR/hero-banner.jpg"
# Then crop if needed: convert "$RAW_DIR/hero-banner.jpg" -crop 800x600+100+50 "$RAW_DIR/hero-banner-cropped.jpg"

# After manual steps, optimize
for img in "$RAW_DIR"/*.{jpg,png,jpeg}; do
    if [ -f "$img" ]; then
        base=$(basename "$img")
        name="${base%.*}"
        echo "Processing $name..."

        # Crop if hands visible (manual for now)
        # Example: convert "$img" -crop WxH+X+Y "$OPT_DIR/${name}-cropped.jpg"

        # Resize and optimize
        convert "$img" -strip -interlace Plane -quality 85 -resize 320x\> "$OPT_DIR/${name}-320.jpg"
        convert "$img" -strip -interlace Plane -quality 85 -resize 640x\> "$OPT_DIR/${name}-640.jpg"
        convert "$img" -strip -interlace Plane -quality 85 -resize 1024x\> "$OPT_DIR/${name}-1024.jpg"
        convert "$img" -strip -interlace Plane -quality 85 -resize 1600x\> "$OPT_DIR/${name}-1600.jpg"

        # WebP
        cwebp -q 80 "$OPT_DIR/${name}-640.jpg" -o "$OPT_DIR/${name}-640.webp"
        cwebp -q 80 "$OPT_DIR/${name}-1024.jpg" -o "$OPT_DIR/${name}-1024.webp"
    fi
done

echo "Done. Check $OPT_DIR for optimized images."