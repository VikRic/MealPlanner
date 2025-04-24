import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RecipeModel } from '../models/recipeModel.js'

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
  index(req, res) {
    const directoryFullName = dirname(fileURLToPath(import.meta.url))
    res.sendFile(
      join(directoryFullName, '..', '..', '..', 'client', 'build', 'index.html')
    )
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
      const budget = req.body.budget
      const servings = req.body.servings

      console.log('Received Data:', recipeAmnt, allergies)
      const response = await fetch(
        `${process.env.SPOONACULAR_BASE_API}/random?type=main%20course&apiKey=${process.env.SPOONACULAR_APIKEY}&number=${recipeAmnt}`,
        {
          method: 'GET'
        }
      )

      if (!response.ok) {
        console.log(response)
      }
      const savedRecipes = []
      const data = await response.json()
      const query = {}
      query[allergies] = true
      console.log('TYPE', typeof allergies)
      console.log('value', allergies)
      if (allergies) {
        const specific = await RecipeModel.aggregate([
          { $match: query },
          { $sample: { size: parseInt(recipeAmnt) } }
        ])
        console.log('-----------------------------------------', specific)
      }
      if (!allergies) {
        const specific = await RecipeModel.aggregate([
          { $sample: { size: parseInt(recipeAmnt) } }
        ])

        console.log('-----------------------------------------', specific)
      }

      for (const recipe of data.recipes) {
        const exists = await RecipeModel.findOne({ spoonacularId: recipe.id })
        console.log('Exists', exists)
        if (!exists) {
          const formattedIngredients = recipe.extendedIngredients.map(
            (ing) => ({
              name: ing.name,
              amount: Math.round(ing.measures.metric.amount * 4) / 4,
              unit: ing.measures.metric.unitShort
            })
          )
          console.log(data)
          console.log('cuis', recipe.cuisines)

          console.log('diets', recipe.diets)

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
        } else {
          // Add so it can be sent to my frontend (for now)
          savedRecipes.push(exists)
        }
      }
      /* console.log(data) */
      /*       console.log('DishTypes')
      for (const type of data.recipes[0].dishTypes) {
        console.log(type)
      }
      console.log('Cuisines')
      for (const type of data.recipes[0].cuisines) {
        console.log(type)
      }
      console.log('Diets')
      for (const type of data.recipes[0].diets) {
        console.log(type)
      } */

      /*       console.log('Title', data.recipes[0].title)
      console.log('image', data.recipes[0].image)
      console.log('Ready in', data.recipes[0].readyInMinutes)
      console.log('servings', data.recipes[0].servings)
      console.log('vegan', data.recipes[0].vegan)
      console.log('glutenFree', data.recipes[0].glutenFree)
      console.log('instructions')
      console.log(data.recipes[0].instructions)
      data.recipes[0].extendedIngredients.forEach((ingredient) => {
        const metric = ingredient.measures.metric
        console.log(
          `METRIC: ${ingredient.name}:${Math.round(metric.amount * 4) / 4} ${
            metric.unitShort
          }`
        )
      }) */
      return res.status(200).json({
        success: true,
        recipes: savedRecipes
      })
    } catch (error) {
      console.error('Error fetching recipe:', error)
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' })
    }
  }
}
