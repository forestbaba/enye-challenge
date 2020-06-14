import React,{useState, useEffect} from 'react';
import SearchScreen from './app/SearchScreen'
import firebase from "firebase";
import { firebaseConfig } from "./app/util/FirebaseInit";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './app/pages/Login'
import Register from './app/pages/Register'
import Header from './app/pages/Header'
import { authentication } from './app/util/FirebaseInit'
import ProtectedRoute from './app/pages/ProtectedRoute'

const App = () => {
  
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    authentication.onAuthStateChanged(function (user) {
      if (user) {
        setCurrentUser(user)
        console.log('There is user: ', user)
        console.log('There is user: ',Object.keys(user))
      } else {
        console.log('Nothing')
      }
    });
  },[])
  return (
    <Router>
      <Header currentUser={currentUser}/>
      <ProtectedRoute exact path="/" component={SearchScreen}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
    </Router>
  );
}

export default App;
