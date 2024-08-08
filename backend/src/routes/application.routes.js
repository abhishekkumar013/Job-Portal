import express from 'express'
import { isAuthenticated, isAuthorized } from '../middlewarw/auth.middleware.js'
import {
  deleteApplication,
  employerGetAllApplications,
  jobSeekerGetAllApplications,
  postApplication,
} from '../controllers/application.controller.js'

const router = express.Router()

router.use(isAuthenticated)

router.route('/post/:id').post(isAuthorized('Job Seeker'), postApplication)

router
  .route('/user/get-all')
  .get(isAuthorized('Job Seeker'), jobSeekerGetAllApplications)

router
  .route('/get-all')
  .get(isAuthorized('Employer'), employerGetAllApplications)

router.route('/delete/:id').delete(deleteApplication)

export default router
