import { Link } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import './header.css'

function Header() {
  const { user, isLoaded } = useUser()

  return (
    <header className="header">
      <div className="container"></div>
      <nav className="nav">
        <ul className="nav-links">
          <li><Link to="/"><img src='/logo.png' alt="logo" className='logo-img' /></Link></li>
          <li> <Link to="/Recipe">Recipe</Link> </li>
          
            {isLoaded && user ? (
              <li className='nav-auth'>
                <UserButton>
                </UserButton>
              </li>
            ) : (
              <>
              <li className='nav-auth'><Link to="/login">Logga in</Link></li>
              <li><Link to="/signup">Skapa konto</Link></li>
              </>
            )}
          
        </ul>
      </nav>
    </header>
  )
}



export default Header
