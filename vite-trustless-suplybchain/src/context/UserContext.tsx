import React, { createContext, useState, type ReactNode, useEffect } from "react";
import type { User } from "../types";

/**
 * Context that holds the currently selected user and a function to update it.
 */
interface UserContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  users: User[];
}

export const UserContext = createContext<UserContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
  users: []
});

interface UserProviderProps {
  children: ReactNode;
}

/**
 * Provider component that parses the VITE_USERS environment variable
 * and exposes the user list and currently selected user.
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = import.meta.env.VITE_USERS as string;
      const parsed: User[] = JSON.parse(raw);
      setUsers(parsed);
      // Default al primer usuario
      if (parsed.length > 0) {
        setCurrentUser(parsed[0]);
      }
    } catch (err) {
      console.error("Failed to parse VITE_USERS:", err);
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users }}>
      {children}
    </UserContext.Provider>
  );
};
