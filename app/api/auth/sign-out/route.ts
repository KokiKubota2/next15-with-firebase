import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { revokeAllSessions } from '@/app/lib/firebase/firebase-admin'
import { APIResponse } from '@/app/types/addtional'

export async function GET() {
  const _cookies = await cookies()
  const sessionCookie = _cookies.get('__session')?.value

  if (!sessionCookie)
    return NextResponse.json<APIResponse<string>>(
      { success: false, error: 'Session not found.' },
      { status: 400 }
    )

  _cookies.delete('__session')

  await revokeAllSessions(sessionCookie)

  return NextResponse.json<APIResponse<string>>({
    success: true,
    data: 'Signed out successfully.',
  })
}
