import User from '../model/user.model.js'
import { asyncHandler } from './asyncHandler.middleware.js'
import { ErrorHandler } from './error.middleware.js'
import jwt from 'jsonwebtoken'

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return next(new ErrorHandler('User is not authenticated', 400))
  }
  const decode = await jwt.verify(token, process.env.ACCESSTOKEN_SECRET)
  req.user = await User.findById(decode._id)
  next()
})

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} not allowed to access this resources`,
        ),
      )
    }
    next()
  }
}
