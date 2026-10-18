import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let isConnected = false;
let memoryStoreMode = false;

// Local JSON storage path for fallback mode
const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), 'local_storage');
const LOCAL_PROJECTS_FILE = path.join(LOCAL_STORAGE_DIR, 'projects.json');
const LOCAL_USERS_FILE = path.join(LOCAL_STORAGE_DIR, 'users.json');

export const getStorageMode = () => ({
  isConnected,
  memoryStoreMode,
});

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vivahpatra';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    memoryStoreMode = false;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Activating local persistence fallback mode.`);
    isConnected = false;
    memoryStoreMode = true;
    initLocalStorage();
    return false;
  }
};

// Local JSON fallback utilities
const initLocalStorage = () => {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_PROJECTS_FILE)) {
    fs.writeFileSync(LOCAL_PROJECTS_FILE, JSON.stringify([]), 'utf8');
  }
  if (!fs.existsSync(LOCAL_USERS_FILE)) {
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify([]), 'utf8');
  }
};

export const getLocalProjects = (): any[] => {
  try {
    initLocalStorage();
    const data = fs.readFileSync(LOCAL_PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveLocalProjects = (projects: any[]) => {
  try {
    initLocalStorage();
    fs.writeFileSync(LOCAL_PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local projects:', err);
  }
};

export const getLocalUsers = (): any[] => {
  try {
    initLocalStorage();
    const data = fs.readFileSync(LOCAL_USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveLocalUsers = (users: any[]) => {
  try {
    initLocalStorage();
    fs.writeFileSync(LOCAL_USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local users:', err);
  }
};
