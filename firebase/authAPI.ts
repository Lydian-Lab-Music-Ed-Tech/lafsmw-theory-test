import {
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { auth } from "./config";

// Configuration for email link. This is the URL that the student will be redirected to after clicking the link in their email.
const actionCodeSettings = {
  url: "http://localhost:3000/confirm",
  // url: "https://lafsmwtheoryexam.com/confirm",
  handleCodeInApp: true,
};

export async function sendSignInEmail(email: string) {
  try {
    window.localStorage.setItem("emailForSignIn", email);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  } catch (err) {
    console.error("sendSignInLinkToEmail error:", err);
  }
}

export async function completeSignIn(link: string) {
  console.log("[authAPI:completeSignIn] Called with link:", link);
  try {
    if (isSignInWithEmailLink(auth, link)) {
      let emailForSignIn = window.localStorage.getItem("emailForSignIn");
      console.log(
        "[authAPI:completeSignIn] Email from localStorage:",
        emailForSignIn
      );

      if (!emailForSignIn) {
        console.error(
          "[authAPI:completeSignIn] Email for sign-in not found in localStorage. Aborting."
        );
        // throw new Error("Email for sign-in not found in localStorage."); // Option: throw to be caught by calling page
        return false; // Abort if no email in localStorage
      }

      console.log(
        `[authAPI:completeSignIn] Attempting signInWithEmailLink for email: ${emailForSignIn}`
      );
      const result = await signInWithEmailLink(auth, emailForSignIn, link);
      console.log(
        "[authAPI:completeSignIn] signInWithEmailLink result user:",
        result.user
      );
      console.log(
        "[authAPI:completeSignIn] auth.currentUser AFTER signInWithEmailLink:",
        auth.currentUser ? auth.currentUser.uid : "null"
      );

      window.localStorage.removeItem("emailForSignIn");
      if (result.user) {
        console.log(
          "[authAPI:completeSignIn] Success, user authenticated:",
          result.user.uid
        );
        return true;
      } else {
        console.warn(
          "[authAPI:completeSignIn] signInWithEmailLink result.user is null/undefined despite no error thrown."
        );
        return false;
      }
    } else {
      console.warn(
        "[authAPI:completeSignIn] Link is not a valid sign-in with email link."
      );
      return false;
    }
  } catch (err) {
    console.error("[authAPI:completeSignIn] CATCH BLOCK error:", err);
    const currentUserInCatch = auth.currentUser;
    console.error(
      "[authAPI:completeSignIn] auth.currentUser IN CATCH BLOCK:",
      currentUserInCatch ? currentUserInCatch.uid : "null"
    );
    if (currentUserInCatch) {
      console.warn(
        "[authAPI:completeSignIn] User session IS ACTIVE despite error in signInWithEmailLink. Proceeding as if successful."
      );
      window.localStorage.removeItem("emailForSignIn"); // Ensure this is removed if we proceed
      return true; // Treat as success if user object exists
    }
    return false;
  }
}

export async function signOutOfApp() {
  return signOut(auth);
}

export async function updateDisplayName(displayName: string) {
  try {
    if (auth.currentUser !== null) {
      await updateProfile(auth.currentUser, { displayName: displayName }).catch(
        (err) => console.error("updateProfile error:", err)
      );
    }
  } catch (err) {
    console.error("updateDisplayName error:", err);
  }
}

export async function signUp(
  email: string,
  password: string,
  displayName: string
) {
  try {
    await createUserWithEmailAndPassword(auth, email, password).catch((err) => {
      if (err.code === "auth/email-already-in-use") {
        alert("Email already in use");
      }
      if (err.code === "auth/weak-password") {
        alert("Password should be at least 6 characters long");
      }
      if (err.code === "auth/invalid-email") {
        alert("Invalid email");
      }
      console.error("createUserWithEmailAndPassword error:", err);
    });

    if (auth.currentUser === null) throw new Error("User not created yet.");

    await updateProfile(auth.currentUser, { displayName: displayName }).catch(
      (err) => console.error("updateProfile error:", err)
    );
  } catch (err) {
    console.error("signUp error:", err);
  }
}

export async function signIn(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      console.error("signInWithEmailAndPassword error:", err);
    });
    if (auth.currentUser !== null) {
      return true;
    }
  } catch (err) {
    console.error("signIn error:", err);
  }
}

export async function resetPassword(email: string) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert(`Password reset email sent to ${email}`);
    })
    .catch((err) => {
      console.error("sendPasswordResetEmail error:", err);
    });
}

export async function setUserPassword(newPassword: string): Promise<boolean> {
  try {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
      return true;
    } else {
      console.error("setUserPassword error: No current user.");
      return false;
    }
  } catch (err: any) {
    console.error("setUserPassword error:", err);
    // You might want to handle specific errors like 'auth/weak-password'
    // and provide more specific feedback to the user.
    if (err.code === "auth/weak-password") {
      alert("Password is too weak. It should be at least 6 characters long.");
    }
    return false;
  }
}
