import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RecipeModel } from '../models/RecipeModel.js'
import dotenv from 'dotenv'
dotenv.config()
/**
 * Encapsulates a controller.
 */
export class RecipeController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  /*   index(req, res) {
    const directoryFullName = dirname(fileURLToPath(import.meta.url))
    res.sendFile(
      join(directoryFullName, '..', '..', '..', 'client', 'build', 'index.html')
    )
  } */

  /**
   * Creates a new recipe document and saves it to the database.
   *
   * @param {object} recipe - The recipe object containing details like title, image, and instructions.
   * @param {Array<object>} formattedIngredients - An array of ingredient objects with name, amount, and unit.
   * @param {Array<object>} savedRecipes - An array to store the saved recipes.
   * @returns {Promise<Array<object>>} A promise that resolves to the updated array of saved recipes.
   */
  async createRecipe (recipe, formattedIngredients, savedRecipes) {
    const newRecipe = new RecipeModel({
      spoonacularId: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      vegan: recipe.vegan,
      glutenFree: recipe.glutenFree,
      dairyFree: recipe.dairyFree,
      vegetarian: recipe.vegetarian,
      dishTypes: recipe.dishTypes,
      diets: recipe.diets,
      cuisines: recipe.cuisines,
      ingredients: formattedIngredients,
      instructions: recipe.instructions,
      source: 'spoonacular'
    })

    await newRecipe.save()
    savedRecipes.push(newRecipe)
    return savedRecipes
  }

  /**
   * Fetches a specified number of random recipes from the Spoonacular API and saves them if they do not already exist in the database.
   *
   * @param {number} amnt - The number of recipes to fetch.
   * @returns {Promise<Array>} A promise that resolves to an array of saved recipes.
   */
  async getReq (amnt) {
    const savedRecipes = []
    try {
      const response = await fetch(
        `${process.env.SPOONACULAR_BASE_API}/random?type=main%20course&apiKey=${process.env.SPOONACULAR_APIKEY}&number=${amnt}`,
        {
          method: 'GET'
        }
      )

      if (!response.ok) {
        console.log('Fetch failed', response.statusText)
        return savedRecipes
      }

      const data = await response.json()

      for (const recipe of data.recipes) {
        const exists = await RecipeModel.findOne({ spoonacularId: recipe.id })
        if (!exists) {
          const formattedIngredients = recipe.extendedIngredients.map(
            (ing) => ({
              name: ing.name,
              amount: Math.round(ing.measures.metric.amount * 4) / 4,
              unit: ing.measures.metric.unitShort
            })
          )
          console.log('FETCH', recipe.title)
          console.time('this.createRecipe')
          this.createRecipe(recipe, formattedIngredients, savedRecipes)
          console.timeEnd('this.createRecipe')
        }
      }
    } catch (error) {
      console.error('Error during getReq:', error)
    }

    return savedRecipes
  }

  /**
   * Handles a POST request from the frontend to fetch recipes based on user preferences.
   *
   * @param {object} req - Express request object containing user preferences in the body.
   * @param {object} res - Express response object used to send back the response.
   * @returns {Promise<void>} A promise that resolves when the response is sent.
   */
  async frontEndPost (req, res) {
    try {
      const recipeAmnt = req.body.recipeAmnt
      const allergies = req.body.allergies
      const cuisine = req.body.cuisine
      const timeToCook = req.body.timeToCook || ''
      const servings = req.body.servings

      console.log(servings)
      console.log('cooktime', timeToCook)

      if (req.body.mealLunch) {
        console.log('Lunch On')
      }

      if (req.body.mealDinner) {
        console.log('Dinner On')
      }

      let recipes = []

      await this.getReq(recipeAmnt)

      // Use ternery operator to shorten remove if statement
      const query = allergies ? { [allergies]: true } : {}
      const getCuisine = cuisine ? { cuisines: cuisine } : {}
      const getCookTime = timeToCook ? { readyInMinutes: { $lte: parseInt(timeToCook) } } : {}
      const specific = await RecipeModel.aggregate([
        { $match: query },
        { $match: getCuisine },
        { $match: getCookTime },
        { $sample: { size: parseInt(recipeAmnt) } }
      ])

      console.log(
        '----------------------------------------- SPECIFIC',
        specific[0].title
      )
      recipes = specific

      return res.status(200).json({
        success: true,
        recipes
      })
    } catch (error) {
      console.error('Error fetching recipe:', error)
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' })
    }
  }
}
