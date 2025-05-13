import { useAuth } from '@clerk/clerk-react'
import InputField from '../../common/inpputField/inputField'
import Checkbox from '../../common/checkbox/checkBox'
import DropDownMenu from '../../common/dropdown/dropDownMenu'
import './form.css'

import {
  handleInputChange as createInputfields,
  handleDropdownChange as createDropdown,
  handleCheckboxChange as createCheckbox
} from '../../../utils/handleInputs'

import { showFailedAlert } from '../../../utils/toastifyAlert'
import { validateInputs, fetchRecipes } from '../../../utils/logic'

function InputForm({ inputs, setInputs, setRecipes, isLoading, setIsLoading }) {
  const { getToken } = useAuth()

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

    if (!validateInputs(inputs)) return

    setIsLoading(true)
    const data = await fetchRecipes(inputs, token)
    if (data) {
      setRecipes(data.recipes)
    }
    setIsLoading(false)
  }

  return (
    <div style={{ marginTop: '25px', paddingRight: '20px'/* , width: '100%' */ }}>
      <form onSubmit={handleSubmit} className="form-container">
        <h3 style={{ textAlign: 'left', margin: '5px', marginLeft: '10px' }}>
          Find new recipes!
        </h3>

        {/* How many meals */}
        <InputField
          name="recipeAmnt"
          value={inputs.recipeAmnt}
          onChange={handleInputChange}
          placeholder="How many meals"
        />

        {/* Dish type checkboxes */}
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

        {/* Servings */}
        <InputField
          name="servings"
          value={inputs.servings}
          onChange={handleInputChange}
          placeholder="Servings"
        />

        {/* Allergies dropdown */}
        <DropDownMenu
          onChange={handleDropdownChange('allergies')}
          options={[
            { value: '', label: 'Choose restriction' },
            { value: 'dairyFree', label: 'Dairy free' },
            { value: 'glutenFree', label: 'Gluten free' },
            { value: 'vegan', label: 'Vegan' }
          ]}
        />

        {/* Cuisine input */}
        <InputField
          name="cuisine"
          value={inputs.cuisine}
          onChange={handleInputChange}
          placeholder="Cuisine"
        />

        {/* Time to cook dropdown */}
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
    </div>
  )
}

export default InputForm
