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
   * Fetches a specified number of random recipes from the Spoonacular API.
   *
   * @param {number} amount - The number of recipes to fetch.
   * @returns {Promise<Array<object>>} A promise that resolves to an array of recipe objects.
   */
  async fetchRecipesFromAPI (amount) {
    const response = await fetch(
        `${process.env.SPOONACULAR_BASE_API}/random?type=main%20course&apiKey=${process.env.SPOONACULAR_APIKEY}&number=${amount}`,
        {
          method: 'GET'
        }
    )
    if (!response.ok) {
      console.log('Fetch failed', response.statusText)
      return null
    }
    const data = await response.json()
    /*     console.log('test', data) */
    return data.recipes
  }

  /**
   * Formats the ingredients by rounding their amounts and extracting relevant details.
   *
   * @param {Array<object>} ingredients - An array of ingredient objects containing name, measures, and other details.
   * @returns {Array<object>} An array of formatted ingredient objects with name, amount, and unit.
   */
  formatIngredients (ingredients) {
    return ingredients
      .map(ing => {
        if (
          ing?.name &&
          ing?.measures?.metric?.amount != null &&
          ing?.measures?.metric?.unitShort
        ) {
          return {
            name: ing.name,
            amount: Math.round(ing.measures.metric.amount * 4) / 4,
            unit: ing.measures.metric.unitShort
          }
        } else {
          return null
        }
      })
      .filter(Boolean) // Removes null values
  }

  /**
   * Processes a recipe by checking if it exists in the database and saves it if it does not.
   *
   * @param {object} recipe - The recipe object containing details like title, ingredients, and instructions.
   * @param {Array<object>} savedRecipes - An array to store the saved recipes.
   */
  async processAndSaveRecipes (recipe, savedRecipes) {
    const exists = await RecipeModel.findOne({ spoonacularId: recipe.id })
    if (!exists) {
      const formattedIngredients = this.formatIngredients(recipe.extendedIngredients)
      console.log('new recipe', recipe.title)
      await this.createRecipe(recipe, formattedIngredients, savedRecipes)
    }
  }

  /**
   * Fetches a specified number of random recipes from the Spoonacular API and saves them if they do not already exist in the database.
   *
   * @param {number} amount - The number of recipes to fetch.
   * @returns {Promise<Array>} A promise that resolves to an array of saved recipes.
   */
  async getReq (amount) {
    const savedRecipes = []
    try {
      const data = await this.fetchRecipesFromAPI(amount)
      for (const recipe of data) {
        await this.processAndSaveRecipes(recipe, savedRecipes)
      }
    } catch (error) {
      console.error('Error during getReq:', error)
    }

    return savedRecipes
  }

  /**
   * Builds a MongoDB aggregation query based on user preferences for recipes.
   *
   * @param {number} recipeAmnt - The number of recipes to fetch.
   * @param {string} [allergies] - The allergy filter (e.g., "glutenFree", "dairyFree").
   * @param {string} [cuisine] - The preferred cuisine type (e.g., "Italian", "Mexican").
   * @param {number} [timeToCook] - The maximum cooking time in minutes.
   * @param {Array<string>} [dishTypes] - An array of dish types (e.g., ["main course", "dessert"]).
   * @param {string|Array<string>} ingredientSearch - The ingredient or list of ingredients to search for in recipes.
   * @returns {Array<object>} The MongoDB aggregation query array.
   */
  buildQuery (recipeAmnt, allergies, cuisine, timeToCook, dishTypes, ingredientSearch) {
    const query = []

    // Capitalize cuisine if it exists
    const formattedCuisine = cuisine
      ? cuisine.charAt(0).toUpperCase() + cuisine.slice(1)
      : null

    // Time filter direction
    const cookTimeOperator = timeToCook > 60 ? '$gte' : '$lte'

    // Clean up and normalize ingredients
    const normalizedIngredients = (ingredientSearch || [])
      .filter(i => typeof i === 'string' && i.trim() !== '')
      .map(i => i.toLowerCase().trim())

    // Conditionally add filters
    if (allergies) {
      query.push({ $match: { [allergies]: true } })
    }

    if (formattedCuisine) {
      query.push({ $match: { cuisines: formattedCuisine } })
    }

    if (timeToCook) {
      query.push({ $match: { readyInMinutes: { [cookTimeOperator]: parseInt(timeToCook) } } })
    }

    if (dishTypes?.length) {
      query.push({ $match: { dishTypes: { $in: dishTypes } } })
    }

    if (normalizedIngredients.length) {
      query.push({ $match: { 'ingredients.name': { $all: normalizedIngredients } } })
    }

    query.push({ $sample: { size: parseInt(recipeAmnt) } })

    return query
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
      const { recipeAmnt, allergies, cuisine, timeToCook, dishTypes, ingredientSearch } = req.body
      console.log('RecipeAmnt:', recipeAmnt, 'allergies:', allergies, 'cuisine:', cuisine, 'timeToCook:', timeToCook, 'dishTypes:', dishTypes, 'ingredientSearch:', ingredientSearch)
      const query = this.buildQuery(recipeAmnt, allergies, cuisine, timeToCook, dishTypes, ingredientSearch)
      const recipes = await RecipeModel.aggregate([query])

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
