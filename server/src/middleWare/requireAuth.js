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
  console.log('Full auth object:', getAuth(req))
  console.log('Headers:', req.headers)
  const { userId } = getAuth(req)

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' })
  }

  req.userId = userId
  next()
}
