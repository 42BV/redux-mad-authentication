// @flow

export type Action = 
  | { type: 'REDUX_MAD_AUTHENTICATION.LOGIN', currentUser: Object }
  | { type: 'REDUX_MAD_AUTHENTICATION.LOGOUT' }
  | { type: 'REDUX_MAD_AUTHENTICATION.SET_CSRF_TOKEN', csrfToken: string };

export type AuthenticationStore = {
  +currentUser?: Object,
  +isLoggedIn: boolean,
  +csrfToken?: string
};

export const initialState: AuthenticationStore = {
  currentUser: undefined,
  isLoggedIn: false,
  csrfToken: undefined
};

export function authentication(state: AuthenticationStore = initialState, action: Action): AuthenticationStore {
  switch(action.type) {
    case 'REDUX_MAD_AUTHENTICATION.LOGIN': {
      return { ...state, isLoggedIn: true, currentUser: action.currentUser };
    }

    case 'REDUX_MAD_AUTHENTICATION.LOGOUT': {
      return { ...state, isLoggedIn: false, currentUser: undefined, csrfToken: undefined };
    }

    case 'REDUX_MAD_AUTHENTICATION.SET_CSRF_TOKEN': {
      return { ...state, csrfToken: action.csrfToken };
    }

    default: {
      return state;
    }
  }
}

export function handleLogin(currentUser: Object): Action {
  return { type: 'REDUX_MAD_AUTHENTICATION.LOGIN', currentUser };
}

export function handleLogout(): Action {
  return { type: 'REDUX_MAD_AUTHENTICATION.LOGOUT' };
}

export function setCsrfToken(csrfToken: string): Action {
  return { type: 'REDUX_MAD_AUTHENTICATION.SET_CSRF_TOKEN', csrfToken };
}
