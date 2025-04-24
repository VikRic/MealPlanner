import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import InputField from './inputField'
import RecipeCard from './recipeCard'
import DropDownMenu from './dropDownMenu'

function InputForm() {
  const { getToken } = useAuth()
  const [inputs, setInputs] = useState({
    recipeAmnt: '',
    allergies: '',
    cuisine: '',
    timeToCook: '',
    budget: '',
    servings: ''
  })

  const [recipes, setRecipes] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setInputs((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = await getToken()
    if (!token) {
      alert('Du måste vara inloggad för att skicka formuläret.')
      return
    }

    try {
      const response = await fetch('http://localhost:8090/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
        <InputField
          name="recipeAmnt"
          value={inputs.recipeAmnt}
          onChange={handleInputChange}
          placeholder="How many meals"
          required
        />
        <DropDownMenu onChange={handleDropdownChange} />
        <InputField
          name="cuisine"
          value={inputs.cuisine}
          onChange={handleInputChange}
          placeholder="Cuisine"
        />
        <InputField
          name="timeToCook"
          value={inputs.timeToCook}
          onChange={handleInputChange}
          placeholder="Estimated total time"
        />
        <InputField
          name="budget"
          value={inputs.budget}
          onChange={handleInputChange}
          placeholder="Budget"
        />
        <InputField
          name="servings"
          value={inputs.servings}
          onChange={handleInputChange}
          placeholder="Servings"
        />
        <button type="submit">Get recipes</button>
      </form>

      <div className="recipe-list">
        {recipes.length > 0 &&
          recipes.map((recipe, ID) => <RecipeCard key={ID} recipe={recipe} />)}
      </div>
    </div>
  )
}

export default InputForm
