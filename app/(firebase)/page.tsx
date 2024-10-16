import { SignOutButton } from '@/app/(firebase)'
import { getCurrentUser } from '@/app/lib/firebase/firebase-admin'

const P = async () => {
  const currentUser = await getCurrentUser()

  return (
    <div className='m-2'>
      <h1 className='mb-2'>Authed Page</h1>
      <p className='mb-2'>{currentUser.uid}</p>
      <SignOutButton />
    </div>
  )
}

export default P
