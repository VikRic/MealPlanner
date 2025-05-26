import { getAuth } from '@clerk/express'
/**
 * Validates the request body for a recipe request.
 *
 * @param {object} body - The request body containing recipe details.
 * @param {string} body.date - The date for the recipe in YYYY-MM-DD format.
 * @param {string} body.mealType - The type of meal (e.g., breakfast, lunch, dinner).
 * @param {string|number} body.recipeId - The ID of the recipe.
 * @returns {{valid: boolean, error?: string, dateObj?: Date, date?: string, mealType?: string, recipeId?: string|number}} Result of validation.
 */
export const validateRecipeRequest = (body) => {
  const { date, mealType, recipeId } = body
  if (!date || !mealType || !recipeId) {
    return { valid: false, error: 'Missing required fields: date, mealType, or recipeId' }
  }

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' }
  }

  return { valid: true, dateObj, date, mealType, recipeId }
}

/**
 * Retrieves the user ID from the request using Clerk authentication.
 *
 * @param {object} req - The Express request object.
 * @returns {string|null} The user ID if authenticated, otherwise null.
 */
export const getUserId = (req) => {
  const { userId } = getAuth(req)
  return userId || null
}
