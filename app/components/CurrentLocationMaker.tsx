import mapboxgl from 'mapbox-gl'
import React, { useEffect, useRef } from 'react'

import { useWatchLocation } from '@/app/lib/geolocation'
import { FLY_DURATION_MS, FLY_ZOOM_LEVEL } from '@/app/lib/mapbox/mapboxHooks'

interface CurrentLocationMakerProps {
  map: mapboxgl.Map
  flyToCurrentLocation?: boolean
}

const C: React.FC<CurrentLocationMakerProps> = React.memo(
  ({ map, flyToCurrentLocation = false }) => {
    const { currentLocation } = useWatchLocation()
    const markerRef = useRef<HTMLDivElement | null>(null)

    /**
     * 現在地へ飛ぶ処理
     */
    useEffect(() => {
      if (
        !currentLocation?.longitude ||
        !currentLocation?.latitude ||
        !flyToCurrentLocation
      )
        return

      map.flyTo({
        center: [currentLocation.longitude, currentLocation.latitude],
        zoom: FLY_ZOOM_LEVEL,
        duration: FLY_DURATION_MS,
      })
    }, [currentLocation, flyToCurrentLocation, map])

    /**
     * マーカーの設置とクリーンアップ
     */
    useEffect(() => {
      if (
        !currentLocation?.longitude ||
        !currentLocation?.latitude ||
        !markerRef.current
      )
        return

      const marker = new mapboxgl.Marker(markerRef.current)
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(map)

      return () => {
        marker.remove()
      }
    }, [currentLocation, map])

    return (
      <div ref={markerRef}>
        <div className='w-6 h-6 bg-blue-500 rounded-full border-2 border-white' />
      </div>
    )
  }
)

export default C
