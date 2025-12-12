import admin from 'firebase-admin';
import fs from 'fs';

if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    
    // Try multiple initialization approaches
    try {
      // Approach 1: Use service account if available
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      console.log('Service account path:', serviceAccountPath);
      
      if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        console.log('Service account file exists, reading...');
        const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
        const serviceAccount = JSON.parse(serviceAccountData);
        console.log('Service account loaded for project:', serviceAccount.project_id);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin initialized successfully with service account');
      } else {
        throw new Error('Service account file not found');
      }
    } catch (serviceError) {
      console.warn('Service account approach failed:', serviceError.message);
      
      // Approach 2: Initialize without credentials for development
      console.log('Trying initialization without credentials...');
      admin.initializeApp({
        projectId: 'dramaflex-38877',
        // For development, we can try without credentials
        // This might work if Firestore rules allow public access
      });
      console.log('Firebase Admin initialized without credentials');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // Last resort: Initialize without credentials
    admin.initializeApp({
      projectId: 'dramaflex-38877',
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;