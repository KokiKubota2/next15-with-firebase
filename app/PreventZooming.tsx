'use client'

import { useEffect } from 'react'

const C = () => {
  useEffect(() => {
    // to prevent zooming on browser
    window.document.body.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 1) e.preventDefault()
      },
      { passive: false }
    )
  }, [])

  return null
}

export default C
