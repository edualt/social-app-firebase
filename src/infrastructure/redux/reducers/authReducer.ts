import User from '../../../domain/entities/user';
import { AuthActionTypes } from '../actions/authActions';

interface AuthState {
  isLoggedIn: boolean;
  user?: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

export const authReducer = (
  state = initialState,
  action: {type: AuthActionTypes; payload?: User | null},
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return {
        isLoggedIn: true,
        user: action.payload,
      };
    case AuthActionTypes.LOGOUT:
      return {
        isLoggedIn: false,
        user: null,
      };
    case AuthActionTypes.GET_USER:
      return state;
    default:
      return state;
  }
};
