import dotenv from 'dotenv'
import { app } from './app.js'
import connectDb from './db/index.js'
import { errorMiddleware } from './middlewarw/error.middleware.js'
import { newsLetterCron } from './automation/newsLetterCron.js'

dotenv.config({
  path: './.env',
})

newsLetterCron()
connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server start at port ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log(`MONGOODB ERROR ${err}`)
  })

app.use(errorMiddleware)
