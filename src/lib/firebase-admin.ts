
// Check firebase admin initialization
console.log('Firebase Admin initializing...')

try {
  // Try to import admin functions
  const admin = require('firebase-admin')
  console.log('Firebase admin imported:', typeof admin)
  console.log('Admin functions:', Object.keys(admin))
} catch (err) {
  console.error('Error importing firebase admin:', err)
}

