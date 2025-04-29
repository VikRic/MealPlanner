import { showFailedAlert } from './toastifyAlert'

export const validateInputs = (inputs) => {
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

export const fetchRecipes = async (inputs, token) => {
  const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || ''
  try {
    const response = await fetch(`${BASE_URL}/recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(inputs)
    })

    if (response.ok) {
      return await response.json()
    } else {
      console.error('Unable to send data', response)
      showFailedAlert('Server error')
      return null
    }
  } catch (error) {
    console.error('Error while sending data to server:', error)
    showFailedAlert('Please try again later.')
    return null
  }
}
