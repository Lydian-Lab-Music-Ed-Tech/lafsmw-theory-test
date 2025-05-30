import { InputState } from "@/app/lib/types";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config";

export async function getStudentData() {
  try {
    const currentUserID = auth.currentUser?.uid;
    if (!currentUserID) {
      throw new Error("No current user ID found.");
    }

    const docRef = doc(db, "students", currentUserID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        success: true,
        message: `Successfully fetched student data for UID: ${currentUserID}`,
        error: null,
        data,
      };
    } else {
      return {
        success: true,
        message: `No existing data found for UID: ${currentUserID}`,
        error: null,
        data: null,
      };
    }
  } catch (e) {
    return {
      success: false,
      message: `Error fetching student data: ${e}`,
      error: e,
      data: null,
    };
  }
}

export async function setOrUpdateStudentData(formInput: InputState) {
  try {
    const currentUserID = auth.currentUser?.uid;
    if (!currentUserID) {
      console.error("setOrUpdateStudentData error: No current user ID found.");
      return false;
    }

    const docRef = doc(db, "students", currentUserID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ...formInput,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...formInput,
        createdAt: serverTimestamp(),
      });
    }
    return true;
  } catch (e) {
    console.error("setOrUpdateStudentData error: ", e);
    return false;
  }
}
