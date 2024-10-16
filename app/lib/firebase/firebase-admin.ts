import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { SessionCookieOptions, getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const getSession = async () => {
  try {
    const sessionCookie = await cookies()
    return sessionCookie.get('__session')?.value
  } catch (error) {
    return undefined
  }
}

export const firebaseApp =
  getApps().find((it) => it.name === 'firebase-admin-app') ||
  initializeApp(
    {
      credential: cert(
        JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT as string)
      ),
    },
    'firebase-admin-app'
  )

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

export const isUserAuthenticated = async (
  session: string | undefined = undefined
) => {
  const _session = session ?? (await getSession())
  if (!_session) return false

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true))
    return !isRevoked
  } catch (error) {
    console.log(error)
    return false
  }
}

export const getCurrentUser = async () => {
  const session = await getSession()

  if (!(await isUserAuthenticated(session))) return redirect('/sign-in')

  const decodedIdToken = await auth.verifySessionCookie(session!)
  const currentUser = await auth.getUser(decodedIdToken.uid)

  return currentUser
}

export const createSessionCookie = async (
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) => auth.createSessionCookie(idToken, sessionCookieOptions)

export const revokeAllSessions = async (session: string) => {
  const decodedIdToken = await auth.verifySessionCookie(session)

  return await auth.revokeRefreshTokens(decodedIdToken.sub)
}
