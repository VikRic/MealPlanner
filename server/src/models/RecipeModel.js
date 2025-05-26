import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  spoonacularId: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  image: String,
  readyInMinutes: Number,
  servings: Number,
  vegan: Boolean,
  glutenFree: Boolean,
  nutFree: Boolean,
  dairyFree: Boolean,
  vegetarian: Boolean,
  ingredients: [
    {
      name: String,
      amount: Number,
      unit: String
    }
  ],
  dishTypes: [String],
  cuisines: [String],
  diets: [String],
  instructions: String,
  source: {
    type: String,
    default: 'spoonacular'
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const RecipeModel = mongoose.model('Recipe', schema)
