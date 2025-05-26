import { useState, useEffect } from 'react'
import { fetchMeals } from '../utils/logic'
import { useAuth } from '@clerk/clerk-react'
import { MealPlanContext } from './MealPlanContext'
import { getWeekBoundaries } from '../utils/dateUtils'


export const MealPlanProvider = ({ children }) => {
  const { getToken } = useAuth()
  const [mealPlan, setMealPlan] = useState({})
  const [currentWeek, setCurrentWeek] = useState(getWeekBoundaries(new Date()))

  const fetchAndSetMeals = async () => {
    const token = await getToken()
    const data = await fetchMeals(token)
    if (data) {
      setMealPlan(data)
    }
  }
// On page load or token changes, this runs and sets all recipes in mealPlan
  useEffect(() => {
    fetchAndSetMeals()

// eslint-disable-next-line 
  }, [getToken])

  return (
    <MealPlanContext.Provider value={{
      mealPlan,
      fetchAndSetMeals,
      currentWeek,
      setCurrentWeek }}>
      {children}
    </MealPlanContext.Provider>
  )
}


