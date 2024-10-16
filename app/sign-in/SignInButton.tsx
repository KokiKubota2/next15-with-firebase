'use client'

import { useState } from 'react'

import { Button } from '@/app/components'
import { signInWithGoogle } from '@/app/lib/firebase/auth'
import { redirect } from 'next/navigation'

const C = () => {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    const isOk = await signInWithGoogle()
    setLoading(false)
    if (!isOk) return
    redirect('/')
  }

  return (
    <Button onClick={onClick} loading={loading} disabled={loading}>
      Sign in with Google
    </Button>
  )
}

export default C
