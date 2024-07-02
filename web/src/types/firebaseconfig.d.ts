// src/types/firebaseconfig.d.ts
declare module "../firebase/firebaseconfig" {
  import { FirebaseApp } from "firebase/app";
  import { Auth } from "firebase/auth";
  
  export const app: FirebaseApp;
  export const auth: Auth;
}
