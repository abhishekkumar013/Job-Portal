import { configureStore } from '@reduxjs/toolkit'
import JobReducer from './slices/jobSlice'
import UserReducer from './slices/userSlice'
import applicationReducer from './slices/applicationSlice'
import upddateProfileReducer from './slices/updateProfileSlice'

const store = configureStore({
  reducer: {
    jobs: JobReducer,
    user: UserReducer,
    applications: applicationReducer,
    updateProfile: upddateProfileReducer,
  },
})
export default store
