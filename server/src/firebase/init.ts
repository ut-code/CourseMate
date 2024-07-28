import * as admin from "firebase-admin";

const options: admin.AppOptions = {
  projectId: process.env.FIREBASE_PROJECT_ID,
};
if (!options.projectId)
  throw new Error("FIREBASE_PROJECT_ID required in server/.env");

const app = admin.initializeApp(options);

export { app };
