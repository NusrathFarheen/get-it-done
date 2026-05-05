/**
 * useS3Upload — S3 photo upload hook
 * Falls back to local blob URLs when S3 is not configured (mock mode)
 */
import { useState } from 'react';
import { isS3Configured } from '../amplify-config';

// When S3 is configured, import these:
// import { uploadData, getUrl } from 'aws-amplify/storage';

export function useS3Upload() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  /**
   * Upload a File object and return its public URL.
   * @param {File} file
   * @param {string} folder  e.g. 'portfolio', 'reviews', 'avatars'
   * @param {string} userId
   * @returns {Promise<string>} public URL
   */
  const uploadFile = async (file, folder = 'general', userId = 'anon') => {
    setUploading(true);
    setUploadError('');
    try {
      if (!isS3Configured()) {
        // Mock mode — return a local object URL (works for previews)
        await new Promise(r => setTimeout(r, 600)); // simulate upload delay
        const url = URL.createObjectURL(file);
        setUploading(false);
        return url;
      }

      // Real S3 upload (active when bucket is configured)
      const { uploadData, getUrl } = await import('aws-amplify/storage');
      const key = `${folder}/${userId}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

      await uploadData({
        key,
        data: file,
        options: {
          contentType: file.type,
          accessLevel: 'guest', // publicly readable
        },
      }).result;

      const { url } = await getUrl({
        key,
        options: { accessLevel: 'guest' },
      });

      setUploading(false);
      return url.toString();
    } catch (err) {
      setUploading(false);
      setUploadError(err.message || 'Upload failed');
      throw err;
    }
  };

  /**
   * Upload multiple files and return array of URLs
   */
  const uploadFiles = async (files, folder, userId) => {
    const urls = await Promise.all(
      Array.from(files).map(f => uploadFile(f, folder, userId))
    );
    return urls;
  };

  return { uploadFile, uploadFiles, uploading, uploadError };
}
