import { useState, useEffect } from 'react'
import { fetchCuisines } from '../utils/logic'
import { useAuth } from '@clerk/clerk-react'
import { CuisineContext } from './CuisineContext'



export const CuisineProvider = ({ children }) => {
  const { getToken } = useAuth()
    const [cuisineOptions, setCuisineOptions] = useState([])


  const fetchAllCuisines = async () => {
    const token = await getToken()
    const data = await fetchCuisines(token)
    if (data) {
      setCuisineOptions(data)
    }
  }
// On page load or token changes, this runs and sets all recipes in mealPlan
  useEffect(() => {
    fetchAllCuisines()

// eslint-disable-next-line 
  }, [getToken])

  return (
    <CuisineContext.Provider value={{
      cuisineOptions}}>
      {children}
    </CuisineContext.Provider>
  )
}


