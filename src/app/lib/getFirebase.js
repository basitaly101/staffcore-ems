import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// SAVE USER ROLE
export const saveUserRole = async (uid, data) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...data,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

// GET USER ROLE
export const getUserRole = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      return snap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};
