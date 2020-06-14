import actionTypes from "./actionTypes";

const {
  LOG_IN,
  LOG_IN_FAILURE,
  LOG_IN_SUCCESS,
  IS_LOGGIN,
  IS_LOGGIN_FAILURE,
  IS_LOGIN_SUCCESS
} = actionTypes;

const initialState = {
  loading: "false",
  user: {},
  error:{}
 
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case IS_LOGGIN:
      return { ...state, loading: true };

    case IS_LOGIN_SUCCESS:
      return { ...state, loading: false, user:payload };

 
    case IS_LOGGIN_FAILURE:
      return {
        ...state,
        loadingCards: false,
       error:payload,
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
    default:
      return state;
  }
};
