'use client'
import { useAuth, useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'

const TestPage: React.FC = () => {
  const { isSignedIn,  user } = useUser()
  console.log("user",user)
  return (
          <div >
            {isSignedIn ? (
              <>
                <div >Welcome {user.firstName}!</div>
              </>
            ) : (
              <div >Sign in to create your todo list!</div>
            )}
          </div>
  )
}

export default TestPage;