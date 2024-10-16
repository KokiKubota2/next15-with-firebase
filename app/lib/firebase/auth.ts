import axios from 'axios'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

import { auth } from '@/app/lib/firebase/firebase-client'

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()

  try {
    const userCreds = await signInWithPopup(auth, provider)
    const idToken = await userCreds.user.getIdToken()

    const response = await axios.post(
      '/api/auth/sign-in',
      { idToken },
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (response.status === 200 && response.data.success) return true
    return false
  } catch (error) {
    console.error('Error signing in with Google', error)
    return false
  }
}

export const signOut = async () => {
  try {
    await auth.signOut()

    const response = await axios.get('/api/auth/sign-out', {
      headers: { 'Content-Type': 'application/json' },
    })

    if (response.status === 200 && response.data.success) return true
    return false
  } catch (error) {
    console.error('Error signing out with Google', error)
    return false
  }
}
