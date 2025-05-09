/* import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url' */
import { RecipeModel } from '../models/RecipeModel.js'
import dotenv from 'dotenv'
dotenv.config()
/**
 * Encapsulates a controller.
 */
export class RecipeController {
  /**
   * Creates a new recipe document and saves it to the database.
   *
   * @param {object} recipe - The recipe object containing details like title, image, and instructions.
   * @param {Array<object>} formattedIngredients - An array of ingredient objects with name, amount, and unit.
   * @param {Array<object>} savedRecipes - An array to store the saved recipes.
   * @returns {Promise<Array<object>>} A promise that resolves to the updated array of saved recipes.
   */
  async createRecipe (recipe, formattedIngredients, savedRecipes) {
    console.time('Recipe Creater')

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
    console.timeEnd('Recipe Creater')
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
      console.time('Fetch & searching for ID')
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
          console.timeEnd('Fetch & searching for ID')
          console.log('FETCH', recipe.title)
          /* console.log('TYPE', recipe.dishTypes) */
          this.createRecipe(recipe, formattedIngredients, savedRecipes)
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
      /* const mealLunch = req.body.mealLunch */
      const cuisine = req.body.cuisine
      const timeToCook = req.body.timeToCook || ''
      /* const servings = req.body.servings */
      const foodChoice = req.body.dishTypes
      console.log(req.body)
      console.log('choice', foodChoice)
      /*       console.log('cooktime', timeToCook)
      if (mealLunch) {
        console.log('TEST')
        dishTypes.add('Lunch')
        console.log(dishTypes)
      }
      if (req.body.mealDinner) {
        dishTypes.add('Dinner')
        console.log(dishTypes)
      } */
      let recipes = []
      await this.getReq(recipeAmnt)
      /*       const nisse = await RecipeModel.find({ dishTypes: 'dinner' })
      console.log('Find dinner recipe', nisse) */
      // Use ternery operator to shorten remove if statement

      const query = allergies ? { [allergies]: true } : {}
      const getCuisine = cuisine ? { cuisines: cuisine } : {}
      const getCookTime = timeToCook ? { readyInMinutes: { $lte: parseInt(timeToCook) } } : {}
      const food = foodChoice?.length ? { dishTypes: { $in: foodChoice } } : {}
      console.log('food', food)
      console.log('query', query)
      const specific = await RecipeModel.aggregate([
        { $match: query },
        { $match: getCuisine },
        { $match: getCookTime },
        { $match: food },
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
