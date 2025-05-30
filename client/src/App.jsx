import { Routes, Route } from 'react-router-dom'
import 'styles/App.css'
import Home from './reactComponents/pages/Home.jsx'
import Recipe from './reactComponents/pages/Recipe.jsx'
import Terms from './reactComponents/pages/Terms.jsx'
import { SignIn, SignUp } from '@clerk/clerk-react'
import 'styles/clerkLogin.css'
import { MealPlanProvider } from './contexts/MealPlanProvider.jsx'
import { CuisineProvider } from './contexts/CuisineProvider.jsx'

function App() {
  return (
     
    <div className="main-content">
      <MealPlanProvider>
        <CuisineProvider>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route
          path="/login"
          element={
            <SignIn
              appearance={{
                variables: {
                  colorPrimary: '#4f46e5',
                  fontSize: '1.1rem'
                },
                elements: {
                  rootBox: 'cl-rootBox'
                }
              }}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp
              appearance={{
                variables: {
                  colorPrimary: '#4f46e5',
                  fontSize: '1.1rem'
                },
                elements: {
                  rootBox: 'cl-rootBox'
                }
              }}
            />
          }
        />
        <Route path="/Terms" element={<Terms />} />
      </Routes>
      </CuisineProvider>
      </MealPlanProvider>
      
    </div>
  )
}

export default App
