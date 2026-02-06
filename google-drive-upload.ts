/**
 * Google Drive Upload Utility
 * Uploads images to Google Drive and returns shareable link
 */

const GOOGLE_DRIVE_API_KEY = 'AIzaSyAXsWtZb0eNjfJg178m9_XOF9fLYdXh-ew';
const GOOGLE_CLIENT_ID = '671089386572-ovct3hq0c4coij0p9fvl3v6rt8ouh498.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const DRIVE_FOLDER_ID = '15EyjD0VWOXjs8qSOYGpjDoi80fJmXUh3'; // Expenses folder

// OAuth2 token storage
let accessToken: string | null = null;

/**
 * Get OAuth2 access token
 * Uses Google's OAuth2 flow to get authorization
 */
async function getAccessToken(): Promise<string> {
  if (accessToken) {
    return accessToken;
  }

  // For web apps, we'll use a simpler approach with the API key
  // and make the folder publicly writable (or use a service account)
  // For now, returning the API key approach
  return GOOGLE_DRIVE_API_KEY;
}

/**
 * Convert base64 image to blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

/**
 * Upload image to Google Drive
 * @param imageUri - Base64 image data or file URI
 * @param fileName - Name for the file
 * @returns Shareable Google Drive link
 */
export async function uploadToGoogleDrive(
  imageUri: string,
  fileName: string
): Promise<string> {
  try {
    console.log('[DriveUpload] Starting upload:', fileName);

    // Extract base64 data if it's a data URI
    let base64Data = imageUri;
    let mimeType = 'image/jpeg';
    
    if (imageUri.startsWith('data:')) {
      const matches = imageUri.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    // Create form data for multipart upload
    const metadata = {
      name: fileName,
      parents: [DRIVE_FOLDER_ID],
      mimeType: mimeType
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', base64ToBlob(base64Data, mimeType));

    // Upload to Google Drive
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&key=' + GOOGLE_DRIVE_API_KEY,
      {
        method: 'POST',
        body: form,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[DriveUpload] Upload failed:', errorText);
      throw new Error('Failed to upload to Google Drive: ' + errorText);
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.id;

    console.log('[DriveUpload] File uploaded, ID:', fileId);

    // Make the file publicly accessible
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?key=${GOOGLE_DRIVE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      }
    );

    // Generate shareable link
    const driveLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    
    console.log('[DriveUpload] Upload complete, link:', driveLink);
    
    return driveLink;
  } catch (error) {
    console.error('[DriveUpload] Error uploading to Drive:', error);
    throw error;
  }
}

/**
 * Upload image and get link (simplified interface)
 */
export async function uploadReceiptImage(imageData: string, expenseDate: string): Promise<string> {
  // Generate filename with date and timestamp
  const timestamp = new Date().getTime();
  const fileName = `receipt_${expenseDate}_${timestamp}.jpg`;
  
  return uploadToGoogleDrive(imageData, fileName);
}
