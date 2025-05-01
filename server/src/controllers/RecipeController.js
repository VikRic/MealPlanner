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
   *
   * @param recipe
   * @param formattedIngredients
   * @param savedRecipes
   */
  async createRecipe(recipe, formattedIngredients, savedRecipes) {
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
   *
   * @param amnt
   * @param savedRecipes
   */
  async getReq(amnt) {
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
   *
   * @param req
   * @param res
   */
  async frontEndPost(req, res) {
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
