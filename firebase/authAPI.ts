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

export async function completeSignIn(link: string): Promise<boolean> {
  console.log("[authAPI:completeSignIn] Called with link:", link);
  let emailForSignIn = window.localStorage.getItem("emailForSignIn");

  if (!isSignInWithEmailLink(auth, link)) {
    console.warn(
      "[authAPI:completeSignIn] Link is not a valid sign-in with email link."
    );
    return false;
  }

  if (!emailForSignIn) {
    console.error(
      "[authAPI:completeSignIn] Email for sign-in not found in localStorage. Aborting."
    );
    // Potentially prompt user for email here if desired, as Firebase allows it.
    // For now, we require it to be in localStorage.
    return false;
  }

  try {
    console.log(
      `[authAPI:completeSignIn] Attempting signInWithEmailLink for email: ${emailForSignIn}`
    );
    // The signInWithEmailLink function itself will set the user session if successful.
    // It doesn't return a user object in the way createUserWithEmailAndPassword does; its primary effect is auth state change.
    await signInWithEmailLink(auth, emailForSignIn, link);

    // If the above line does not throw, Firebase has processed the link.
    // auth.currentUser should be updated by Firebase's onAuthStateChanged listeners shortly.
    console.log(
      "[authAPI:completeSignIn] signInWithEmailLink processed without throwing an error. Assuming success."
    );
    window.localStorage.removeItem("emailForSignIn");
    return true;
  } catch (err: any) {
    console.error(
      "[authAPI:completeSignIn] CATCH BLOCK error:",
      err,
      "Code:",
      err.code
    );

    // Check if auth.currentUser became available despite the error (Firebase can be complex)
    // This is a critical check because onAuthStateChanged might have already fired and set the user.
    if (auth.currentUser) {
      console.warn(
        "[authAPI:completeSignIn] auth.currentUser IS POPULATED in catch block. Proceeding as success."
      );
      window.localStorage.removeItem("emailForSignIn");
      return true;
    }

    // If the error is 'auth/email-already-in-use', it means the email is known (e.g., has a password),
    // but the link itself was valid and likely authenticated the user.
    // Firebase's behavior here can be tricky; sometimes it errors but still establishes a session.
    if (err.code === "auth/email-already-in-use") {
      console.warn(
        "[authAPI:completeSignIn] Error 'auth/email-already-in-use' caught. Treating as successful sign-in for existing user."
      );
      window.localStorage.removeItem("emailForSignIn");
      return true; // Proceed as if sign-in was successful.
    }

    // For any other errors, consider it a failure.
    console.error(
      "[authAPI:completeSignIn] Unhandled error or sign-in failed definitively."
    );
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
