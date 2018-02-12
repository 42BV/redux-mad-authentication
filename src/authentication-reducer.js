// @flow

export type Action = 
  | { type: 'REDUX_MAD_AUTHENTICATION.LOGIN', currentUser: Object }
  | { type: 'REDUX_MAD_AUTHENTICATION.LOGOUT' };

export type AuthenticationStore = {
  +currentUser?: Object,
  +isLoggedIn: boolean
};

export const initialState: AuthenticationStore = {
  currentUser: undefined,
  isLoggedIn: false
};

export function authentication(state: AuthenticationStore = initialState, action: Action): AuthenticationStore {
  switch(action.type) {
    case 'REDUX_MAD_AUTHENTICATION.LOGIN': {
      return { ...state, isLoggedIn: true, currentUser: action.currentUser };
    }

    case 'REDUX_MAD_AUTHENTICATION.LOGOUT': {
      return { ...state, isLoggedIn: false, currentUser: undefined, csrfToken: undefined };
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
