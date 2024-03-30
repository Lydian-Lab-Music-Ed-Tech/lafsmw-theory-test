import {
  collection,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config";

export async function setKeySigData(first, second, third, fourth, currentUser) {
  try {
    await setDoc(doc(db, `${currentUser}`, "keySigsText1"), {
      first: first,
      second: second,
      third: third,
      fourth: fourth,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error("setKeySigData error: ", e);
    return false;
  }
}

export async function setLevelData(level, currentUser) {
  try {
    await setDoc(doc(db, `${currentUser}`, "level"), {
      level: level,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.error("setLevel error: ", e);
    return false;
  }
}

// export async function addKeySigData(first, second, third, fourth, currentUser) {
//   try {
//     const docRef = await addDoc(collection(db, `${currentUser}`), {
//       first: first,
//       second: second,
//       third: third,
//       fourth: fourth,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     // The addDoc creates a new document with a unique ID, and then adds the data to that document. The document ID is automatically generated by Firestore.
//     console.log("Document written with ID: ", docRef.id);
//     return true;
//   } catch (e) {
//     console.error("addKeySigData error: ", e);
//     return false;
//   }
// }

// export async function setKeySigData(collection, id, data) {
//   try {
//     // this doc creates the reference to the document - i.e. where is it?
//     // collection could be "lr" or "messages" in this example, or it could be a path to a subcollection, like "lr/album1"
//     const docRef = doc(db, collection, id);
//     // setDoc is the mutation function that actually adds the data to the database - let me update the server
//     // on the Frontend masters video, he says await is not needed here and it could be actually worse to use it. The purpose of await is to wait for the response from the server, but if you don't need the response, then you don't need await. Firestore autmatically handles the response from the server, so you don't need to wait for it.
//     // also note that setDoc adds data destructively - i.e. it will overwrite any existing data at that location
//     const result = await setDoc(docRef, data, {
//       merge: true,
//     });
//     return { result, error: null };
//   } catch (error) {
//     console.error("addData error:", error);
//     return { result: null, error: error.message };
//   }
// }
