import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import InputField from './inputField'
import RecipeCard from './recipeCard'
import DropDownMenu from './dropDownMenu'
import Checkbox from './checkBox'

import { showFailedAlert } from '../../utils/toastifyAlert'
import { validateInputs, fetchRecipes } from '../../utils/logic'

function InputForm() {
  const { getToken } = useAuth() // Logged in checker
  const [isLoading, setIsLoading] = useState(false) // Getting data from server
  const [recipes, setRecipes] = useState([]) // Recipes set on client
  const [inputs, setInputs] = useState({
    recipeAmnt: '',
    allergies: '',
    mealLunch: false,
    mealDinner: false,
    cuisine: '',
    timeToCook: '',
    servings: ''
  })

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target
    setInputs((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Sends allergy value from dropdown to server
  const handleDropdownChange = (value) => {
    setInputs((prevState) => ({
      ...prevState,
      allergies: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = await getToken()

    if (!token) {
      showFailedAlert('You need to be logged in to get recipes.')
      return
    }

    if (!validateInputs(inputs)) {
      return
    }
    setIsLoading(true)

    const data = await fetchRecipes(inputs, token)
    if (data) {
      setRecipes(data.recipes)
    }

    setIsLoading(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        {/* How many days */}
        <InputField
          name="recipeAmnt"
          value={inputs.recipeAmnt}
          onChange={handleInputChange}
          placeholder="How many meals"
        />

        {/* Lunch / Dinner */}
        <div className="checkbox-group">

          <Checkbox
            label="Lunch"
            name="mealLunch"
            checked={inputs.mealLunch}
            onChange={handleInputChange}
          />

          <Checkbox
            label="Dinner"
            name="mealDinner"
            checked={inputs.mealDinner}
            onChange={handleInputChange}
          />
        </div>

        {/* How many servings */}
        <InputField
          name="servings"
          value={inputs.servings}
          onChange={handleInputChange}
          placeholder="Servings"
        />

        {/* Allergies */}
        <DropDownMenu onChange={handleDropdownChange} />


        {/* Cuisine */}
        <InputField
          name="cuisine"
          value={inputs.cuisine}
          onChange={handleInputChange}
          placeholder="Cuisine"
        />

        {/* Time To cook */}
        <InputField
          name="timeToCook"
          value={inputs.timeToCook}
          onChange={handleInputChange}
          placeholder="Estimated total time"
        />

        <button className="submit-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Getting recipes...' : 'Get recipes'}
        </button>
      </form>

      <div className="recipe-list">
        {recipes.length > 0 &&
          recipes.map((recipe, ID) => <RecipeCard key={ID} recipe={recipe} />)}
      </div>
    </div>
  )
}

export default InputForm
