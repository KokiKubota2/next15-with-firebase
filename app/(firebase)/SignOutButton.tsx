'use client'

import { useState } from 'react'

import { Button } from '@/app/components'
import { signOut } from '@/app/lib/firebase/auth'
import { redirect } from 'next/navigation'

const C = () => {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)

    const isOk = await signOut()
    setLoading(false)

    if (!isOk) return
    redirect('/sign-in')
  }

  return (
    <Button
      variant='denger'
      onClick={onClick}
      loading={loading}
      disabled={loading}>
      Sign out
    </Button>
  )
}

export default C
