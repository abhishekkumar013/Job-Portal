import mongoose from 'mongoose'
import { asyncHandler } from '../middlewarw/asyncHandler.middleware.js'
import { ErrorHandler } from '../middlewarw/error.middleware.js'
import Application from '../model/application.model.js'
import Job from '../model/job.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const postApplication = asyncHandler(async (req, res, next) => {
  try {
    const JobId = req.params.id
    const userId = req.user._id.toString()

    const job = await Job.findById(JobId)

    if (!job) {
      return next(new ErrorHandler('No Job Found', 404))
    }

    const existing_application = await Application.findOne({
      JobId: JobId,
      jobSeekerId: userId,
    })

    if (existing_application) {
      return next(new ErrorHandler('You have already applied!', 400))
    }

    const employerId = job.postedBy.toString()

    const application = await Application.create({
      jobSeekerId: req.user._id,
      employerId,
      JobId,
    })

    res
      .status(201)
      .json(
        new ApiResponse(200, application, 'Application Posted Successfully'),
      )
  } catch (error) {
    next(error)
  }
})

// export const employerGetAllApplications = asyncHandler(async (req, res, next) => {
//   const { _id: employerId } = req.user

//   // Find all jobs posted by this employer
//   const employerJobs = await Job.find({ postedBy: employerId })

//   if (!employerJobs.length) {
//     return next(new ErrorHandler('No jobs found for this employer', 404))
//   }

//   // Get the IDs of all the employer's jobs
//   const jobIds = employerJobs.map((job) => job._id)

//   // Find all applications for these jobs that are not deleted by the employer
//   const applications = await Application.find({
//     JobId: { $in: jobIds },
//     'deletedBy.employer': false  // Add this condition
//   })
//     .populate({
//       path: 'jobSeekerId',
//       select: 'name email phone address niches resume coverLetter',
//     })
//     .populate({
//       path: 'JobId',
//       select: 'title companyName jobType location',
//     })

//   if (!applications.length) {
//     return next(new ErrorHandler('No applications found for your jobs', 404))
//   }

//   // Format the response
//   const formattedApplications = applications.map((app) => ({
//     applicationId: app._id,
//     jobSeeker: app.jobSeekerId,
//     job: app.JobId,
//     appliedAt: app.createdAt,
//   }))

//   res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         formattedApplications,
//         'Applications retrieved successfully',
//       ),
//     )
// })

export const employerGetAllApplications = asyncHandler(
  async (req, res, next) => {
    try {
      const { _id: employerId } = req.user

      const applications = await Application.aggregate([
        // Stage 1: Match applications that are not deleted by the employer
        {
          $match: {
            'deletedBy.employer': false,
          },
        },

        // Stage 2: Lookup job details
        {
          $lookup: {
            from: 'jobs',
            localField: 'JobId',
            foreignField: '_id',
            as: 'job',
          },
        },
        { $unwind: '$job' },

        // Stage 3: Match applications for jobs posted by this employer
        {
          $match: {
            'job.postedBy': new mongoose.Types.ObjectId(employerId),
          },
        },

        // Stage 4: Lookup job seeker details
        {
          $lookup: {
            from: 'users',
            localField: 'jobSeekerId',
            foreignField: '_id',
            as: 'jobSeeker',
          },
        },
        { $unwind: '$jobSeeker' },

        // Stage 5: Project the fields we want
        {
          $project: {
            _id: 1,
            appliedAt: '$createdAt',
            'job._id': 1,
            'job.title': 1,
            'job.companyName': 1,
            'job.jobType': 1,
            'job.location': 1,
            'jobSeeker._id': 1,
            'jobSeeker.name': 1,
            'jobSeeker.email': 1,
            'jobSeeker.phone': 1,
            'jobSeeker.address': 1,
            'jobSeeker.niches': 1,
            'jobSeeker.resume': 1,
            'jobSeeker.coverLetter': 1,
          },
        },

        // Stage 6: Sort by application date (most recent first)
        { $sort: { appliedAt: -1 } },
      ])

      if (!applications.length) {
        return next(
          new ErrorHandler('No applications found for your jobs', 404),
        )
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { applications, count: applications.length },
            'Applications retrieved successfully',
          ),
        )
    } catch (error) {
      next(error)
    }
  },
)

export const jobSeekerGetAllApplications = asyncHandler(
  async (req, res, next) => {
    const { _id: jobSeekerId } = req.user

    const applications = await Application.aggregate([
      // Stage 1: Match applications for this job seeker that are not deleted by the job seeker
      {
        $match: {
          jobSeekerId: new mongoose.Types.ObjectId(jobSeekerId),
          'deletedBy.jobSeeker': false,
        },
      },

      // Stage 2: Lookup job details
      {
        $lookup: {
          from: 'jobs',
          localField: 'JobId',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },

      // Stage 3: Lookup employer details
      {
        $lookup: {
          from: 'users',
          localField: 'employerId',
          foreignField: '_id',
          as: 'employer',
        },
      },
      { $unwind: '$employer' },

      // New Stage: Lookup job seeker details
      {
        $lookup: {
          from: 'users',
          localField: 'jobSeekerId',
          foreignField: '_id',
          as: 'jobSeeker',
        },
      },
      { $unwind: '$jobSeeker' },

      // Stage 4: Project the fields we want (including job seeker details)
      {
        $project: {
          _id: 1,
          appliedAt: '$createdAt',
          'job._id': 1,
          'job.title': 1,
          'job.companyName': 1,
          'job.jobType': 1,
          'job.location': 1,
          'job.salary': 1,
          'employer._id': 1,
          'employer.name': 1,
          'employer.email': 1,
          'employer.phone': 1,
          'employer.address': 1,
          'jobSeeker._id': 1,
          'jobSeeker.name': 1,
          'jobSeeker.email': 1,
          'jobSeeker.phone': 1,
          'jobSeeker.address': 1,
          'jobSeeker.niches': 1,
          'jobSeeker.resume.url': 1,
          'jobSeeker.coverLetter': 1,
        },
      },

      // Stage 5: Sort by application date (most recent first)
      { $sort: { appliedAt: -1 } },
    ])

    if (!applications.length) {
      return next(new ErrorHandler('No applications found', 404))
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { applications, count: applications.length },
          'Applications retrieved successfully',
        ),
      )
  },
)

export const deleteApplication = asyncHandler(async (req, res, next) => {
  try {
    const { role } = req.user
    const { id } = req.params
    const application = await Application.findById(id)
    if (!application) {
      return next(new ErrorHandler('Application not found!', 404))
    }

    switch (role) {
      case 'Job Seeker':
        application.deletedBy.jobSeeker = true
        await application.save()
        break
      case 'Employer':
        application.deletedBy.employer = true
        await application.save()
        break
      default:
        break
    }

    if (
      application.deletedBy.employer === true &&
      application.deletedBy.jobSeeker === true
    ) {
      await application.deleteOne()
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Applications deleted successfully'))
  } catch (error) {
    next(error)
  }
})
