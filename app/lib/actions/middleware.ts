import { getCurrentUser } from '@/app/lib/firebase/firebase-admin'
import { NextResponse } from 'next/server'

export const withFirebaseAuth =
  (handler: Function) =>
  async (...args: any[]) => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      return handler(...args)
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  }
