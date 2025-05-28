import { useState, useEffect } from 'react'
import { fetchMeals } from '../utils/logic'
import { useAuth } from '@clerk/clerk-react'
import { MealPlanContext } from './MealPlanContext'
import { getWeekBoundaries } from '../utils/dateUtils'

export const MealPlanProvider = ({ children }) => {
  const { getToken, isLoaded } = useAuth()
  const [mealPlan, setMealPlan] = useState({})
  const [currentWeek, setCurrentWeek] = useState(getWeekBoundaries(new Date()))

  const fetchAndSetMeals = async () => {
    try {
      if (!isLoaded) return

      const token = await getToken()
      if (!token) {
        console.warn("No token available, skipping fetchMeals")
        return
      }

      const data = await fetchMeals(token)
      if (data) {
        setMealPlan(data)
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error)
    }
  }

  useEffect(() => {
    fetchAndSetMeals()
    // eslint-disable-next-line 
  }, [isLoaded, getToken])

  return (
    <MealPlanContext.Provider value={{
      mealPlan,
      fetchAndSetMeals,
      currentWeek,
      setCurrentWeek
    }}>
      {children}
    </MealPlanContext.Provider>
  )
}
