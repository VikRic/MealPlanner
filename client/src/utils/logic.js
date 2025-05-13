import { showFailedAlert, showSuccessAlert } from './toastifyAlert'

const BASE_URL =
  import.meta.env.VITE_REACT_APP_API_URL || 'http:///localhost:8080/api'

export const validateInputs = (inputs) => {
  if (!inputs.recipeAmnt || inputs.recipeAmnt <= 0) {
    showFailedAlert('Please enter at least 1 recipe to continue.')
    return false
  }
  if (!inputs.dishTypes.length > 0) {
    showFailedAlert('Need to check either of the checkboxes.')
    return false
  }
  return true
}

export const fetchRecipes = async (inputs, token) => {
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
      const data = await response.json()

      if (data.recipes.length < 1) {
        showFailedAlert('Did not find any recipes with your search data')
      }

      return data

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

export const addToPlan = async (date, mealType, recipeId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/meal-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ date, mealType, recipeId })
    })

    if (!response.ok) {
      showFailedAlert('Could not add recipe')
      console.error(await response.text())
      return false
    }
    showSuccessAlert('Recipe added')
    return true

  } catch (err) {
    showFailedAlert('Error occured')
    console.error('Error in addToPlan:', err)
  }
}

export const fetchMeals = async (token) => {
  try {
    if (token) {
    const res = await fetch(`${BASE_URL}/meal-plan`, {
      method: "GET", 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    }); 
    
    if (!res.ok) {
      throw new Error('Failed to fetch meal plan');
    }
    
    const data = await res.json();
          
    if (data.existing?.mealPlan) {
      return data.existing.mealPlan;
      }
    } else {
      console.log('No meal plan data found');
    }
  } catch (error) {
    console.error('Error fetching meal plan:', error);
  }
};



   

