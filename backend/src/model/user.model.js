import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [10, 'Phone number must be 10 digits'],
      maxlength: [10, 'Phone number must be 10 digits'],
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must contains at least 6 characters'],
    },
    niches: {
      firstNiche: String,
      secondNiche: String,
      thirdNiche: String,
    },
    resume: {
      public_id: String,
      url: String,
    },
    coverLetter: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ['Job Seeker', 'Employer'],
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESSTOKEN_SECRET,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRY,
    },
  )
}
const User = mongoose.model('User', userSchema)

export default User
