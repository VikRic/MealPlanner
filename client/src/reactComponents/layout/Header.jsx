import React from 'react'
import { Link } from 'react-router-dom'
import 'styles/header.css'
import { useUser } from '@clerk/clerk-react'
import { UserButton } from '@clerk/clerk-react'

function Header() {
  const { user, isLoaded } = useUser()
  console.log('user', user)
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-links">
          <li>
            <Link to="/">Hem</Link>
          </li>
          <li>
            <Link to="/Recipe">Recipe</Link>
          </li>
          <li>
            <Link to="/Test">Test</Link>
          </li>
          <li>
            {/* To hide login button not being loaded in time */}
            {!isLoaded ? (
              <span style={{ color: '#646cff', fontWeight: 500 }}>Login</span>
            ) : user ? (
              <UserButton />
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
