import React, { useState } from 'react'
import InputForm from '../layout/form/inputForm'

import MealPlannerApp from "../layout/calender/MealPlannerApp"
import RecipeCard from '../layout/recipeCard/recipeCard'
/* import 'styles/recipeList.css' */

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
        <MealPlannerApp />
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
