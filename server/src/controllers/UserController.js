import { UserModel } from '../models/UserModel.js'
import { RecipeModel } from '../models/RecipeModel.js'
import dotenv from 'dotenv'
import { getAuth } from '@clerk/express'
dotenv.config()

/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   * Adds a recipe to the user's meal plan for a specific day and meal type.
   *
   * @param {object} req - The request object containing user authentication and body data.
   * @param {object} req.body - The body of the request.
   * @param {string} req.body.date - The date to add the recipe to (YYYY-MM-DD format).
   * @param {string} req.body.mealType - The meal type (e.g., breakfast, lunch, dinner).
   * @param {string} req.body.recipeId - The ID of the recipe to add.
   * @param {object} res - The response object used to send the HTTP response.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async adder (req, res) {
    try {
      const { userId } = getAuth(req)

      if (!userId) {
        return res.status(401).json({ error: 'Not logged in' })
      }

      const { date, mealType, recipeId } = req.body

      // Validate inputs
      if (!date || !mealType || !recipeId) {
        return res.status(400).json({ error: 'Missing required fields: date, mealType, or recipeId' })
      }

      // Ensure date is properly formatted
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' })
      }

      // Check if the recipe exists
      const recipeExists = await RecipeModel.exists({ spoonacularId: Number(recipeId) })
      if (!recipeExists) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      // Find user or create if doesn't exist
      const user = await UserModel.findOne({ userId })
      const newMeal = { date: dateObj, mealType, recipeId }

      if (!user) {
        await UserModel.create({
          userId,
          mealPlan: [newMeal]
        })
      } else {
        // Check if there's already a meal for this date and mealType
        const existingMealIndex = user.mealPlan.findIndex(meal =>
          meal.date.toISOString().split('T')[0] === date &&
          meal.mealType === mealType
        )

        if (existingMealIndex >= 0) {
          // Update existing meal
          user.mealPlan[existingMealIndex].recipeId = recipeId
          await user.save()
        } else {
          // Add new meal
          await UserModel.updateOne(
            { userId },
            { $push: { mealPlan: newMeal } }
          )
        }
      }

      res.status(200).json({ message: 'Recipe added to meal plan' })
    } catch (error) {
      console.error('Error adding to meal plan:', error)
      res.status(500).json({ error: 'Server error while adding to meal plan' })
    }
  }

  /**
   * Retrieves the recipes associated with the user's meal plan.
   *
   * @param {object} req - The request object containing user authentication data.
   * @param {object} res - The response object used to send the HTTP response.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async getRecipes (req, res) {
    try {
      const { userId } = getAuth(req)

      if (!userId) {
        return res.status(401).json({ error: 'Not logged in' })
      }

      const user = await UserModel.findOne({ userId })

      if (!user || !user.mealPlan || user.mealPlan.length === 0) {
        return res.status(200).json({ existing: { mealPlan: {} } })
      }

      const mealPlanMap = {}

      for (const entry of user.mealPlan) {
        const dateKey = entry.date.toISOString().split('T')[0] // YYYY-MM-DD
        const mealType = entry.mealType

        // Find the recipe details
        const recipe = await RecipeModel.findOne({ spoonacularId: Number(entry.recipeId) })

        if (!mealPlanMap[dateKey]) {
          mealPlanMap[dateKey] = {}
        }

        mealPlanMap[dateKey][mealType] = recipe ? recipe.toJSON() : { spoonacularId: entry.recipeId }
      }

      res.status(200).json({ existing: { mealPlan: mealPlanMap } })
    } catch (error) {
      console.error('Error fetching meal plan:', error)
      res.status(500).json({ error: 'Server error while fetching meal plan' })
    }
  }
}
