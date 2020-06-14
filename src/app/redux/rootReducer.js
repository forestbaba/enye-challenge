import { combineReducers } from 'redux';
import * as userData from './User';

const allReducers = combineReducers({
	userData: userData.reducer,
});

export default allReducers;