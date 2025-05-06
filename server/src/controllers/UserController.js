import { UserModel } from '../models/UserModel.js'
import dotenv from 'dotenv'
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
dotenv.config()
/**
 * Encapsulates a controller.
 */
export class UserController {
  /**
   *
   * @param req
   * @param res
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
