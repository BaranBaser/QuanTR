const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: ReturnType<typeof import("firebase/auth").getAuth> | null = null;

if (isFirebaseConfigured) {
  try {
    const { initializeApp } = await import("firebase/app");
    const { getAuth: getFirebaseAuth } = await import("firebase/auth");
    const app = initializeApp(firebaseConfig);
    auth = getFirebaseAuth(app);
  } catch {
    console.warn("Firebase başlatılamadı. E-posta ile giriş devre dışı.");
  }
}

export { auth, isFirebaseConfigured };

export async function firebaseCreateUser(email: string, password: string) {
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  if (!auth) throw new Error("Firebase yapılandırılmamış");
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function firebaseSignIn(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  if (!auth) throw new Error("Firebase yapılandırılmamış");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function firebaseSendVerification(user: { sendEmailVerification: () => Promise<void> }) {
  return user.sendEmailVerification();
}

export async function firebaseSendReset(email: string) {
  const { sendPasswordResetEmail } = await import("firebase/auth");
  if (!auth) throw new Error("Firebase yapılandırılmamış");
  return sendPasswordResetEmail(auth, email);
}

export async function firebaseSignOut() {
  const { signOut } = await import("firebase/auth");
  if (!auth) return;
  return signOut(auth);
}

export async function firebaseOnAuthChange(callback: (user: unknown) => void) {
  const { onAuthStateChanged } = await import("firebase/auth");
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback as never);
}

export async function firebaseUpdateProfile(user: unknown, data: { displayName?: string }) {
  const { updateProfile } = await import("firebase/auth");
  return updateProfile(user as never, data);
}

export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  sendEmailVerification: () => Promise<void>;
};
