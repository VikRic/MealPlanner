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
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Tuesday: {
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Wednesday: {
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Thursday: {
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Friday: {
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Saturday: {
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    },
    Sunday: {
      lunch: [{ recipeId: String }],
      dinner: [{ recipeId: String }]
    }
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const UserModel = mongoose.model('User', schema)
