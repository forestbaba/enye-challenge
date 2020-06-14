import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const composeEnhancers = typeof window === 'object' &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
	compose;

const enhancer = composeEnhancers(
	applyMiddleware(...middlewares)
);


export const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);
