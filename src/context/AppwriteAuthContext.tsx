import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Models } from "appwrite";
import * as appwriteAuth from "../services/appwriteAuth";

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signup: (formData: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AppwriteAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await appwriteAuth.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData: SignupData) => {
    try {
      const { email, password, name = "" } = formData;
      const newUser = await appwriteAuth.signUp(email, password, name);
      setUser(newUser as Models.User<Models.Preferences>);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await appwriteAuth.login(email, password);
      const currentUser = await appwriteAuth.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await appwriteAuth.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppwriteAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppwriteAuth must be used within an AppwriteAuthProvider");
  }
  return context;
};
