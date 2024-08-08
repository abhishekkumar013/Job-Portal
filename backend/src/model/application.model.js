import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    jobSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    JobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    deletedBy: {
      jobSeeker: {
        type: Boolean,
        default: false,
      },
      employer: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
)

const Application = mongoose.model('Application', applicationSchema)
export default Application
