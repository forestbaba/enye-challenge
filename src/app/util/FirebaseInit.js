/**
 * Initialize firebase and it configs
 */
import * as firebase from "firebase";
require("firebase/functions");

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MESSAGING_ID,
};

let enyeMain = firebase.initializeApp(firebaseConfig, "enyeMain");

export const dataBase = enyeMain.firestore();
export const databaseRealtime = enyeMain.database();
export const mediaStore = enyeMain.storage;
export const authentication = enyeMain.auth();
export const dx = enyeMain;

if (process.env.NODE_ENV === "test") {
  authentication.setPersistence(firebase.auth.Auth.Persistence.NONE);
} else {
  authentication.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
}
