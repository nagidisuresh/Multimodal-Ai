'use strict';

/**
 * Check magic bytes (file signatures) to ensure the file is what it claims to be.
 * This prevents spoofed extensions.
 */

const SIGNATURES = {
  // Images
  'image/jpeg': [
    [0xff, 0xd8, 0xff],
  ],
  'image/png': [
    [0x89, 0x50, 0x4e, 0x47],
  ],
  'image/webp': [
    // RIFF____WEBP
    null, // handled separately
  ],
  // PDF
  'application/pdf': [
    [0x25, 0x50, 0x44, 0x46], // %PDF
  ],
  // Audio
  'audio/mpeg': [
    [0x49, 0x44, 0x33], // ID3 - MP3
    [0xff, 0xfb], // MPEG sync
    [0xff, 0xf3],
    [0xff, 0xf2],
  ],
  'audio/wav': [
    [0x52, 0x49, 0x46, 0x46], // RIFF
  ],
  // Video
  'video/mp4': [
    null, // handled separately — ftyp box at offset 4
  ],
  // Plain text / markdown — no reliable signature, skip magic byte check
  'text/plain': null,
  'text/markdown': null,
};

/**
 * Allowed MIME types for upload.
 */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
]);

/**
 * @param {Buffer} buffer
 * @param {string} mimeType
 * @returns {boolean}
 */
function checkSignature(buffer, mimeType) {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) return false;
  // Text types — no magic byte to check
  if (mimeType === 'text/plain' || mimeType === 'text/markdown') return true;

  // WebP: RIFF at 0, WEBP at 8
  if (mimeType === 'image/webp') {
    return (
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    );
  }

  // MP4: ftyp box at offset 4
  if (mimeType === 'video/mp4') {
    if (buffer.length < 8) return false;
    const ftyp = buffer.slice(4, 8).toString('ascii');
    return ftyp === 'ftyp';
  }

  const sigs = SIGNATURES[mimeType];
  if (!sigs) return false;

  return sigs.some((sig) => {
    if (!sig) return false;
    return sig.every((byte, i) => buffer[i] === byte);
  });
}

module.exports = { checkSignature, ALLOWED_MIME_TYPES };
