import { asyncHandler } from '../middlewarw/asyncHandler.middleware.js'
import {
  ErrorHandler,
  errorMiddleware,
} from '../middlewarw/error.middleware.js'
import User from '../model/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { sendToken } from '../utils/jwtToken.js'
import Job from '../model/job.model.js'

export const postJob = asyncHandler(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body
  console.log(req.body)
  // Check for required fields
  if (
    [title, jobType, responsibilities, qualifications, salary, jobNiche].some(
      (field) => field?.trim() === '',
    )
  ) {
    return next(new ErrorHandler('All Fields are required', 400))
  }

  // Check for personal website fields consistency
  if (
    (!personalWebsiteTitle && personalWebsiteUrl) ||
    (personalWebsiteTitle && !personalWebsiteUrl)
  ) {
    return next(
      new ErrorHandler('Must Provide Both Personal Website Title & URL', 400),
    )
  }

  const postedBy = req.user._id

  try {
    const job = await Job.create({
      title,
      jobType,
      location: location || '',
      companyName: companyName || '',
      introduction: introduction || '',
      responsibilities,
      qualifications,
      offers: offers || '',
      salary,
      hiringMultipleCandidates,
      personalWebsite: {
        title: personalWebsiteTitle,
        url: personalWebsiteUrl,
      },
      jobNiche,
      postedBy,
    })

    res.status(201).json(new ApiResponse(200, job, 'Job Posted Succcessfully'))
  } catch (error) {
    next()
  }
})

export const getAllJob = asyncHandler(async (req, res, next) => {
  try {
    const { city, niche, searchKeyword } = req.query

    const query = {}
    if (city) {
      query.location = city
    }
    if (niche) {
      query.jobNiche = niche
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: 'i' } },
        { companyName: { $regex: searchKeyword, $options: 'i' } },
        { introduction: { $regex: searchKeyword, $options: 'i' } },
      ]
    }

    const jobs = await Job.find(query)
    if (!jobs) {
      return next(new ErrorHandler('No Job Found', 404))
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { jobs, count: jobs.length }, 'All Job Fetchhed'),
      )
  } catch (error) {
    next(error)
  }
})
export const getSingleJob = asyncHandler(async (req, res, next) => {
  try {
    const jobid = req.params.id
    const myjob = await Job.findById(jobid)
    if (!myjob) {
      return next(new ErrorHandler('No Job Found', 404))
    }
    return res.status(200).json(new ApiResponse(200, myjob, 'Job Fetchhed'))
  } catch (error) {
    next(error)
  }
})

export const getMyJobs = asyncHandler(async (req, res, next) => {
  try {
    const myjob = await Job.find({ postedBy: req.user._id })
    if (!myjob || myjob.length === 0) {
      return next(new ErrorHandler('No Job Found', 404))
    }
    return res
      .status(200)
      .json(new ApiResponse(200, myjob, 'All Your Job Fetchhed'))
  } catch (error) {
    next(error)
  }
})
export const deleteJob = asyncHandler(async (req, res, next) => {
  try {
    const jobid = req.params.id
    const job = await Job.findById(jobid)
    if (!job) {
      return next(new ErrorHandler('Job Not Found', 404))
    }
    await Job.findByIdAndDelete(jobid)
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Job Deleted Successfully'))
  } catch (error) {
    next(error)
  }
})
