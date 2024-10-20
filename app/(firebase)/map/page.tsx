'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Map = dynamic(() => import('./Map'), {
  loading: () => <div>地図を読み込み中...</div>,
})

const P: React.FC = () => <Map />

export default P
