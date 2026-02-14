import { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  type ReactNode 
} from "react";

import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
  getCurrentUser,
} from "@/features/auth/services";

import { 
  AuthUser, 
  AuthContextType 
} from "@/features/auth/types";


export const AuthContext = createContext<
AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session on mount (handles "Remember Me" persistence)
  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (usernameOrEmail: string, 
     password: string, remember: boolean = false): boolean => {
      const result = loginService(usernameOrEmail, password, remember);
      if (result) {
        setUser(result);
        return true;
      }
      return false;
    },
    []
  );

  const signup = useCallback(
    (email: string, username: string, password: string): boolean => {
      const result = signupService(email, username, password);
      if (result) {
        setUser(result);
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
