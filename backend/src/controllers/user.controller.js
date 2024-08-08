import { asyncHandler } from '../middlewarw/asyncHandler.middleware.js'
import {
  ErrorHandler,
  errorMiddleware,
} from '../middlewarw/error.middleware.js'
import User from '../model/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { sendToken } from '../utils/jwtToken.js'
import { v2 as cloudinary } from 'cloudinary'

export const register = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      role,
      password,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body
    if (
      [
        name,
        email,
        phone,
        address,
        password,
        firstNiche,
        secondNiche,
        thirdNiche,
      ].some((field) => field?.trim() === '')
    ) {
      return next(new ErrorHandler('All Filds are required', 400))
    }

    if (role === 'Job Seeker' && (!firstNiche || !secondNiche || !thirdNiche)) {
      return next(new ErrorHandler('Please  Provide All your niches', 400))
    }

    const existing_user = await User.findOne({ email })
    if (existing_user) {
      return next(new ErrorHandler('User Already Register! Login Please', 400))
    }

    const userData = {
      name,
      email,
      phone,
      address,
      role,
      password,
      coverLetter,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
    }
    if (req.file && req.file?.path) {
      try {
        const resume_local_path = req.file?.path
        console.log(resume_local_path)
        const resume = await uploadOnCloudinary(resume_local_path)

        console.log(resume)
        if (!resume || !resume?.url) {
          return next(new ErrorHandler('Error In Resume Uploading', 500))
        }
        userData.resume = {
          public_id: resume.public_id,
          url: resume.url,
        }
      } catch (error) {
        return next(new ErrorHandler('Failed to upload resume', 500))
      }
    }
    const user_create = await User.create(userData)

    const user = await User.findById(user_create._id).select('-password')

    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User Registere Successfully'))
  } catch (error) {
    next(error)
  }
})

export const login = asyncHandler(async (req, res, next) => {
  try {
    const { role, email, password } = req.body
    if (!role || !email || !password) {
      return next(new ErrorHandler('All Fields Required', 400))
    }

    const user_match = await User.findOne({ email })
    if (!user_match) {
      return next(new ErrorHandler('User Not Register', 404))
    }

    const password_match = await user_match.isPasswordCorrect(password)
    if (!password_match) {
      return next(new ErrorHandler('Invalid Credentials', 400))
    }
    if (user_match.role !== role) {
      return next(new ErrorHandler('UnAuthorised Access', 400))
    }
    const user = await User.findById(user_match._id).select('-password')
    sendToken(user, 200, res, 'Login Successfully')
  } catch (error) {
    next(error)
  }
})

export const logout = asyncHandler(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .clearCookie('token', options)
    .json(new ApiResponse(200, {}, 'Logout Successfully'))
})

export const getUser = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user

    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User Data fetched Successfully'))
  } catch (error) {
    next(error)
  }
})

export const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user
    const {
      name,
      email,
      phone,
      address,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body

    if (
      [name, email, phone, address, firstNiche, secondNiche, thirdNiche].some(
        (field) => field?.trim() === '',
      )
    ) {
      return next(new ErrorHandler('All Filds are required', 400))
    }

    if (
      user.role === 'Job Seeker' &&
      (!firstNiche || !secondNiche || !thirdNiche)
    ) {
      return next(new ErrorHandler('Please  Provide All your niches', 400))
    }

    const userData = {
      name,
      email,
      phone,
      address,

      coverLetter,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
    }
    if (req.file && req.file?.path) {
      try {
        const current_resume = user.resume.public_id
        if (current_resume) {
          await cloudinary.uploader.destroy(current_resume)
        }
        const resume_local_path = req.file?.path

        const resume = await uploadOnCloudinary(resume_local_path)

        if (!resume || !resume?.url) {
          return next(new ErrorHandler('Error In Resume Uploading', 500))
        }
        userData.resume = {
          public_id: resume.public_id,
          url: resume.url,
        }
      } catch (error) {
        return next(new ErrorHandler('Failed to upload resume', 500))
      }
    }
    const updated_user = await User.findByIdAndUpdate(user._id, userData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }).select('-password')
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: updated_user },
          'User Data updated Successfully',
        ),
      )
  } catch (error) {
    next(error)
  }
})
export const updatePassword = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user

    const { password, newPassword, confirmPassword } = req.body

    if (!password || !newPassword || !confirmPassword) {
      return next(new ErrorHandler('All Filds are required', 400))
    }
    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler('New PPassword & Confirm Password Not Match', 400),
      )
    }

    const user_exits = await User.findById(user._id)

    const password_match = user_exits.isPasswordCorrect(password)
    if (!password_match) {
      return next(new ErrorHandler('Invalid user credentails', 400))
    }
    user_exits.password = newPassword
    await user_exits.save()
    const user_new = await User.findById(user._id).select('-password')

    sendToken(user_new, 200, res, 'Password updated Successfully')
    return res
  } catch (error) {
    next(error)
  }
})
