import { createContext, useContext, } from 'react'

export const MealPlanContext = createContext()

export const useMealPlan = () => useContext(MealPlanContext)
