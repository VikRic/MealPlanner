import { getAuth, clerkClient } from '@clerk/express'

/**
 * Middleware to ensure the user is authenticated before proceeding.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void} Sends a 401 response if not authenticated, otherwise calls next().
 */
export async function requireAuth (req, res, next) {
  /* console.log('Full getAuth object:', getAuth(req)) */

  const { userId } = getAuth(req)
  /* const user = await clerkClient.users.getUser(userId) */
  console.log('denna', userId)

  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' })
  }

  req.userId = userId
  next()
}
