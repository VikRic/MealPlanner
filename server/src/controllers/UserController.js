import { UserModel } from '../models/UserModel.js'
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
   * @param {string} req.body.day - The day to add the recipe to.
   * @param {string} req.body.mealType - The meal type (e.g., breakfast, lunch, dinner).
   * @param {string} req.body.recipeId - The ID of the recipe to add.
   * @param {object} res - The response object used to send the HTTP response.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async adder (req, res) {
    const { userId } = getAuth(req)
    if (!userId) {
      return res.status(401).json({ error: 'Ej inloggad' })
    }

    const { day, mealType, recipeId } = req.body

    // Exempel: uppdatera MongoDB med userId + måltidsdata
    const existing = await UserModel.findOne({ userId })
    console.log('BOB')
    if (!existing) {
      await UserModel.create({
        userId,
        mealPlan: {
          [day]: {
            [mealType]: [{ recipeId }]
          }
        }
      })
    } else {
      console.log(day)
      console.log(mealType)
      console.log(recipeId)
      const test = await UserModel.updateOne(
        { userId },
        {
          $push: { [`mealPlan.${day}.${mealType}`]: { recipeId } }
        }
      )
      console.log(test)
    }

    res.status(200).send('Added to plan')
  }
}
