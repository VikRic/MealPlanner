import { getAuth } from '@clerk/express'

/**
 * Middleware to ensure the user is authenticated before proceeding.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void} Sends a 401 response if not authenticated, otherwise calls next().
 */
export function requireAuth (req, res, next) {
  const { userId } = getAuth(req)

  console.log('AUTH HEADER:', req.headers.authorization)
  console.log('USERID: ', userId)

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' })
  }
  console.log(userId)

  req.userId = userId
  next()
}
