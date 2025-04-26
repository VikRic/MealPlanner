import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import InputField from './inputField'
import RecipeCard from './recipeCard'
import DropDownMenu from './dropDownMenu'
import Checkbox from './checkBox'
import { showFailedAlert } from '../../utils/toastifyAlert'

function InputForm() {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [inputs, setInputs] = useState({
    recipeAmnt: '',
    allergies: '',
    mealLunch: false,
    mealDinner: false,
    cuisine: '',
    timeToCook: '',
    servings: ''
  })

  const validateInputs = () => {
    if (!inputs.recipeAmnt || inputs.recipeAmnt <= 0) {
      showFailedAlert('Please enter at least 1 recipe to continue.')
      return false
    }
    if (!inputs.mealDinner && !inputs.mealLunch) {
      showFailedAlert('Need to check either of the checkboxes.')
      return false
    }
    return true
  }

  const [recipes, setRecipes] = useState([])
  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target
    setInputs((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateInputs()) {
      return
    }
    setIsLoading(true)

    try {
      const token = await getToken()
      if (!token) {
        alert('You need to be logged in to get recipes.')
        return
      }

      try {
        const response = await fetch('http://localhost:8090/recipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(inputs)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Data sent to server')
          setRecipes(data.recipes)
        } else {
          console.error(response)
          console.error('Unable to send data')
        }
      } catch (error) {
        console.error('Error while sending data to server:', error)
      }
    } finally {
      setIsLoading(false)
    }

  }

  // Sends allergy value from dropdown to server
  const handleDropdownChange = (value) => {
    setInputs((prevState) => ({
      ...prevState,
      allergies: value
    }))
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
