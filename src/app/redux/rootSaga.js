import { all } from 'redux-saga/effects';
import { userAuthSaga } from './User';

export default function* rootSaga() {
    yield all([
         userPropSaga(),
    ]);
}