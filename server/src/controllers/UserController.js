import { UserModel } from '../models/UserModel.js'
import { RecipeModel } from '../models/RecipeModel.js'
import { validateRecipeRequest } from '../util/helpfunctions.js'
import dotenv from 'dotenv'
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
  async createRecipe (req, res) {
    try {
      const userId = req.userId

      const validation = validateRecipeRequest(req.body)
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error })
      }
      const { dateObj, mealType, recipeId, date } = validation

      // Get servings from request, default to 1 if not provided
      const servings = req.body.servings || 1

      // Check if the recipe exists
      const recipeExists = await RecipeModel.exists({ spoonacularId: Number(recipeId) })
      if (!recipeExists) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      // Find user or create if doesn't exist
      const user = await UserModel.findOne({ userId })
      const newMeal = { date: dateObj, mealType, recipeId, servings }

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
          user.mealPlan[existingMealIndex].servings = servings
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
      const userId = req.userId

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

        if (recipe) {
          const recipeData = recipe.toJSON()
          recipeData.userServings = entry.servings || recipe.servings
          mealPlanMap[dateKey][mealType] = recipeData
        } else {
          mealPlanMap[dateKey][mealType] = {
            spoonacularId: entry.recipeId,
            userServings: entry.servings || 1
          }
        }
      }

      res.status(200).json({ existing: { mealPlan: mealPlanMap } })
    } catch (error) {
      console.error('Error fetching meal plan:', error)
      res.status(500).json({ error: 'Server error while fetching meal plan' })
    }
  }

  /**
   * Deletes a recipe from the user's meal plan for a specific day and meal type.
   *
   * @param {object} req - The request object containing user authentication and body data.
   * @param {object} res - The response object used to send the HTTP response.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async deleteRecipe (req, res) {
    try {
      const servings = req.body.servings
      console.log(servings)
      const userId = req.userId
      const validation = validateRecipeRequest(req.body)
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error })
      }
      const { dateObj, mealType, recipeId } = validation

      // Find user or create if doesn't exist
      const meal = { date: dateObj, mealType, recipeId, servings }
      const recipe = await UserModel.findOne({ userId, mealPlan: meal })
      if (recipe) {
        await UserModel.updateOne(
          { userId },
          {
            $pull: {
              mealPlan: {
                date: dateObj,
                mealType,
                recipeId,
                servings
              }
            }
          }
        )
        console.log('Deleted')
      }

      res.status(200).json({ message: 'Recipe deleted from meal plan' })
    } catch (error) {
      console.error('Error deleting meal plan:', error)
      res.status(500).json({ error: 'Server error while deleting meal plan' })
    }
  }
}
