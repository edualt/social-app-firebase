import User from "../../../domain/entities/user";

export enum AuthActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  GET_USER = 'GET_USER',
}

const login = (user: User) => ({
  type: AuthActionTypes.LOGIN,
  payload: user,
});

const logout = () => ({
  type: AuthActionTypes.LOGOUT,
});

const getUser = () => ({
  type: AuthActionTypes.GET_USER,
});

export {login, logout, getUser};
