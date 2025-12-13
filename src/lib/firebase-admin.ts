import admin from 'firebase-admin';
import fs from 'fs';

if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    
    // Use hardcoded service account path
    const serviceAccountPath = './firebase-service-account.json';
    console.log('Service account path:', serviceAccountPath);
    
    if (fs.existsSync(serviceAccountPath)) {
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
    
    // Initialize without credentials for development
    console.log('Trying initialization without credentials...');
    admin.initializeApp({
      projectId: 'dramaflex-38877',
    });
    console.log('Firebase Admin initialized without credentials');
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export default admin;