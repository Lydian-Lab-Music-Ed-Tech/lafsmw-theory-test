"use client";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { User, onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import CreateAuthContext from "./createAuthContext";
import { AuthContextType } from "@/app/lib/types";

// AuthContextProvider is a wrapper component that will provide the auth context to all its children
export default function AuthContextProvider({ children }: AuthContextType) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This returns the unsubscribe function for the observer, so when the component unmounts, we'll call the unsubscribe function to stop listening for changes in the authentication state of the user, and prevent memory leaks.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // to enable the components to consume the values from this auth user context, we need to create an auth context provider to return a provider for the context we just created. The value prop will contain the data we want to make available to our component tree
  return (
    <CreateAuthContext.Provider value={{ user, setUser }}>
      {loading ? (
        <Stack gap={4} alignItems={"center"} paddingTop={16}>
          <Box>{"Loading..."}</Box>
          <Box>{"(if taking too long, please refresh the page)"}</Box>
        </Stack>
      ) : (
        children
      )}
    </CreateAuthContext.Provider>
  );
}

// useAuthContext is a custom hook that allows us to use the auth context in our components - to access the current context value (consume the values from the auth user context)
export function useAuthContext() {
  const context = useContext(CreateAuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
