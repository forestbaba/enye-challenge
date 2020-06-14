import { call, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import { channel } from "redux-saga";
import { dataBase, authentication } from "../../util/FirebaseInit";
import * as actions from "./action";
import actionTypes from "./actionTypes";
import axios from "axios";

const {
  isLogin,
  login, isLoginSuccess, isLoginFailure
} = actions;

const {
  IS_LOGGIN,
  LOG_IN
} = actionTypes;


function* checkLogin() {
  const loggedIn = channel();
  try {
    yield
    authentication.onAuthStateChanged(user => {
      if (user) {
        loggedIn.put(isLoginSuccess(user))
      } else {
        loggedIn.put(isLoginFailure(user))
      }



      while (true) {
        const action = yield take(loggedIn);
        yield put(action);

      }

    })

  } catch (error) {
    yield put(isLoginFailure(error));
  }
}

function* userLogin({ payload }) {
  const loggIn = channel();
  try {
    if (payload) {
      yield authentication.signInWithEmailAndPassword(email, password).then(res => {
        dataBase.collection('users').where('uid', '==', res.user.uid).get()
          .then(querySnapshot => {
            console.log(querySnapshot)
            querySnapshot.docs.map(doc => {
              let userData = doc.data();
              console.log(userData)
              loggIn.put(actions.loginSuccess(userData));
            });
          });

      });
      while (true) {
        const action = yield take(loggIn);
        yield put(action);
      }
    }

  } catch (error) {
    yield put(actions.loginFailure(error));
  }
}

export default function* userPropSaga() {
  yield takeEvery(IS_LOGGIN, isLogin);
  yield takeEvery(LOG_IN, userLogin);

}
