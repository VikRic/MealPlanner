import { useUser, useClerk } from "@clerk/clerk-react"

export default function CustomUserMenu() {
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <div className="menu">
      <p>{user.fullName}</p>
      <a href="/account">Konto</a>
      <button onClick={() => signOut()}>Logga ut</button>
    </div>
  )
}