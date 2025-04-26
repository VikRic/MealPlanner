// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './reactComponents/pages/Home.jsx'
import Recipe from './reactComponents/pages/Recipe.jsx'
import Test from './reactComponents/pages/Test.jsx'
import { SignIn } from '@clerk/clerk-react'
import 'styles/clerkLogin.css'

function App() {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe" element={<Recipe />} />
        <Route path="/Test" element={<Test />} />
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
      </Routes>
    </div>
  )
}

export default App
