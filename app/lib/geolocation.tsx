'use client'

import { DateTime } from 'luxon'
import { useCallback, useEffect, useRef, useState } from 'react'

export type LocationProps = {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
  timestamp: number | null
}

const MAXIMUM_AGE_MS = 300000
const TIMEOUT_MS = 10000

export const useWatchLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationProps | null>(
    null
  )
  const [error, setError] = useState<GeolocationPositionError | null>(null)
  const [loading, setLoading] = useState(true)
  const locationUpdateAtRef = useRef<DateTime | null>(null)

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setError(null)
    const {
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
    } = position.coords
    setCurrentLocation({
      latitude,
      longitude,
      accuracy,
      altitude,
      altitudeAccuracy,
      heading,
      speed,
      timestamp: position.timestamp,
    })
    locationUpdateAtRef.current = DateTime.now()
    setLoading(false)
  }, [])

  const onError = useCallback((error: GeolocationPositionError) => {
    setError(error)
    console.warn({ error })
    setLoading(false)
  }, [])

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: TIMEOUT_MS,
      maximumAge: MAXIMUM_AGE_MS,
    })

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [onSuccess, onError])

  return { currentLocation, loading, error }
}
