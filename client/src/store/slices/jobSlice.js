import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  message: null,
  singleJob: {},
  myJobs: [],
}

const jobSlice = createSlice({
  name: 'jobs',
  initialState,

  reducers: {
    requestForAllJobs(state, action) {
      state.loading = true
      state.error = null
    },
    successForAllJobs(state, action) {
      state.loading = false
      state.jobs = action.payload
      state.error = null
    },
    failureForAllJobs(state, action) {
      state.loading = false
      state.error = action.payload
    },
    requestForSingleJob(state, action) {
      state.message = null
      state.error = null
      state.loading = true
    },
    successForSingleJob(state, action) {
      state.loading = false
      state.error = null
      state.singleJob = action.payload
    },
    failureForSingleJob(state, action) {
      state.singleJob = state.singleJob
      state.error = action.payload
      state.loading = false
    },
    requestForPostJob(state, action) {
      state.message = null
      state.error = null
      state.loading = true
    },
    successForPostJob(state, action) {
      state.message = action.payload
      state.error = null
      state.loading = false
    },
    failureForPostJob(state, action) {
      state.message = null
      state.error = action.payload
      state.loading = false
    },

    requestForDeleteJob(state, action) {
      state.loading = true
      state.error = null
      state.message = null
    },
    successForDeleteJob(state, action) {
      state.loading = false
      state.error = null
      state.message = action.payload
    },
    failureForDeleteJob(state, action) {
      state.loading = false
      state.error = action.payload
      state.message = null
    },

    requestForMyJobs(state, action) {
      state.loading = true
      state.myJobs = []
      state.error = null
    },
    successForMyJobs(state, action) {
      state.loading = false
      state.myJobs = action.payload
      state.error = null
    },
    failureForMyJobs(state, action) {
      state.loading = false
      state.myJobs = state.myJobs
      state.error = action.payload
    },

    clearAllErrors(state, action) {
      state.error = null
      state.jobs = state.jobs
    },
    resetJobSlice(state, action) {
      state.error = null
      state.jobs = state.jobs
      state.loading = false
      state.message = null
      state.myJobs = state.myJobs
      state.singleJob = {}
    },
  },
})

export default jobSlice.reducer

export const fetchJobs = (city, niche, searchKeyword = '') => {
  return async (dispatch, getState) => {
    try {
      dispatch(jobSlice.actions.requestForAllJobs())
      let link = 'http://localhost:8080/api/v1/job/getall?'
      let queryParams = []
      if (searchKeyword) {
        queryParams.push(`searchKeyword=${searchKeyword}`)
      }
      if (city) {
        queryParams.push(`city=${city}`)
      }
      if (niche) {
        queryParams.push(`niche=${niche}`)
      }

      link += queryParams.join('&')
      const { data, status } = await axios.get(link, { withCredentials: true })

      dispatch(jobSlice.actions.successForAllJobs(data.data.jobs))
      dispatch(jobSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(jobSlice.actions.failureForAllJobs(error.response.data.message))
    }
  }
}
export const fetchSingleJob = (jobId) => {
  return async (dispatch, getState) => {
    dispatch(jobSlice.actions.requestForSingleJob())
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/job/get/${jobId}`,
        { withCredentials: true },
      )

      dispatch(jobSlice.actions.successForSingleJob(response.data.data))
      dispatch(jobSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(
        jobSlice.actions.failureForSingleJob(error.response.data.message),
      )
    }
  }
}
export const postJob = (data) => {
  return async (dispatch, getState) => {
    dispatch(jobSlice.actions.requestForPostJob())
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/job/post`,
        data,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )
      console.log(response)
      dispatch(jobSlice.actions.successForPostJob(response.data.message))
      dispatch(jobSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(jobSlice.actions.failureForPostJob(error.response.data.message))
    }
  }
}

export const getMyJobs = () => {
  return async (dispatch, getState) => {
    dispatch(jobSlice.actions.requestForMyJobs())
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/job/myjobs`,

        { withCredentials: true },
      )

      dispatch(jobSlice.actions.successForMyJobs(response.data.data))
      dispatch(jobSlice.actions.clearAllErrors())
    } catch (error) {
      dispatch(jobSlice.actions.failureForMyJobs(error.response.data.message))
    }
  }
}

export const deleteJob = (id) => {
  return async (dispatch, getState) => {
    dispatch(jobSlice.actions.requestForDeleteJob())
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/job/delete/${id}`,
        { withCredentials: true },
      )
      dispatch(jobSlice.actions.successForDeleteJob(response.data.message))
      dispatch(clearAllJobError())
    } catch (error) {
      dispatch(
        jobSlice.actions.failureForDeleteJob(error.response.data.message),
      )
    }
  }
}
export const clearAllJobError = () => {
  return (dispatch, getState) => {
    dispatch(jobSlice.actions.clearAllErrors())
  }
}

export const resetJobSlice = () => {
  return (dispatch, getState) => {
    dispatch(jobSlice.actions.resetJobSlice())
  }
}
