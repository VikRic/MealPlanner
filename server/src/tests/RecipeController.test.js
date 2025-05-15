import { jest } from '@jest/globals'

// Mocks (fakes) connection to mongoDB
jest.unstable_mockModule('../models/RecipeModel.js', () => ({
  RecipeModel: jest.fn()
}))

// Mock fetch globally
global.fetch = jest.fn()
// Remove method console logs
console.log = jest.fn()

const { RecipeController } = await import('../controllers/RecipeController.js')
const { RecipeModel } = await import('../models/RecipeModel.js')

let controller

beforeEach(() => {
  controller = new RecipeController()
})

afterEach(() => {
  fetch.mockClear()
})

// ───────────────────────────────────────────────────────────
// 🧪 TESTS FOR createRecipe
// ───────────────────────────────────────────────────────────

// CreateRecipe method
describe('RecipeController.createRecipe', () => {
  it('should create and save a new recipe and return updated savedRecipes array', async () => {
    const dummyRecipe = {
      spoonacularId: 123,
      title: 'Test Recipe',
      image: 'image.jpg',
      readyInMinutes: 30,
      servings: 2,
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

    expect(mockSave).toHaveBeenCalled()
    expect(result.length).toBe(1)
    expect(result[0].title).toBe('Test Recipe')
  })
})

// ───────────────────────────────────────────────────────────
// 🧪 TESTS FOR fetchRecipesFromAPI
// ───────────────────────────────────────────────────────────

describe('RecipeController.fetchRecipesFromAPI', () => {
  it('returns data on sucess', async () => {
    const mockRecipes = [{ id: 1, title: 'Spaghetti' }]
    fetch.mockResolvedValueOnce({
      ok: true,
      /**
       * Mock implementation of the JSON response from the fetch API.
       *
       * @returns {Promise<{recipes: Array<{id: number, title: string}>}>} A promise resolving to an object containing an array of recipes.
       */
      json: async () => mockRecipes
    })

    const result = await controller.fetchRecipesFromAPI(1)

    expect(result).toEqual(mockRecipes.recipes)
  })

  it('returns null when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    })

    const result = await controller.fetchRecipesFromAPI(1)

    expect(result).toBeNull()
  })
})

// ───────────────────────────────────────────────────────────
// 🧪 TESTS FOR buildQuery
// ───────────────────────────────────────────────────────────

describe('RecipeController.buildQuery', () => {
  it('returns a query for using in mongoDB', () => {
    const result = controller.buildQuery(1, 'dairyFree', 'Asian', 30, ['breakfast'])

    const expectedQuery = [
      { $match: { dairyFree: true } },
      { $match: { cuisines: 'Asian' } },
      { $match: { readyInMinutes: { $lte: 30 } } },
      { $match: { dishTypes: { $in: ['breakfast'] } } },
      { $sample: { size: 1 } }
    ]

    expect(result).toEqual(expectedQuery)
  })

  it('returns a query with some parameters', () => {
    const result = controller.buildQuery(1, '', 'Chinese', '', ['Breakfast'])

    const expectedQuery = [
      { $match: { } },
      { $match: { cuisines: 'Chinese' } },
      { $match: { } },
      { $match: { dishTypes: { $in: ['Breakfast'] } } },
      { $sample: { size: 1 } }
    ]

    expect(result).toEqual(expectedQuery)
  })

  it('returns a query with empty parameters', () => {
    const result = controller.buildQuery(1, '', '', '', [])

    const expectedQuery = [
      { $match: { } },
      { $match: { } },
      { $match: { } },
      { $match: {} },
      { $sample: { size: 1 } }
    ]

    expect(result).toEqual(expectedQuery)
  })
})

describe('RecipeController.formatIngredients', () => {
  it('returns data on sucess', async () => {
    const input = [
      { name: 'sugar', measures: { metric: { amount: 250.0, unitShort: 'g' } } }
    ]
    const result = await controller.formatIngredients(input)

    expect(result).toEqual([{ amount: 250, name: 'sugar', unit: 'g' }])
  })
  it('returns null when empty input on sucess', async () => {
    const input = [
      { name: 'sugar', measures: { unitShort: '' } }
    ]
    const result = await controller.formatIngredients(input)

    expect(result).toEqual([])
  })
})
