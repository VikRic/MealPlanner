import { useState } from 'react'
import InputForm from '../layout/form/inputForm'
import MealPlannerApp from "../layout/calender/MealPlannerApp"
import RecipeCard from '../layout/recipeCard/recipeCard'
import AllIngredients from '../layout/ingredientList/AllIngredients'

function Recipe() {
  const [recipes, setRecipes] = useState([])
  const [inputs, setInputs] = useState({
    recipeAmnt: '',
    allergies: '',
    dishTypes: [],
    cuisine: '',
    timeToCook: '',
    servings: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)

  return (
    <>
      <div className="recipe-layout">
        <InputForm
          inputs={inputs}
          setInputs={setInputs}
          recipes={recipes}
          setRecipes={setRecipes}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        {/* Desktop view */}
        <div className="calendar-ingredients-wrapper">
          <div className="calendar-desktop">
            <MealPlannerApp />
          </div>
          <div className='ingredientList-desktop'>
            <AllIngredients />
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="mobile-controls">
          <button onClick={() => setShowCalendar(true)}>Show calendar kalender</button>
          <button onClick={() => setShowIngredients(true)}>Show ingredients</button>
        </div>

        {/* Modals */}
        {showCalendar && (
          <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowCalendar(false)}>✕</button>
              <MealPlannerApp />
            </div>
          </div>
        )}
        {showIngredients && (
          <div className="modal-overlay" onClick={() => setShowIngredients(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowIngredients(false)}>✕</button>
              <AllIngredients />
            </div>
          </div>
        )}
      </div>

      <div className="recipe-list">
        {recipes.map((recipe, ID) => (
          <RecipeCard key={ID} recipe={recipe} servings={inputs.servings} />
        ))}
      </div>
    </>
  )
}

export default Recipe