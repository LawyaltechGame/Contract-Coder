// Appwrite Score Management Service
import { databases, DATABASE_ID, USERS_TABLE_ID, ID } from '../lib/appwrite';
import { Query } from 'appwrite';

export interface UserScoreData {
  userId: string;
  totalScore?: number;
  levelOneScore?: number;
  levelTwoScore?: number;
  levelThreeScore?: number;
  questionnaireScore?: number;
  levelOneAttempts?: number;
  levelTwoAttempts?: number;
  levelThreeAttempts?: number;
  levelOneHighestScore?: number;
  levelTwoHighestScore?: number;
  levelThreeHighestScore?: number;
  lastUpdated?: string;
}

// Get user score data
export const getUserScores = async (userId: string): Promise<UserScoreData | null> => {
  try {
    const document = await databases.getDocument(
      DATABASE_ID,
      USERS_TABLE_ID,
      userId
    );
    return document as unknown as UserScoreData;
  } catch (error) {
    console.error('Error fetching user scores:', error);
    return null;
  }
};

// Update user scores
export const updateUserScores = async (
  userId: string,
  scoreData: Partial<UserScoreData>
): Promise<void> => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      USERS_TABLE_ID,
      userId,
      {
        ...scoreData,
        lastUpdated: new Date().toISOString(),
      }
    );
  } catch (error: any) {
    console.error('Error updating user scores:', error);
    throw new Error(error.message || 'Failed to update scores');
  }
};

// Update level one score
export const updateLevelOneScore = async (
  userId: string,
  score: number,
  attempts: number
): Promise<void> => {
  try {
    const currentData = await getUserScores(userId);
    const currentHighest = currentData?.levelOneHighestScore || 0;
    const newHighest = Math.max(currentHighest, score);
    
    await updateUserScores(userId, {
      levelOneScore: score,
      levelOneAttempts: attempts,
      levelOneHighestScore: newHighest,
      totalScore: (currentData?.totalScore || 0) + score,
    });
  } catch (error) {
    console.error('Error updating level one score:', error);
    throw error;
  }
};

// Update level two score
export const updateLevelTwoScore = async (
  userId: string,
  score: number,
  attempts: number
): Promise<void> => {
  try {
    const currentData = await getUserScores(userId);
    const currentHighest = currentData?.levelTwoHighestScore || 0;
    const newHighest = Math.max(currentHighest, score);
    
    await updateUserScores(userId, {
      levelTwoScore: score,
      levelTwoAttempts: attempts,
      levelTwoHighestScore: newHighest,
      totalScore: (currentData?.totalScore || 0) + score,
    });
  } catch (error) {
    console.error('Error updating level two score:', error);
    throw error;
  }
};

// Update level three score
export const updateLevelThreeScore = async (
  userId: string,
  score: number,
  attempts: number
): Promise<void> => {
  try {
    const currentData = await getUserScores(userId);
    const currentHighest = currentData?.levelThreeHighestScore || 0;
    const newHighest = Math.max(currentHighest, score);
    
    await updateUserScores(userId, {
      levelThreeScore: score,
      levelThreeAttempts: attempts,
      levelThreeHighestScore: newHighest,
      totalScore: (currentData?.totalScore || 0) + score,
    });
  } catch (error) {
    console.error('Error updating level three score:', error);
    throw error;
  }
};

// Update questionnaire score
export const updateQuestionnaireScore = async (
  userId: string,
  score: number
): Promise<void> => {
  try {
    const currentData = await getUserScores(userId);
    
    await updateUserScores(userId, {
      questionnaireScore: score,
      totalScore: (currentData?.totalScore || 0) + score,
    });
  } catch (error) {
    console.error('Error updating questionnaire score:', error);
    throw error;
  }
};
