import Link from 'next/link'

import { SignOutButton } from '@/app/(firebase)'
import { getCurrentUser } from '@/app/lib/firebase/firebase-admin'

const P = async () => {
  const currentUser = await getCurrentUser()

  return (
    <div className='flex flex-col gap-4 m-2'>
      <div>
        <h1 className='mb-2'>Authed Page</h1>
        <p className='mb-2'>{currentUser.uid}</p>
      </div>
      <div>
        <Link href='/reviews' className='underline text-blue-500'>
          /reviews
        </Link>
      </div>
      <SignOutButton />
    </div>
  )
}

export default P
