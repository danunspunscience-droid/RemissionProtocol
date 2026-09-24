/**
 * Compresses an image file client-side to WebP format before upload.
 *
 * @param {File} file - Original file from file input
 * @param {Object} [options] - Compression configuration
 * @param {number} [options.maxWidth=1920] - Maximum allowable width
 * @param {number} [options.maxHeight=1920] - Maximum allowable height
 * @param {number} [options.quality=0.82] - WebP quality ratio (0.0 to 1.0)
 * @returns {Promise<File>} Compressed WebP file or original file if non-image/larger
 */
export async function compressImageToWebP(file, options = {}) {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = options;

  if (!file || typeof file!== 'object' ||!file.type ||!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const compressedFile = new File([blob], `${baseName}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          // Retain original file if canvas compression unexpectedly yields a larger byte size
          resolve(compressedFile.size < file.size? compressedFile: file);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}