import { defineComponent, onUnmounted, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { tileLayerProps } from './tile-props'

export default defineComponent({
  name: 'TileLayer',
  props: tileLayerProps,
  setup(props) {
    const mapInstance = useMapInstance()

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

    const addTileLayer = () => {
      const { getTilesUrl } = props
      if (!layer)
        return
      if (getTilesUrl) {
        mapInstance().addTileLayer(layer)
        ;(layer as any).loadRasterTileData = function (tileInfo: any, callback: any) {
          const key = this.getTileKey(tileInfo)

          const handleImageLoad = (image: HTMLImageElement) => {
            (image as any).tileInfo = tileInfo
            callback && callback(image, key)
          }

          const handleError = () => callback && callback(null, key)

          const box = (BMapGL as any).Projection.tileToBoundRange({
            col: tileInfo.col,
            row: tileInfo.row,
            baseTileSize: tileInfo.baseTileSize,
            zoom: tileInfo.zoom,
          })

          getTilesUrl({ x: tileInfo.col, y: tileInfo.row, z: tileInfo.zoom }, box, (img) => {
            if (typeof img === 'string' || img instanceof HTMLCanvasElement) {
              const image = new Image()
              image.crossOrigin = 'anonymous'

              image.onload = () => handleImageLoad(image)
              image.onerror = handleError

              image.src = typeof img === 'string' ? img : img.toDataURL()
            } else if (img instanceof HTMLImageElement) {
              handleImageLoad(img)
            } else {
              handleError()
            }
          })
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
