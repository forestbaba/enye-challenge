import actionTypes from "./actionTypes";

const {
  LOG_IN,
  LOG_IN_FAILURE,
  LOG_IN_SUCCESS,
  IS_LOGGIN,
  IS_LOGGIN_FAILURE,
  IS_LOGIN_SUCCESS,

  IS_LOGOUT,
  IS_LOGOUT_FAILURE,
   IS_LOGOUT_SUCCESS,

  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
} = actionTypes;

const initialState = {
  loading: "false",
  user: {},
  error: {},
  isAuthenticated: false,
  successSignup:false
 
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case IS_LOGGIN:
      return { ...state, loading: true };

    case IS_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: payload,
        isAuthenticated: true
      };

 
    case IS_LOGGIN_FAILURE:
      return {
        ...state,
        loadingCards: false,
        error: payload,
 //      isAuthenticated: false
      };

    case LOG_IN:
      return { ...state, loadingAddress: true };

    case LOG_IN_SUCCESS:
      return {
        ...state,
        loadingAddress: false,
        loggedInUser: payload
      };

    case LOG_IN_FAILURE:
      return { ...state, loading: false, error: payload };
    
    
    case IS_LOGOUT:
      return { ...state, loadingAddress: true };

    case IS_LOGOUT_SUCCESS:
      return {
        ...state,
        loadingAddress: false,
        isAuthenticated: false
      };

    case IS_LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
       isAuthenticated: false
      };
    
    
    case SIGN_UP:
      return { ...state, loadingAddress: true };

    case SIGN_UP_SUCCESS:
      return {
        ...state,
        successSignup: true,
        loadingAddress: false,
      };

    case SIGN_UP_FAILURE:
      return {
        ...state,
        successSignup: false,
        loading: false
      };
    
    
    default:
      return state;
  }
};
