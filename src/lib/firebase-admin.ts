import admin from 'firebase-admin';

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  try {
    // Initialize Firebase Admin with environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID || "dramaflex-38877",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "2631ee595bc146a6b060eeb9ea6e9773b0467d80",
      private_key: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvvwwb3hi7hjBc\n2ajKcu+Uay4r7FgDUwgAPaxev7SCWNXwKpyTeyS9WikPCA/INglreqdB4hCGjKXY\nfrvekdPYdmg28LKU8EynNz+z/do+l9A4wDuifPfxH+Lyj6/ZHjwbQwMCVgC0iQoK\nSvT9I8lpidrkqwitGY2OzgkVHnBVXxWngmD3JhTAGY33WoLD16hMesnCrBp4VUnv\n00yYdz2aiW5zrk1LTR2Wvf3vU5lidUFzt9Pqk+8jop/owAckjJymC1GPoglhNHjA\nW3jAF9Z2TrVc5Fs66eALqaBIXY1d2lGkhouI8D5WbMwrjl/+0QGi0Rw5xe7xEoQ+\nJ5b5B9P9AgMBAAECggEAIE4TLP00mSXXtn2ZCgu6D9Nq046YeBX3asnraSg+h1ZK\njyDaEr8IWBkeYoG2GvSZ4yyS2aizJnRsmODk6krugMP1MKIqhXetc3BTsKOJTkes\nMf5eB+aGUgetOS6h4Zxt6on1H+UMsKLfGljAc1a0c4awWqe4ys7fZ0BmyX/EoOBx\nRzZz1j/PtEEfpC8r+9ZBxP7BlVPW51lDmqD3+pRvbAwOEgDir8Jj7N+ko2iJY32D\nXoOaYl1EIoXUb7MZj6a/6r8uxeoJX5A08vOwyq7UlXzgSkmNFPAIwjBtmXQVwgTz\ntiaYMFp+JcfYwXTxxj4uN3u+j+TQ8fdW3HIQLhRHMQKBgQDdPWwd2jv765qk0BEo\nbnaKQxBahq5GdBBMmnFU+JNfFe4FflaLl3a7rwpKOvsqFrfQh85LHTMi3YHAcg9d\nVs2SAjCgV7Fwg5kD6VAG16YvWva/8A8oFBL7+2lYLJ1X9YVBreKUhp0cGyPUtCXZ\n24flR3Sop+wpDxg0LPr8s0TpjQKBgQDLW86X+QOI7jvbXFI8wgSFaPaFkR9ya2fL\nLeBaRMDwR0y7kDUDZpnG+6ZCwF093zBiCk5x25CiCEeKBRbXS7fbgEi3bqdFdeBW\n/CUrOzppX14P8/Uwoj6CeepcDfdGYRN5E7s2CLOMI3PhoV+18ThjL9B1CzBFfHqo\nups/CRugMQKBgE4I+DWfYED/XVB8w1CLhexGs2H610WqcoVShF8APprvVUFCyqv6\nBLs2hl6gZy71TGiVPkJoTj0h/D4w/RJjJ6c0dopX5BJXmIU0qjF/pvJVF2uj9PSi\nAAA5MXMUaXs48oO0HZNd19SuDflcgW1SbaCFj7RdZoMk+9iLdQvk/42RAoGARkKi\n/2jeqsm8zo54L1vNWhaozf8VAWBQjSd9k1Kb4qiPv2IUnuctDE3X5Mo3rO/W9Jig\n/7+fmgwIQ4x8lsgnbuREu3O0wU/3wbX+VZByHwP/KL3eIf58YHIk4cdFfwB9TODf\nVszs0+dP2035FpCQLdzQRhAmjmtyqadHiiDodZECgYEAr8rSr4EB3POpXGJBITnj\nv5qMGvrY7G1P9gljElJWo+uQAVYMLIuxqzd4KBL83wmSzqc2K9JZQZs49t0TutG1\nWl8MjjIcD2ipPPe9VXnAgZBlEDPFyTulqWjfzWQw9sjOwmEUTmKPABnyy3uz5Dvk\nt4rYWVUFKKiItyifXmX70I0=\n-----END PRIVATE KEY-----\n",
      client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@dramaflex-38877.iam.gserviceaccount.com",
      client_id: "115239688488071245461",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40dramaflex-38877.iam.gserviceaccount.com",
      universe_domain: "googleapis.com"
    };

    // Handle private key formatting for environment variables
    if (process.env.FIREBASE_PRIVATE_KEY && !process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----')) {
      serviceAccount.private_key = `-----BEGIN PRIVATE KEY-----\n${process.env.FIREBASE_PRIVATE_KEY}\n-----END PRIVATE KEY-----`;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const serverTimestamp = () => admin.firestore.FieldValue.serverTimestamp();
export default admin;