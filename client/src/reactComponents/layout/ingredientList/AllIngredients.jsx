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
        for (const ingredient of recipe.ingredients) {
          const name = ingredient.name
          if (!name) continue

        const normalizedUnit = normalizeUnit(ingredient.unit)
        const key = `${name.toLowerCase()}__${normalizedUnit}`

        if (mergedIngredients[key]) {
          // Check for unit difference
          if (normalizeUnit(mergedIngredients[key].unit) !== normalizedUnit) {
            console.warn(
              `Unit difference for ${name}: "${mergedIngredients[key].unit}" vs "${ingredient.unit}"`
            )
          }

          mergedIngredients[key].amount += ingredient.amount
        } else {
          mergedIngredients[key] = { ...ingredient, unit: normalizedUnit }
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
      {Object.entries(allMergedIngredients).map(([key, value]) => (
        <li key={key}>
          {value.amount} {value.unit} {value.name}
        </li>
      ))}
    </ul>
  </div>
)
  }

export default AllIngredients
