import { useMealPlan } from '../../../contexts/MealPlanContext'
import { normalizeUnit } from '../../../utils/logic'
import { getDaysInWeek } from '../../../utils/dateUtils'
import './ingredients.css'

const AllIngredients = () => {
  const { mealPlan, currentWeek } = useMealPlan()

const mergedIngredients = {}
const currentWeekDays = getDaysInWeek(currentWeek.start).map(day => day.dateString)

for (const date in mealPlan) {
  if (!currentWeekDays.includes(date)) continue

  for (const mealType in mealPlan[date]) {
    const recipe = mealPlan[date][mealType]
      if (recipe?.ingredients?.length) {

        // Use userServings if available, otherwise fallback to recipe servings or 1
        let userServings = recipe.userServings || recipe.servings || 1
        let originalServings = recipe.servings || 1
        
        if ( originalServings < 1 || userServings < 1) {
          userServings = 1
          originalServings = 1
        }
        const servingsFactor = userServings / originalServings

        for (const ingredient of recipe.ingredients) {
          // Add console.warn after 1 recipe destroyed my site and cant seem to find why.
          const name = ingredient?.name
          if (!name){
            console.warn("Ingredient missing name:", ingredient, "in recipe:", recipe)
            continue
          }

        const normalizedUnit = normalizeUnit(ingredient.unit)
        const key = `${name.toLowerCase()}__${normalizedUnit}`

        const adjustedAmount = ingredient.amount * servingsFactor

        if (mergedIngredients[key]) {
          // Check for unit difference
          if (normalizeUnit(mergedIngredients[key].unit) !== normalizedUnit) {
            console.warn(
              `Unit difference for ${name}: "${mergedIngredients[key].unit}" vs "${ingredient.unit}"`
            )
          }

          mergedIngredients[key].amount += ingredient.amount
        } else {
          mergedIngredients[key] = {
            ...ingredient,
            unit: normalizedUnit,
          amount: adjustedAmount}
        }
      }
    }
  }
}

const allMergedIngredients = Object.values(mergedIngredients)

return (
  <div className='ing-container'>
    <h2>Weekly ingredients</h2>
    <ul>
      {allMergedIngredients.map((ingredient, index) => {
        // Round the amount to a reasonable precision
        const roundedAmount = Math.round(ingredient.amount * 4) / 4
        const displayAmount = roundedAmount < 0.25 ? 0.25 : roundedAmount
        
        return (
          <li key={index}>
            {displayAmount} {ingredient.unit} {ingredient.name}
          </li>
        )
      })}
    </ul>
  </div>
)
  }

export default AllIngredients
