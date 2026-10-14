'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = require('./env');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Use the service_role key so we can bypass RLS and manage private storage
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET_NAME = 'evidence';

/**
 * Upload a file buffer to the private evidence bucket.
 * Falls back to local disk storage if the bucket isn't configured yet.
 * Returns the storage key (path inside the bucket/uploads).
 */
async function uploadFile(buffer, mimeType, storageKey) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storageKey, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (!error) {
      return storageKey;
    }
    console.warn(`[Storage] Supabase bucket upload failed (${error.message}). Saving to local storage.`);
  } catch (err) {
    console.warn(`[Storage] Supabase storage error (${err.message}). Saving to local storage.`);
  }

  // Local fallback
  try {
    const localPath = path.join(UPLOADS_DIR, storageKey);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, buffer);
    return storageKey;
  } catch (err) {
    throw new Error(`File upload failed: ${err.message}`);
  }
}

/**
 * Generate a short-lived signed URL (60 seconds) for secure file download.
 * Falls back to local endpoint URL if Supabase signed URL cannot be created.
 */
async function getSignedUrl(storageKey, expiresIn = 60) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storageKey, expiresIn);

    if (!error && data && data.signedUrl) {
      return data.signedUrl;
    }
  } catch (err) {
    // ignore and use fallback
  }

  return `/api/evidence/file/${encodeURIComponent(storageKey)}`;
}

/**
 * Download a file as a Buffer for passing to Gemini or sending to client.
 */
async function downloadFile(storageKey) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(storageKey);

    if (!error && data) {
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (err) {
    // try local disk
  }

  const localPath = path.join(UPLOADS_DIR, storageKey);
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  throw new Error(`Storage download failed: File ${storageKey} not found.`);
}

/**
 * Delete a file from storage.
 */
async function deleteFile(storageKey) {
  try {
    await supabase.storage.from(BUCKET_NAME).remove([storageKey]);
  } catch (err) {}

  try {
    const localPath = path.join(UPLOADS_DIR, storageKey);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  } catch (err) {}
}

module.exports = { supabase, uploadFile, getSignedUrl, downloadFile, deleteFile, BUCKET_NAME };
