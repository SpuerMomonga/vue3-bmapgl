import type { Tiles } from './tile-props'
import { defineComponent, onUnmounted, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { tileLayerProps } from './tile-props'

interface TileRequest extends Partial<Tiles> {
  cb: any
  tileInfo: any
}

export default defineComponent({
  name: 'TileLayer',
  props: tileLayerProps,
  setup(props) {
    const mapInstance = useMapInstance()

    let requestQueue: TileRequest[] = []

    let batchTimer: number

    let layer: BMapGL.TileLayer | null = null

    const setZIndex = (zIndex?: number) => {
      (layer as any)?.setZIndex(zIndex)
    }

    const setBoundary = (boundary?: string[] | string) => {
      boundary ? (layer as any)?.addBoundary(boundary) : (layer as any)?.clearBoundary()
    }

    const setZIndexTop = (zIndexTop?: boolean) => {
      (layer as any)?.setTop(zIndexTop)
    }

    const loadImage = (request: TileRequest, img?: string | HTMLImageElement | HTMLCanvasElement) => {
      const handleLoad = (image: HTMLImageElement) => {
        (image as any).tileInfo = request.tileInfo
        request.cb(image, request.key)
      }

      const handleError = () => request.cb(null, request.key)

      if (typeof img === 'string' || img instanceof HTMLCanvasElement) {
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.onload = () => handleLoad(image)
        image.onerror = handleError
        image.src = typeof img === 'string' ? img : img.toDataURL()
      } else if (img instanceof HTMLImageElement) {
        handleLoad(img)
      } else {
        handleError()
      }
    }

    const processBatch = () => {
      if (requestQueue.length === 0)
        return

      const { getTilesUrl } = props

      const batch = [...requestQueue]
      requestQueue = []

      const tiles = batch.map(({ key, tile, boundRange }) => ({ key, tile, boundRange }))
      getTilesUrl!(tiles as any, (values) => {
        for (const value of values) {
          const index = batch.findIndex(item => item.key === value.key)
          if (index !== -1) {
            const tiles = batch[index]
            loadImage(tiles, value.img)
            batch.splice(index, 1)
          }
        }

        batch.forEach((tiles) => {
          tiles.cb(null, tiles.key)
        })
      })
    }

    const enqueue = (data: TileRequest) => {
      const existing = requestQueue.find(item => item.key === data.key)
      if (existing) {
        existing.cb(null, data.key)
        existing.cb = data.cb
      } else {
        requestQueue.push(data)
      }

      if (batchTimer) {
        clearTimeout(batchTimer)
      }
      batchTimer = setTimeout(() => processBatch(), 50)
    }

    const addTileLayer = () => {
      const { getTileUrl, getTilesUrl } = props
      if (!layer)
        return
      if (getTileUrl) {
        mapInstance().addTileLayer(layer)
        ;(layer as any).loadRasterTileData = function (tileInfo: any, callback: any) {
          const key = this.getTileKey(tileInfo)

          const boundRange = (BMapGL as any).Projection.tileToBoundRange({
            col: tileInfo.col,
            row: tileInfo.row,
            baseTileSize: tileInfo.baseTileSize,
            zoom: tileInfo.zoom,
          })

          getTileUrl({ x: tileInfo.col, y: tileInfo.row, z: tileInfo.zoom }, boundRange, (img) => {
            loadImage({ cb: callback, boundRange, key, tileInfo }, img)
          })
        }
      } else if (getTilesUrl) {
        mapInstance().addTileLayer(layer)
        ;(layer as any).loadRasterTileData = function (tileInfo: any, callback: any) {
          const key = this.getTileKey(tileInfo)

          const tile = { x: tileInfo.col, y: tileInfo.row, z: tileInfo.zoom }
          const boundRange = (BMapGL as any).Projection.tileToBoundRange({
            col: tileInfo.col,
            row: tileInfo.row,
            baseTileSize: tileInfo.baseTileSize,
            zoom: tileInfo.zoom,
          })

          enqueue({ key, tile, boundRange, cb: callback, tileInfo })
        }
      } else {
        mapInstance().addTileLayer(layer)
      }
    }

    const initLayerOptions = () => {
      const { zIndex, boundary } = props
      setBoundary(boundary)
      setZIndex(zIndex)
    }

    const startWatchProps = () => {
      watch(() => props.zIndex, setZIndex)
      watch(() => props.boundary, setBoundary)
      watch(() => props.zIndexTop, setZIndexTop)
      watch(() => props.visible, n => n ? addTileLayer() : mapInstance().removeTileLayer(layer!))
    }

    const init = () => {
      const { visible, transform, png8, height, retry, retryTime, transparentPng, dataType, spanLevel, tileTypeName, cacheSize, customLayer, clipTile, isTop, opacity, isLowText, showRegion, useThumbData, tileUrlTemplate } = props
      layer = new BMapGL.TileLayer({
        transform,
        png8,
        height,
        retry,
        retryTime,
        transparentPng,
        dataType,
        spanLevel,
        tileTypeName,
        cacheSize,
        customLayer,
        clipTile,
        isTop,
        opacity,
        isLowText,
        showRegion,
        useThumbData,
        tileUrlTemplate,
      } as any)
      initLayerOptions()
      visible && addTileLayer()
      startWatchProps()
    }

    init()

    onUnmounted(() => {
      if (layer) {
        mapInstance().removeTileLayer(layer)
      }
    })

    return () => <></>
  },
})
