import { all } from 'redux-saga/effects';
import { userPropSaga } from './User';

export default function* rootSaga() {
    yield all([
        userPropSaga(),
    ]);
}