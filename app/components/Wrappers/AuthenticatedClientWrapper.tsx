'use client'

import { redirect } from 'next/navigation'
import { ReactNode, Suspense } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { QueryClient, QueryClientProvider } from 'react-query'

import { auth } from '@/app/lib/firebase/firebase-client'

const queryClient = new QueryClient({
  defaultOptions: { queries: { suspense: true } },
})

const C = ({ children }: { children: ReactNode }) => {
  const [user, loading] = useAuthState(auth)

  if (loading) return <>FirebaseAuth Loading...</>
  if (!user) return redirect('/sign-in')

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<>Loading...</>}>{children}</Suspense>
    </QueryClientProvider>
  )
}

export default C
