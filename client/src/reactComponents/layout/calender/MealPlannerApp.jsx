import { useState } from 'react'
import { getWeekBoundaries, formatWeekDisplay, getDaysInWeek } from '../../../utils/dateUtils'
import RecipeCard from '../recipeCard/recipeCard.jsx'
import { useMealPlan } from '../../../contexts/MealPlanContext'
import './mealPlanner.css'

export default function MealPlannerApp() {
  // Get calendar week
  const { currentWeek, setCurrentWeek } = useMealPlan()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { mealPlan } = useMealPlan()

  // Next and previous week
  const navigateWeek = (direction) => {
    const referenceDate = new Date(currentWeek.start)
    const offset = direction === 'next' ? 7 : -7
    referenceDate.setDate(referenceDate.getDate() + offset)
    
    setCurrentWeek(getWeekBoundaries(referenceDate))
  }

  const getMealsForDate = (dateString, mealType) => {
    // Check if there are meals for this date and meal type
    if (mealPlan[dateString] && mealPlan[dateString][mealType]) {
      return [mealPlan[dateString][mealType]]
    }
    return []
  }

  const handleRecipeClick = (recipe, type, day) => {
    setSelectedRecipe({ ...recipe, selectedMealType: type, selectedDay: day })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
  }

  return (
    <div className="app-container">
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => navigateWeek('prev')} className="week-display">←</button>
          <span>{formatWeekDisplay(currentWeek.start, currentWeek.end)}</span>
          <button onClick={() => navigateWeek('next')} className="week-display">→</button>
        </div>

        <div className="calendar-grid">
          {getDaysInWeek(currentWeek.start).map((day) => (
            <div className="calendar-day" key={day.dateString}>
              <div className="calendar-day-header">{day.weekday}</div>

              {['breakfast', 'lunch', 'dinner'].map((type) => {
                const meals = getMealsForDate(day.dateString, type)
                return (
                  <div key={type}>
                    {meals.length > 0 ? (
                      meals.map((meal, idx) => (
                        
                        <div 
                        
                          className={`meal ${type}`} 
                          key={`${type}-${idx}`}
                          onClick={() => handleRecipeClick(meal,type, day.dateString)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                          <img src={meal.image} alt="Food"/>
                        </div>
                      ))
                    ) : (
                        <div className={`meal ${type}`}>
                          <div className="label">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </div>
                        </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      {showModal && selectedRecipe && (
        <div className="recipe-modal-overlay" onClick={closeModal}>
          <div className="recipe-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={closeModal}>✕</button>
            <RecipeCard 
              recipe={selectedRecipe} 
              servings={selectedRecipe.servings}
              buttonText='Remove'
              onRemove={closeModal}
              
            />
          </div>
        </div>
      )}
    </div>
  )
}