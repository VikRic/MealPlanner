import { Link, NavLink  } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { UserButton } from '@clerk/clerk-react'
import './header.css'

function Header() {
  const { user, isLoaded } = useUser()

  return (
    <header className="header">
      <div className="container"></div>
      <nav className="nav">
        
        <ul className="nav-links">
          <li>
            <Link to="/"><img src='/logo.png' alt="logo" className='logo-img'/></Link>
          </li>
          <li>
            <Link to="/Recipe">Recipe</Link>
          </li>
          <li>
            {/* To hide login button not being loaded in time */}
            {isLoaded &&
              (user ? <UserButton /> : <Link to="/login">Login</Link>)}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
