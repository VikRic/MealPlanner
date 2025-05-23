import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  recipeId: {
    type: String,
    required: true
  },
  servings: {
    type: Number
  }
}, { _id: false }) // _id is not needed

// Main schema for user
const UserMealPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  mealPlan: [schema]
})
UserMealPlanSchema.add(BASE_SCHEMA)

export const UserModel = mongoose.model('User', UserMealPlanSchema)
