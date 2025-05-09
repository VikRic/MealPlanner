import { jest } from '@jest/globals'

// Mocks (fakes) connection to mongoDB
jest.unstable_mockModule('../models/RecipeModel.js', () => ({
  RecipeModel: jest.fn()
}))

const { RecipeController } = await import('../controllers/RecipeController.js')
const { RecipeModel } = await import('../models/RecipeModel.js')

describe('RecipeController.createRecipe', () => {
  it('should create and save a new recipe and return updated savedRecipes array', async () => {
    const controller = new RecipeController()

    // Fake data
    const dummyRecipe = {
      spoonacularId: 123,
      title: 'Test Recipe',
      image: 'image.jpg',
      readyInMinutes: 30,
      servings: 2,
      vegan: true,
      glutenFree: false,
      dairyFree: false,
      vegetarian: false,
      dishTypes: ['dinner'],
      diets: ['vegetarian'],
      cuisines: ['italian'],
      instructions: 'Mix and cook.'
    }

    const formattedIngredients = [
      { name: 'Tomato', amount: 2, unit: 'pcs' },
      { name: 'Cheese', amount: 100, unit: 'g' }
    ]

    const savedRecipes = []

    const mockSave = jest.fn().mockResolvedValue(true)

    // Sets what the faked model should do.
    RecipeModel.mockImplementation(() => ({
      save: mockSave,
      ...dummyRecipe,
      ingredients: formattedIngredients,
      source: 'spoonacular'
    }))

    const result = await controller.createRecipe(
      dummyRecipe,
      formattedIngredients,
      savedRecipes
    )

    expect(RecipeModel).toHaveBeenCalledTimes(1)
    expect(mockSave).toHaveBeenCalled()
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('Test Recipe')
  })
})
