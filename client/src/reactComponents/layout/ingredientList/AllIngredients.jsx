import { useMealPlan } from '../../../contexts/MealPlanContext'
import { normalizeUnit } from '../../../utils/logic'
import { getWeekBoundaries, getDaysInWeek } from '../../../utils/dateUtils'
import './AllIngredients.css'

const AllIngredients = () => {
  const { mealPlan } = useMealPlan()

const mergedIngredients = {}
const { start } = getWeekBoundaries(new Date())
const currentWeekDays = getDaysInWeek(start).map(day => day.dateString)

for (const date in mealPlan) {
  if (!currentWeekDays.includes(date)) continue

  for (const mealType in mealPlan[date]) {
    const recipe = mealPlan[date][mealType]
    if (recipe && Array.isArray(recipe.ingredients)) {
      for (const ingredient of recipe.ingredients) {
        const name = ingredient.name
        if (!name) continue

        const normalizedUnit = normalizeUnit(ingredient.unit)
        const key = `${name.toLowerCase()}__${normalizedUnit}`

        if (mergedIngredients[key]) {
          // Check for unit difference (Might need to add more)
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
  <div>
    <h2>All ingredients</h2>
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
