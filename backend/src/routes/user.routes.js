import express from 'express'
import { upload } from '../middlewarw/multer.middleware.js'
import {
  getUser,
  login,
  logout,
  register,
  updatePassword,
  updateProfile,
} from '../controllers/user.controller.js'
import { isAuthenticated } from '../middlewarw/auth.middleware.js'
const router = express.Router()

router.route('/register').post(upload.single('resume'), register)
router.route('/login').post(login)
router.route('/logout').get(isAuthenticated, logout)
router.route('/get-user').get(isAuthenticated, getUser)

router
  .route('/update')
  .put(isAuthenticated, upload.single('resume'), updateProfile)

router.route('/update-password').put(isAuthenticated, updatePassword)
export default router
