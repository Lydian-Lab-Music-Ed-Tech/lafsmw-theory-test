import { User } from "firebase/auth";
import React, { createContext } from "react";

type CreateAuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// stores the default values for the context that we want our compnonents to have access to
const initialState: CreateAuthContextType = {
  user: null,
  setUser: () => {},
};

const CreateAuthContext = createContext<CreateAuthContextType>(initialState);

export default CreateAuthContext;
