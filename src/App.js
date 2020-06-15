import React, { useState, useEffect } from 'react';
import SearchScreen from './app/SearchScreen'
import firebase from "firebase";
import { firebaseConfig } from "./app/util/FirebaseInit";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './app/pages/Login'
import Register from './app/pages/Register'
import Header from './app/pages/Header'
import { authentication } from './app/util/FirebaseInit'
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from './app/pages/ProtectedRoute'
import { isLogin } from './app/redux/User/action'

const App = () => {
  const realDispatch = useDispatch()

  const [currentUser, setCurrentUser] = useState(null)

  const data = useSelector((state) => state);
  const { userData: { loggedInUser, isAuthenticated } } = data

  useEffect(() => {

    console.log('Dispatch it')
    realDispatch(isLogin())

  }, [])
  return (

    <Router>
      <Header isAuthenticated={isAuthenticated} />
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/register"  exact component={Register} />
        <ProtectedRoute path='/home' exact><SearchScreen/></ProtectedRoute>
        {/* exact path="/home" component={SearchScreen} /> */}

        {/* <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoute path="/">
          <SearchScreen />
        </ProtectedRoute> */}

      </Switch>
    </Router>
  );
}

export default App;
