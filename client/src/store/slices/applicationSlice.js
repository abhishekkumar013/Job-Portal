import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  applications: [],
  loading: false,
  error: null,
  message: null,
}

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    requestForAllApplications(state, action) {
      state.loading = true
      state.error = null
    },
    successForAllApplications(state, action) {
      state.loading = false
      state.error = null
      state.message = action.payload
    },
    failureForAllApplications(state, action) {
      state.loading = false
      state.error = action.payload
    },
    requestForMyApplications(state, action) {
      state.loading = true
      state.error = null
    },
    successForMyApplications(state, action) {
      state.loading = false
      state.error = null

      state.applications = action.payload
    },
    failureForMyApplications(state, action) {
      state.loading = false
      state.error = action.payload
    },
    requestForPostApplication(state, action) {
      state.loading = true
      state.error = null
      state.message = null
    },
    successForPostApplication(state, action) {
      state.loading = false
      state.error = null
      state.message = action.payload
    },
    failureForPostApplication(state, action) {
      state.loading = false
      state.error = action.payload
      state.message = null
    },
    requestForDeleteApplication(state, action) {
      state.loading = true
      state.error = null
      state.message = null
    },
    successForDeleteApplication(state, action) {
      state.loading = false
      state.error = null
      state.message = action.payload
    },
    failureForDeleteApplication(state, action) {
      state.loading = false
      state.error = action.payload
      state.message = null
    },

    clearAllErrors(state, action) {
      state.error = null
      state.applications = state.applications
    },
    resetApplicationSlice(state, action) {
      state.error = null
      state.applications = state.applications
      state.message = null
      state.loading = false
    },
  },
})
export default applicationSlice.reducer
export const fetchEmployerApplications = () => {
  return async (dispatch, getState) => {
    dispatch(applicationSlice.actions.requestForAllApplications())
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/application/get-all',
        {
          withCredentials: true,
        },
      )
      console.log(response)
      if (response.data.success) {
        dispatch(
          applicationSlice.actions.successForMyApplications(
            response.data.data.applications,
          ),
        )
      } else {
        dispatch(
          applicationSlice.actions.successForAllApplications(
            response.data.message,
          ),
        )
      }

      dispatch(applicationSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(
        applicationSlice.actions.failureForAllApplications(
          error.response.message,
        ),
      )
    }
  }
}
export const fetchJobSeekerApplications = () => {
  return async (dispatch, getState) => {
    dispatch(applicationSlice.actions.requestForMyApplications())
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/application/user/get-all',
        {
          withCredentials: true,
        },
      )

      dispatch(
        applicationSlice.actions.successForMyApplications(
          response.data.data.applications,
        ),
      )
      dispatch(applicationSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(
        applicationSlice.actions.failureForMyApplications(
          error.response.data.message,
        ),
      )
    }
  }
}
export const postApplication = (id) => {
  return async (dispatch, getState) => {
    dispatch(applicationSlice.actions.requestForPostApplication())
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/application/post/${id}`,
        {},
        {
          withCredentials: true,
        },
      )
      console.log(response)
      dispatch(
        applicationSlice.actions.successForPostApplication(
          response.data.message,
        ),
      )
      dispatch(applicationSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(
        applicationSlice.actions.failureForPostApplication(
          error.response.data.message,
        ),
      )
    }
  }
}

export const deleteApplication = (id) => {
  return async (dispatch, getState) => {
    dispatch(applicationSlice.actions.requestForDeleteApplication())
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/application/delete/${id}`,
        { withCredentials: true },
      )
      dispatch(
        applicationSlice.actions.successForDeleteApplication(
          response.data.message,
        ),
      )
      dispatch(clearAllApplicationErrors())
    } catch (error) {
      dispatch(
        applicationSlice.actions.failureForDeleteApplication(
          error.response.data.message,
        ),
      )
    }
  }
}
export const clearAllApplicationErrors = () => (dispatch) => {
  dispatch(applicationSlice.actions.clearAllErrors())
}

export const resetApplicationSlice = () => (dispatch) => {
  dispatch(applicationSlice.actions.resetApplicationSlice())
}
