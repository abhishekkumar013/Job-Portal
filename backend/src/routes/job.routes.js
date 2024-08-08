import express from 'express'
import { isAuthenticated, isAuthorized } from '../middlewarw/auth.middleware.js'
import {
  deleteJob,
  getAllJob,
  getMyJobs,
  getSingleJob,
  postJob,
} from '../controllers/job.controller.js'

const router = express.Router()

router.use(isAuthenticated)

router.route('/post').post(isAuthorized('Employer'), postJob)
router.route('/getall').get(getAllJob)
router.route('/myjobs').get(isAuthorized('Employer'), getMyJobs)
router.route('/delete/:id').delete(isAuthorized('Employer'), deleteJob)
router.route('/get/:id').get(getSingleJob)

export default router
