import { createContext, useContext, useState, useEffect } from 'react';
import { fetchMeals } from '../utils/logic';
import { useAuth } from '@clerk/clerk-react';


const MealPlanContext = createContext();

export const MealPlanProvider = ({ children }) => {
  const { getToken } = useAuth();
  const [mealPlan, setMealPlan] = useState({});

  const fetchAndSetMeals = async () => {
    const token = await getToken();
    const data = await fetchMeals(token);
    if (data) {
      setMealPlan(data)
    }
  };
// On page load or token changes, this runs and sets all recipes in mealPlan
  useEffect(() => {
    fetchAndSetMeals();
  }, [getToken]);

  return (
    <MealPlanContext.Provider value={{ mealPlan, fetchAndSetMeals }}>
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => useContext(MealPlanContext);
