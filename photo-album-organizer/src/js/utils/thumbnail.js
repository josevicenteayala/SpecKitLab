/**
 * Thumbnail generation utility
 * Uses Canvas API for image resizing
 * @module utils/thumbnail
 */

const THUMBNAIL_SIZE = 300; // 300x300px thumbnails
const THUMBNAIL_QUALITY = 0.85;

/**
 * Generate thumbnail from image file
 * @param {File} file - Image file
 * @returns {Promise<Blob>} Thumbnail blob
 */
export async function generateThumbnail(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Crop to square from center
        const size = Math.min(width, height);
        const sx = (width - size) / 2;
        const sy = (height - size) / 2;
        
        canvas.width = THUMBNAIL_SIZE;
        canvas.height = THUMBNAIL_SIZE;
        
        // Draw cropped and resized image
        ctx.drawImage(img, sx, sy, size, size, 0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
        
        // Convert to blob
        canvas.toBlob(
          blob => resolve(blob),
          'image/jpeg',
          THUMBNAIL_QUALITY
        );
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Load image
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generate thumbnails for multiple files
 * @param {FileList|File[]} files - Image files
 * @returns {Promise<Map<File, Blob>>} Map of file to thumbnail blob
 */
export async function generateMultipleThumbnails(files) {
  const thumbnailMap = new Map();
  
  for (const file of files) {
    try {
      const thumbnail = await generateThumbnail(file);
      thumbnailMap.set(file, thumbnail);
    } catch (error) {
      console.error(`Failed to generate thumbnail for ${file.name}:`, error);
      thumbnailMap.set(file, null);
    }
  }
  
  return thumbnailMap;
}
