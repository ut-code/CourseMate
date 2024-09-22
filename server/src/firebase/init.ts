import { type AppOptions, initializeApp } from "firebase-admin";

const options: AppOptions = {
  projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!options.projectId)
  throw new Error("FIREBASE_PROJECT_ID required in server/.env");

const app = initializeApp(options);

export { app };
