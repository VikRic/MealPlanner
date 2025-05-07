import express from 'express'
import session from 'express-session'
import { join } from 'node:path'
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { clientBuildPath } from './config/pathConfig.js'
import cors from 'cors'
import { connectToDatabase } from './config/mongoose.js'
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'
import { securityHeaders, limiter } from './middleWare/security.js'

try {
  dotenv.config()
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  // Create Express application.
  const app = express()
  app.use(cors({ origin: 'http://localhost:3000' }))
  app.use(securityHeaders)
  app.use(limiter)
  app.use(express.json())
  app.use(clerkMiddleware())

  // Set up middleware
  app.use(logger('dev'))
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(clientBuildPath))

  // Set up sessions
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
  }
  app.use(session(sessionOptions))

  // Register routes
  app.use('/api', router)

  // Catch-all route for React
  app.get('*', (req, res) => {
    res.sendFile(join(clientBuildPath, 'index.html'))
  })

  // Error handler
  /*   app.use(errorHandler) */

  // Start server
  const PORT = process.env.PORT || 5000
  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
