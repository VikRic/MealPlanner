import { useState } from 'react'
import { addToPlan } from '../../utils/logic'
import { useAuth } from '@clerk/clerk-react'
import { getWeekBoundaries, getDaysInWeek } from '../../utils/dateUtils';
import 'styles/recipeList.css'

const RecipeCard = ({ servings, recipe }) => {
  // Get actual day as default
  const [currentWeek, setCurrentWeek] = useState(getWeekBoundaries(new Date()));
  const [selectedDay, setSelectedDay] = useState(null)
  const [mealType, setMealType] = useState('breakfast')
  const { getToken } = useAuth()
  
  // Array for actual week
  const days = getDaysInWeek(currentWeek.start);
  
  if (!selectedDay && days.length > 0) {
    setSelectedDay(days[0].dateString);
  }
  
  // Week navigator
  const navigateWeek = (direction) => {
    const referenceDate = new Date(currentWeek.start);
    const offset = direction === 'next' ? 7 : -7;
    referenceDate.setDate(referenceDate.getDate() + offset);
    
    const newWeek = getWeekBoundaries(referenceDate);
    setCurrentWeek(newWeek);
    
    // Update day to Monday of new week
    const newDays = getDaysInWeek(newWeek.start);
    if (newDays.length > 0) {
      setSelectedDay(newDays[0].dateString);
    }
  };
  
  const handleAdd = async () => {
    const token = await getToken()
    
    if (!selectedDay) {
      console.error('No day chosen')
      return
    }
    
    await addToPlan(selectedDay, mealType, recipe.spoonacularId, token)
  }
  
  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        <div className="plan-controls">
          <div className="week-selector">
            <button onClick={() => navigateWeek('prev')} className="week-nav-btn">←</button>
            <button onClick={() => navigateWeek('next')} className="week-nav-btn">→</button>
          </div>
          
          <select
            onChange={(e) => setSelectedDay(e.target.value)}
            value={selectedDay || ''}
          >
            {days.map(day => (
              <option key={day.dateString} value={day.dateString}>
                {day.weekday} ({day.dateString})
              </option>
            ))}
          </select>
          
          <select
            onChange={(e) => setMealType(e.target.value)}
            value={mealType}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
          
          <button className="add-btn" onClick={handleAdd}>
            ➕ Add
          </button>
        </div>
      </div>
      <div className="recipe-content">
        <img src={recipe.image} alt={recipe.title} className="recipe-img" />
        <div className="recipe-info">
          <div className="allergies">
            {recipe.vegan && <p className="allergy">🌱 Vegan</p>}
            {recipe.glutenFree && <p className="allergy">🌾 Gluten free</p>}
            {recipe.dairyFree && <p className="allergy">🥛 Dairy free</p>}
          </div>
          <div className="recipe-data">
            <span>
              <strong>Time:</strong> {recipe.readyInMinutes} min
            </span>
            <span>
              <strong>Servings:</strong> {servings || 1}
            </span>
          </div>
        </div>
      </div>
      <div className="recipe-details">
        <details className="instructions">
          <summary>
            <span>Instructions</span>
          </summary>
          <ul>
            {recipe.instructions.split('.').map((sentence, index) => {
              const cleanedSentence = sentence
                .replace(/<[^>]+>/g, '') // Removes all HTML tags
                .trim()
              return cleanedSentence ? (
                <li key={index}>{cleanedSentence}.</li>
              ) : null
            })}
          </ul>
        </details>
        <details className="ingredients">
          <summary>
            <span> Ingredients</span>
          </summary>
          <ul>
            {recipe.ingredients.map((ing, i) => {
              const factor = servings || 1
              const amount = ing.amount * (factor / recipe.servings)
              const rounded = Math.round(amount * 4) / 4
              const adjustedAmount =
                rounded < 0.25 && rounded !== 0 ? 0.25 : rounded
              return (
                <li key={i}>
                  {adjustedAmount} {ing.unit} {ing.name}
                </li>
              )
            })}
          </ul>
        </details>
      </div>
    </div>
  )
}

export default RecipeCard