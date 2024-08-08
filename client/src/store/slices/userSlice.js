import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  loading: false,
  isAuthenticated: false,
  isregister: false,
  user: {},
  error: null,
  message: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerRequest(state, action) {
      state.loading = true
      state.isAuthenticated = false
      state.user = {}
      state.error = null
      state.message = null
    },
    registerSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.isregister = true
      state.user = action.payload.data
      state.error = null
      state.message = action.payload.message
    },
    registerFailed(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.error = action.payload
      state.message = null
    },
    loginRequest(state, action) {
      state.loading = true
      state.isAuthenticated = false
      state.user = {}
      state.error = null
      state.message = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.error = null
      state.message = action.payload.message
    },
    loginFailed(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.error = action.payload
      state.message = null
    },
    fetchUserRequest(state, action) {
      state.loading = true
      state.isAuthenticated = false
      state.user = {}
      state.error = null
    },
    fetchUserSuccess(state, action) {
      state.loading = false
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    },
    fetchUserFailed(state, action) {
      state.loading = false
      state.isAuthenticated = false
      state.user = {}
      state.error = action.payload
    },
    logoutSuccess(state, action) {
      state.isAuthenticated = false
      state.user = {}
      state.error = null
    },
    logoutFailed(state, action) {
      state.isAuthenticated = state.isAuthenticated
      state.user = state.user
      state.error = action.payload
    },
    clearAllError(state, action) {
      state.user = state.user
      state.error = null
    },
  },
})

export default userSlice.reducer
export const register = (data) => {
  return async (dispatch, getState) => {
    dispatch(userSlice.actions.registerRequest())
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/register',
        data,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )
      console.log(response)
      dispatch(userSlice.actions.registerSuccess(response.data.data))
      dispatch(userSlice.actions.clearAllError())
    } catch (error) {
      console.log(error)
      dispatch(userSlice.actions.registerFailed(error.response.data.message))
    }
  }
}
export const login = (data) => {
  return async (dispatch, getState) => {
    dispatch(userSlice.actions.loginRequest())
    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/user/login',
        data,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )
      console.log(response)
      dispatch(userSlice.actions.loginSuccess(response.data.data))
      dispatch(userSlice.actions.clearAllError())
    } catch (error) {
      dispatch(userSlice.actions.loginFailed(error.response.data.message))
    }
  }
}
export const getUser = () => {
  return async (dispatch, getState) => {
    dispatch(userSlice.actions.fetchUserRequest())
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/user/get-user',
        {
          withCredentials: true,
        },
      )

      dispatch(userSlice.actions.fetchUserSuccess(response.data.data))
      dispatch(userSlice.actions.clearAllError())
    } catch (error) {
      dispatch(userSlice.actions.fetchUserFailed(error.response.data.message))
    }
  }
}
export const logout = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/user/logout',
        {
          withCredentials: true,
        },
      )
      dispatch(userSlice.actions.logoutSuccess())
      dispatch(userSlice.actions.clearAllError())
    } catch (error) {
      dispatch(userSlice.actions.logoutFailed(error.response.data.message))
    }
  }
}
export const clearAllUserErrors = () => {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.clearAllError())
  }
}
