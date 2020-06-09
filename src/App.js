import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchScreen from './app/SearchScreen'
import firebase from "firebase";
import { firebaseConfig } from "./app/util/FirebaseInit";

function App() {
  return (
    <div>
      <SearchScreen />
    </div>
  );
}

export default App;
