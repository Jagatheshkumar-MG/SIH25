import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, addDoc, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Debug: Log Firebase connection status
console.log('Firebase initialized:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  connected: !!app
});

// Test Firestore connection
try {
  console.log('Firestore instance:', db);
} catch (error) {
  console.error('Firestore connection error:', error);
}

export async function saveAssessment(userId: string, data: any): Promise<string | null> {
  if (!userId) return null;
  try {
    const ref = await addDoc(collection(db, 'assessments'), {
      userId,
      ...data,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (e) {
    console.error('Failed to save assessment:', e);
    return null;
  }
}

// Test function to check Firestore write permissions
export async function testFirestoreWrite(): Promise<boolean> {
  try {
    const testDoc = doc(db, 'test', 'connection-test');
    await setDoc(testDoc, {
      timestamp: new Date(),
      test: true
    });
    console.log('✅ Firestore write test successful');
    return true;
  } catch (error) {
    console.error('❌ Firestore write test failed:', error);
    return false;
  }
}
