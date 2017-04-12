// @flow

type Action = {
  type: string,
  payload: any
};

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_CSRF_TOKEN = 'SET_CSRF_TOKEN';

export type AuthenticationStore = {
  currentUser?: Object,
  isLoggedIn: boolean,
  csrfToken?: string
};

export const initialState: AuthenticationStore = {
  currentUser: undefined,
  isLoggedIn: false,
  csrfToken: undefined
};

export function authentication(state: AuthenticationStore = initialState, action: Action): AuthenticationStore {
  switch(action.type) {
    case LOGIN: {
      return { ...state, isLoggedIn: true, currentUser: action.payload.currentUser };
    }

    case LOGOUT: {
      return { ...state, isLoggedIn: false, currentUser: undefined, csrfToken: undefined };
    }

    case SET_CSRF_TOKEN: {
      return { ...state, csrfToken: action.payload.csrfToken };
    }

    default: {
      return state;
    }
  }
}

export function handleLogin(currentUser: any): Action {
  return { type: LOGIN, payload: { currentUser } };
}

export function handleLogout(): Action {
  return { type: LOGOUT, payload: {} };
}

export function setCsrfToken(csrfToken: string): Action {
  return { type: SET_CSRF_TOKEN, payload: { csrfToken } };
}
