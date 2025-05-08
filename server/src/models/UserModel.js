import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  // Clerk User ID
  userId: {
    type: String,
    required: true,
    unique: true
  },
  mealPlan: {
    Monday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Tuesday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Wednesday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Thursday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Friday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Saturday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Sunday: {
      breakfast: [{ recipeId: String }],
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    }
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const UserModel = mongoose.model('User', schema)
