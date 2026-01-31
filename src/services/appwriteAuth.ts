// Appwrite Authentication Service
import { account, databases, DATABASE_ID, USERS_TABLE_ID, ID } from '../lib/appwrite';
import { Models } from 'appwrite';

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  createdAt: string;
  totalScore?: number;
  levelOneScore?: number;
  levelTwoScore?: number;
  levelThreeScore?: number;
  questionnaireScore?: number;
}

// Sign up with email and password
export const signUp = async (email: string, password: string, name: string) => {
  try {
    // Create account
    const user = await account.create(ID.unique(), email, password, name);
    
    // Create user profile in database table
    await databases.createDocument(
      DATABASE_ID,
      USERS_TABLE_ID,
      user.$id,
      {
        userId: user.$id,
        email: email,
        name: name,
        createdAt: new Date().toISOString(),
        totalScore: 0,
        levelOneScore: 0,
        levelTwoScore: 0,
        levelThreeScore: 0,
        questionnaireScore: 0,
      }
    );
    
    // Auto login after signup
    await account.createEmailPasswordSession(email, password);
    
    return user;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

// Login with email and password
export const login = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }
};

// Logout
export const logout = async () => {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

// Get current user
export const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string) => {
  try {
    // You need to set up the password reset URL in Appwrite console
    const resetUrl = `${window.location.origin}/reset-password`;
    await account.createRecovery(email, resetUrl);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Complete password reset
export const completePasswordReset = async (
  userId: string,
  secret: string,
  password: string,
  confirmPassword: string
) => {
  try {
    await account.updateRecovery(userId, secret, password, confirmPassword);
  } catch (error: any) {
    console.error('Password reset completion error:', error);
    throw new Error(error.message || 'Failed to reset password');
  }
};

// Get user profile from database table
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profile = await databases.getDocument(
      DATABASE_ID,
      USERS_TABLE_ID,
      userId
    );
    return profile as unknown as UserProfile;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
};

// Update user profile in table
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      USERS_TABLE_ID,
      userId,
      data
    );
  } catch (error: any) {
    console.error('Update user profile error:', error);
    throw new Error(error.message || 'Failed to update profile');
  }
};
