import { useEffect } from 'react'
import 'styles/modal.css'
import { SignIn } from '@clerk/clerk-react'

export default function ModalContent({ onClose, user, onLogout }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        console.log('User Object: ', user)
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onClose, user])

  return (
    <div className="modal">
      <h2 style={{ textTransform: 'capitalize' }}>
        {user ? `Hello ${ user.username }!` : 'Log in'}
      </h2>

      {user ? (
        <>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <SignIn />
        </>
      )}
    </div>
  )
}
