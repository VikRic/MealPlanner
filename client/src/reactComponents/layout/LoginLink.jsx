import { useState } from 'react'
import { createPortal } from 'react-dom'
import ModalContent from '../common/ModalContent.jsx'
import { Link } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'

export default function LoginLink() {
  const [showModal, setShowModal] = useState(false)

  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  const handleLogout = () => {
    signOut()
    setShowModal(false)
  }

  return (
    <>
      <Link onClick={() => setShowModal(true)}>
        {user ? 'Logout' : 'Login'}
      </Link>
      {showModal &&
        createPortal(
          <ModalContent
            onClose={() => setShowModal(false)}
            user={user}
            onLogout={handleLogout}
          />,
          document.body
        )}
    </>
  )
}
