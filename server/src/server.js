import express from 'express'
import session from 'express-session'
import logger from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import { join } from 'node:path'
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'
import { clientBuildPath } from './config/pathConfig.js'
import { connectToDatabase } from './config/mongoose.js'
import { clerkMiddleware } from '@clerk/express'
import { securityHeaders, limiter } from './middleWare/security.js'

try {
  dotenv.config()
  // Connect to MongoDB.
  await connectToDatabase(process.env.DB_CONNECTION_STRING)
  await import('./util/cron.js')

  // Create Express application.
  const app = express()
  app.use(clerkMiddleware())
  app.use(cors({
    origin: ['http://localhost:3000', 'https://rickardssons.se'],
    credentials: true
  }))
  app.use(securityHeaders)
  app.use(limiter)
  app.use(express.json())

  // Set up middleware
  app.use(logger('dev'))
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(clientBuildPath))

  // Set up sessions
  console.log(process.env.NODE_ENV)
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

  // Start server
  const PORT = process.env.PORT || 8080
  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
