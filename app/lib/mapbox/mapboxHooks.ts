import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'

import { MAP_STYLES } from '@/app/lib/mapbox/mapStyle'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

type MapboxHookArgs = {
  mapStyle?: string | mapboxgl.Style
  latitude?: number
  longitude?: number
  initZoom?: number
  initializeMap?: (map: mapboxgl.Map) => void
  onMapClick?: (
    map: mapboxgl.Map,
    event: mapboxgl.MapMouseEvent
  ) => Promise<void>
  onMapLoad?: (map: mapboxgl.Map) => Promise<void> | void
  onStyleLoad?: (map: mapboxgl.Map) => Promise<void>
}

// 東京駅
export const DEFAULT_LOCATION = { latitude: 35.6812362, longitude: 139.7671248 }
export const FLY_DURATION_MS = 2000
export const FLY_ZOOM_LEVEL = 15

export const useMapbox = (args: MapboxHookArgs) => {
  const {
    mapStyle = MAP_STYLES.default,
    latitude,
    longitude,
    initZoom = 15,
    initializeMap,
    onMapClick,
    onMapLoad,
    onStyleLoad,
  } = args
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [center, setCenter] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [style, setStyle] = useState(mapStyle)

  useEffect(() => {
    // 中心座標を設定
    setCenter(
      latitude && longitude ? { latitude, longitude } : DEFAULT_LOCATION
    )
  }, [latitude, longitude])

  useEffect(() => {
    if (!mapRef.current || !center) return

    const initMap = new mapboxgl.Map({
      container: mapRef.current,
      style: mapStyle,
      center: [center.longitude, center.latitude],
      zoom: initZoom,
    })

    initializeMap && initializeMap(initMap)

    // イベントリスナーの設定
    initMap.on('click', (e) => onMapClick && onMapClick(initMap, e))
    initMap.on('load', () => onMapLoad && onMapLoad(initMap))
    initMap.on('style.load', () => onStyleLoad && onStyleLoad(initMap))

    setMap(initMap)

    return () => initMap.remove()
  }, [center, mapRef.current])

  const toggleStyle = () => {
    if (!map) return
    const newStyle =
      style === MAP_STYLES.default ? MAP_STYLES.satellite : MAP_STYLES.default

    map.setStyle(newStyle)
    setStyle(newStyle)
  }

  const flyToLocation = ({
    latitude,
    longitude,
    zoom = FLY_ZOOM_LEVEL,
    duration = FLY_DURATION_MS,
  }: {
    latitude?: number
    longitude?: number
    zoom?: number
    duration?: number
  }) => {
    if (!map || !latitude || !longitude) return

    map.flyTo({ center: [longitude, latitude], zoom, duration, bearing: 0 })
  }

  return { mapRef, map, toggleStyle, flyToLocation }
}
