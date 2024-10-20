'use client'

import '@/app/mapStyles.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import * as mapboxgl from 'mapbox-gl'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'

import { LocationError } from '@/app/components'
import { useWatchLocation } from '@/app/lib/geolocation'
import { FLY_DURATION_MS, useMapbox } from '@/app/lib/mapbox/mapboxHooks'

const CurrentLocationMaker = dynamic(
  () => import('@/app/components/CurrentLocationMaker'),
  { loading: () => <div>現在地マーカーを読み込み中...</div> }
)

const C: React.FC = () => {
  const { currentLocation, loading, error } = useWatchLocation()
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  /**
   * 地図の初期化を行います。
   * @param map mapboxgl.Map インスタンス
   */
  const initializeMap = useCallback((map: mapboxgl.Map) => {
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string,
      mapboxgl,
      zoom: 15,
      placeholder: '場所を探す',
      flyTo: { duration: FLY_DURATION_MS },
    })

    map.addControl(geocoder, 'top-left')

    // GeocoderがDOMに追加された後にinput要素を取得
    setTimeout(() => {
      const inputElement = document.querySelector(
        '.mapboxgl-ctrl-geocoder input'
      ) as HTMLInputElement | null

      if (!inputElement) return

      // 入力内容を変換したときも検索を実行させる
      inputElement.addEventListener('compositionend', (e) => {
        if (!(e.target instanceof HTMLInputElement)) return
        geocoder.setInput(e.target.value)
      })
    }, 0)
  }, [])

  /**
   * 地図がクリックされたときの処理。
   * @param mapbox mapboxgl.Map インスタンス
   * @param event 地図上のクリックイベント
   */
  const onMapClick = useCallback(
    async (
      mapbox: mapboxgl.Map,
      event: mapboxgl.MapMouseEvent & mapboxgl.Event
    ) => {
      console.log('地図がクリックされました', event)
    },
    []
  )

  /**
   * 地図のロード完了時の処理。
   */
  const onMapLoad = useCallback(() => {
    setIsMapLoaded(true)
  }, [])

  const { mapRef, map } = useMapbox({
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
    initializeMap,
    onMapClick,
    onMapLoad,
  })

  if (loading) return <div>位置情報を読み込み中...</div>

  return (
    <>
      {error && <LocationError error={error} />}

      <div className='relative h-dvh'>
        {isMapLoaded && map && (
          <CurrentLocationMaker map={map} flyToCurrentLocation />
        )}

        <div ref={mapRef} className='h-full' />
      </div>
    </>
  )
}

export default C
