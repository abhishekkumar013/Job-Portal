import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)

app.use(cookieParser()) // to save jwt in backend
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

import UserRoutes from './routes/user.routes.js'
import JobRoutes from './routes/job.routes.js'
import ApplicationRoutes from './routes/application.routes.js'

app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/job', JobRoutes)
app.use('/api/v1/application', ApplicationRoutes)
export { app }
