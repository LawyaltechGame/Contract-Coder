// Appwrite configuration
import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('692d53a00014faea3d4a'); // Your project ID - VERIFY THIS IN APPWRITE CONSOLE!

export const account = new Account(client);
export const databases = new Databases(client);

// Database and Table IDs - You'll need to create these in Appwrite Console
export const DATABASE_ID = '692e8724003c648e2f26'; // Your database ID from the screenshot
export const USERS_TABLE_ID = 'users'; // Create this table
export const SCORES_TABLE_ID = 'scores'; // Create this table (optional)

export { ID };
export default client;
