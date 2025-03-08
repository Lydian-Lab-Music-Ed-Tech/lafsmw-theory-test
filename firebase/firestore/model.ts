import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { db, auth } from "../config";
import { InputState } from "@/app/lib/types";

export async function getUserSnapshot() {
  // only need to retrieve displayName when fetching data
  const currentUser = auth.currentUser?.displayName;
  try {
    if (!currentUser) {
      throw new Error("No current user found.");
    }
    const q = query(collection(db, currentUser));
    const querySnapshot = await getDocs(q);

    const res = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return {
      success: true,
      message: `Successfully fetched ${currentUser} data`,
      error: null,
      res,
    };
  } catch (e) {
    return {
      success: false,
      message: `Error fetching ${currentUser || "unknown user"} data: ${e}`,
      error: e,
    };
  }
}

async function setStudentData(formInput: InputState, currentUser: string) {
  try {
    const currentUserID = auth.currentUser?.uid;
    await setDoc(doc(db, `${currentUser}`, `${currentUserID}`), {
      ...formInput,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error("setStudentData error: ", e);
    return false;
  }
}

async function updateStudentData(formInput: InputState, currentUser: string) {
  try {
    const currentUserID = auth.currentUser?.uid;
    const docRef = doc(db, `${currentUser}`, `${currentUserID}`);
    await updateDoc(docRef, {
      ...formInput,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error("updateStudentData error: ", e);
    return false;
  }
}

export async function setOrUpdateStudentData(
  formInput: InputState,
  currentUser: string
) {
  const currentUserID = auth.currentUser?.uid;
  try {
    const docRef = doc(db, `${currentUser}`, `${currentUserID}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateStudentData(formInput, currentUser);
    } else {
      await setStudentData(formInput, currentUser);
    }
    return true;
  } catch (e) {
    console.error("setOrUpdateStudentData error: ", e);
    return false;
  }
}
