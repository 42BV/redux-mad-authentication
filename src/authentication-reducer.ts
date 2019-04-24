import { Action } from 'redux';

export type User = object;

export interface AuthenticationState {
  currentUser?: User;
  isLoggedIn: boolean;
  csrfToken?: string;
}

export const initialState: AuthenticationState = {
  currentUser: undefined,
  isLoggedIn: false
};

/**
 * Actions
 */
export const LOGIN = 'REDUX_MAD_AUTHENTICATION.LOGIN';
export const LOGOUT = 'REDUX_MAD_AUTHENTICATION.LOGOUT';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LogoutAction extends Action<typeof LOGOUT> {}
interface LoginAction extends Action<typeof LOGIN> {
  currentUser: User;
}

export type AuthenticationActions = LoginAction | LogoutAction;

export function authentication(
  state = initialState,
  action: AuthenticationActions
): AuthenticationState {
  switch (action.type) {
    case LOGIN: {
      const { currentUser } = action as LoginAction;

      return {
        ...state,
        isLoggedIn: true,
        currentUser
      };
    }

    case LOGOUT: {
      return {
        ...state,
        isLoggedIn: false,
        currentUser: undefined,
        csrfToken: undefined
      };
    }

    default: {
      return state;
    }
  }
}

export function handleLogin(currentUser: User): LoginAction {
  return { type: LOGIN, currentUser };
}

export function handleLogout(): LogoutAction {
  return { type: LOGOUT };
}
