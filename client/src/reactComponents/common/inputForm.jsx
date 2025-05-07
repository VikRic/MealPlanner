import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import InputField from './inputField'
import RecipeCard from './recipeCard'
import DropDownMenu2 from './dropDownMenu2'
import Checkbox from './checkBox'
import DropDownMenu from './dropDownMenu'
import {
  handleInputChange as createInputfields,
  handleDropdownChange as createDropdown,
  handleCheckboxChange as createCheckbox
} from '../../utils/handleInputs'

import { showFailedAlert } from '../../utils/toastifyAlert'
import { validateInputs, fetchRecipes } from '../../utils/logic'

function InputForm() {
  const { getToken } = useAuth() // Logged in checker
  const [isLoading, setIsLoading] = useState(false) // Getting data from server
  const [recipes, setRecipes] = useState([]) // Recipes set on client
  const [inputs, setInputs] = useState({
    recipeAmnt: '',
    allergies: '',
    dishTypes: [],
    cuisine: '',
    timeToCook: '',
    servings: ''
  })

  const handleInputChange = createInputfields(setInputs)
  const handleDropdownChange = createDropdown(setInputs)
  const handleCheckboxChange = createCheckbox(setInputs)

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
        <h3 style={{ textAlign: 'left', margin: '5px', marginLeft: '10px' }}>
          Find new recipes!{' '}
        </h3>
        {/* How many days */}
        <InputField
          name="recipeAmnt"
          value={inputs.recipeAmnt}
          onChange={handleInputChange}
          placeholder="How many meals"
        />

        {/* Checkboxes */}
        <div className="checkbox-group">
          <Checkbox
            label="Breakfast"
            name="mealBreakfast"
            value="breakfast"
            checked={inputs.dishTypes.includes('breakfast')}
            onChange={handleCheckboxChange}
          />

          <Checkbox
            label="Lunch"
            name="mealLunch"
            value="lunch"
            checked={inputs.dishTypes.includes('lunch')}
            onChange={handleCheckboxChange}
          />

          <Checkbox
            label="Dinner"
            name="mealDinner"
            value="dinner"
            checked={inputs.dishTypes.includes('dinner')}
            onChange={handleCheckboxChange}
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
        <DropDownMenu
          onChange={handleDropdownChange('allergies')}
          options={[
            { value: '', label: 'Choose restriction' },
            { value: 'dairyFree', label: 'Dairy free' },
            { value: 'glutenFree', label: 'Gluten free' },
            { value: 'vegan', label: 'Vegan' }
          ]}
        />

        {/* Cuisine */}
        <InputField
          name="cuisine"
          value={inputs.cuisine}
          onChange={handleInputChange}
          placeholder="Cuisine"
        />

        {/* Time To cook */}
        <DropDownMenu
          onChange={handleDropdownChange('timeToCook')}
          options={[
            { value: '', label: 'Timer' },
            { value: 15, label: 'Less than 15 min' },
            { value: 30, label: 'Less than 30 min' },
            { value: 60, label: 'Less than 60 mins' },
            { value: 61, label: 'More than 60 mins' }
          ]}
        />

        <button
          className="submit-button"
          type="submit"
          disabled={isLoading}
          style={{ margin: '10px' }}
        >
          {isLoading ? 'Getting recipes...' : 'Get recipes'}
        </button>
      </form>

      <div className="recipe-list">
        {recipes.length > 0 &&
          recipes.map((recipe, ID) => (
            <RecipeCard key={ID} recipe={recipe} servings={inputs.servings} />
          ))}
      </div>
    </div>
  )
}

export default InputForm
