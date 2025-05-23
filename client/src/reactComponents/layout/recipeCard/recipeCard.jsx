import { useState } from 'react'
import { addToPlan, deleteFromPlan } from '../../../utils/logic'
import { useAuth } from '@clerk/clerk-react'
import { getWeekBoundaries, getDaysInWeek } from '../../../utils/dateUtils'
import './recipeList.css'
import { useMealPlan } from '../../../contexts/MealPlanContext'


const RecipeCard = ({ servings, recipe, buttonText, onRemove  }) => {
  const { fetchAndSetMeals } = useMealPlan()
  // Get actual day as default
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null) // 'instructions' or 'ingredients'
  const [currentWeek, setCurrentWeek] = useState(getWeekBoundaries(new Date()))
  // 
  const [selectedDay, setSelectedDay] = useState(recipe.selectedDay || null)
  const [mealType, setMealType] = useState(recipe.selectedMealType || 'breakfast')
  const { getToken } = useAuth()
/*   if (servings < 1) {
    servings = 1
  } */
  
  // Array for actual week
  const days = getDaysInWeek(currentWeek.start)
  
  if (!selectedDay && days.length > 0) {
    setSelectedDay(days[0].dateString)
  }

  const openModal = (type) => {
  setModalType(type)
  setShowModal(true)
}

const closeModal = () => {
  setShowModal(false)
  setModalType(null)
}
  
  // Week navigator
  const navigateWeek = (direction) => {
    const referenceDate = new Date(currentWeek.start)
    const offset = direction === 'next' ? 7 : -7
    referenceDate.setDate(referenceDate.getDate() + offset)
    
    const newWeek = getWeekBoundaries(referenceDate)
    setCurrentWeek(newWeek)
    
    // Update day to Monday of new week
    const newDays = getDaysInWeek(newWeek.start)
    if (newDays.length > 0) {
      setSelectedDay(newDays[0].dateString)
    }
  }
  
  const handleAdd = async () => {
    const token = await getToken()
    if (!selectedDay) return

    if (!buttonText) {
      await addToPlan(selectedDay, mealType, recipe.spoonacularId, token, servings)
    } else {
      await deleteFromPlan(selectedDay, mealType, recipe.spoonacularId, token)
      if (onRemove) {
        onRemove()
      }
    }
    await fetchAndSetMeals() // update global state
  }

  
  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
      </div>
      
      <div className="recipe-content">
        <div className="recipe-image-container">
          <img src={recipe.image} alt={recipe.title} className="recipe-img" />
          <div className="allergies">
            {recipe.vegan && <p className="allergy">🌱 Vegan</p>}
            {recipe.glutenFree && <p className="allergy">🌾 Gluten free</p>}
            {recipe.dairyFree && <p className="allergy">🥛 Dairy free</p>}
          </div>
        </div>
        
        <div className="recipe-info">
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
            

          </div>
          <button className="add-btn" onClick={handleAdd}>
            <span>{buttonText || '➕ Add' }</span>
          </button>
          
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
        <div className="modal-buttons">
          <button onClick={() => openModal('instructions')}>Instructions</button>
          <button onClick={() => openModal('ingredients')}>Ingredients</button>
        </div>
      </div>
      {showModal && (
  <div className="recipe-modal-overlay" onClick={closeModal}>
    <div className="recipeList-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-modal-btn" onClick={closeModal}>✕</button>
      <h3>{modalType === 'instructions' ? 'Instructions' : 'Ingredients'}</h3>

      {modalType === 'instructions' ? (
        <ul>
          {recipe.instructions.split('.').map((sentence, index) => {
            const cleaned = sentence.replace(/<[^>]+>/g, '').trim()
            return cleaned ? <li key={index}>{cleaned}.</li> : null
          })}
        </ul>
      ) : (
        <ul>
          {recipe.ingredients.map((ing, i) => {
            const factor = servings || 1
            const amount = ing.amount * (factor / recipe.servings)
            const rounded = Math.round(amount * 4) / 4
            const adjusted = rounded < 0.25 && rounded !== 0 ? 0.25 : rounded
            return (
              <li key={i}>
                {adjusted} {ing.unit} {ing.name}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  </div>
)}
    </div>
  )
}

export default RecipeCard