import actionTypes from './actionTypes';

const {
	LOG_IN,
	LOG_IN_FAILURE,
	LOG_IN_SUCCESS,
	IS_LOGGIN,
	IS_LOGGIN_FAILURE,
	IS_LOGIN_SUCCESS

} = actionTypes;


export const isLogin = payload => ({
	payload,
	type: IS_LOGGIN,
});

export const isLoginSuccess = payload => ({
	payload,
	type: LOG_IN_SUCCESS,
});

export const isLoginFailure = payload => ({
	payload,
	type: LOG_IN_FAILURE,
});

export const login = payload => ({
	payload,
	type: LOG_IN,
});

export const loginSuccess = payload => ({
	payload,
	type: LOG_IN_SUCCESS,
});
export const loginFailure = payload => ({
	payload,
	type: LOG_IN_FAILURE,
});