import * as firebase from "firebase-admin";

const options: firebase.AppOptions = {
  projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!options.projectId)
  throw new Error("FIREBASE_PROJECT_ID required in server/.env");

const app = firebase.initializeApp(options);

export { app };
