import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Google Docs scope
provider.addScope('https://www.googleapis.com/auth/docs');

let cachedToken: string | null = null;
let isSigningIn = false;

// Initialize Authentication Listener
export const initAuth = (
  onSuccess: (user: User, token: string) => void,
  onFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedToken) {
        onSuccess(user, cachedToken);
      } else if (!isSigningIn) {
        cachedToken = null;
        onFailure();
      }
    } else {
      cachedToken = null;
      onFailure();
    }
  });
};

// Start Google sign-in popup
export const signInWithGoogle = async (): Promise<{ user: User; token: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential || !credential.accessToken) {
      throw new Error("Could not fetch Google access credentials.");
    }
    cachedToken = credential.accessToken;
    return { user: result.user, token: cachedToken };
  } catch (error: any) {
    console.error("Google Docs Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Sign-out action
export const signOutFromGoogle = async () => {
  await auth.signOut();
  cachedToken = null;
};

// Helper: Create a fresh Google Document
export const createGoogleDocument = async (title: string, token: string): Promise<{ documentId: string; title: string }> => {
  const response = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title
    })
  });

  if (!response.ok) {
    const errContent = await response.text();
    throw new Error(`Google Docs Creation Failed: ${errContent}`);
  }

  return await response.json();
};

// Helper: Append formatted content structure via Google Docs batchUpdate
export interface GoogleDocInsertRequest {
  text: string;
  isHeading?: boolean;
}

export const appendTextToGoogleDocument = async (documentId: string, textSegments: GoogleDocInsertRequest[], token: string): Promise<any> => {
  // To avoid index conflicts, we can do batchUpdate requests.
  // We'll write them in reverse order, or insert one by one, or combine them with calculated offsets.
  // In the Docs API, index 1 is the beginning of the document.
  // Let's perform a simple batch update that inserts all the text.
  
  // Combine all segments into a Single text payload with formatting requests or insert them.
  // For simplicity and high robustness, we'll combine text in a single formatted string,
  // or construct a sequence of insertText and updateParagraphStyle steps.
  
  const requests: any[] = [];
  let currentOffset = 1;
  
  // We apply inserts in reverse order to keep positions simple, or we can just append
  // inside index 1.
  // Let's insert from last to first so that the index calculated is simple, OR
  // build a clean forward payload.
  // Let's serialize the text in reverse order so index 1 works perfectly and pushes older items down!
  const reversedSegments = [...textSegments].reverse();
  
  for (const segment of reversedSegments) {
    requests.push({
      insertText: {
        text: segment.text,
        location: {
          index: 1
        }
      }
    });
  }

  const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: requests
    })
  });

  if (!response.ok) {
    const errContent = await response.text();
    throw new Error(`Google Docs Update Failed: ${errContent}`);
  }

  return await response.json();
};

// Helper: Fetch a Google Document and extract body text for preview summary
export const getGoogleDocument = async (documentId: string, token: string): Promise<{ documentId: string; title: string; textContent: string }> => {
  const response = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errContent = await response.text();
    throw new Error(`Google Docs Fetch Failed: ${errContent}`);
  }

  const data = await response.json();
  const title = data.title || "Untitled Document";
  
  // Extract text from the Google Docs structural elements
  let textContent = "";
  if (data.body && Array.isArray(data.body.content)) {
    for (const structuralElement of data.body.content) {
      if (structuralElement.paragraph && Array.isArray(structuralElement.paragraph.elements)) {
        for (const element of structuralElement.paragraph.elements) {
          if (element.textRun && typeof element.textRun.content === 'string') {
            textContent += element.textRun.content;
          }
        }
      }
    }
  }

  return {
    documentId,
    title,
    textContent: textContent.trim()
  };
};
