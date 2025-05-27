import { InputState } from "@/app/lib/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config";

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
      console.log(
        `[firestore/model] Student data updated for UID: ${currentUserID} in 'students' collection.`
      );
    } else {
      await setDoc(docRef, {
        ...formInput,
        createdAt: serverTimestamp(),
      });
      console.log(
        `[firestore/model] New student data created for UID: ${currentUserID} in 'students' collection.`
      );
    }
    return true;
  } catch (e) {
    console.error("setOrUpdateStudentData error: ", e);
    return false;
  }
}
