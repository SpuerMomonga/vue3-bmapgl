import { defineComponent, onUnmounted, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { xyzLayerProps } from './xyz-props'

export default defineComponent({
  name: 'XyzLayer',
  props: xyzLayerProps,
  setup(props) {
    const mapInstance = useMapInstance()

    let layer: BMapGL.XYZLayer | null = null

    const setZIndex = (zIndex: number) => {
      layer?.setZIndex(zIndex)
    }

    const setBoundary = (boundary?: string[]) => {
      boundary && !boundary.length ? layer?.addBoundary(boundary) : layer?.clearBoundary()
    }

    const setZIndexTop = (zIndexTop?: boolean) => {
      zIndexTop && layer?.setZIndexTop()
    }

    const initLayerOptions = () => {
      const { zIndex, zIndexTop } = props
      setZIndex(zIndex)
      setZIndexTop(zIndexTop)
    }

    const startWatchProps = () => {
      watch(() => props.zIndex, setZIndex)
      watch(() => props.boundary, setBoundary)
    }

    const init = () => {
      const { visible, getTile, xTemplate, yTemplate, zTemplate, bTemplate, minZoom, maxZoom, extent, extentCRSIsWGS84, boundary, useThumbData, tms } = props
      layer = new BMapGL.XYZLayer({
        xTemplate,
        yTemplate,
        zTemplate,
        bTemplate,
        minZoom,
        maxZoom,
        extent: extent as any,
        extentCRSIsWGS84,
        boundary,
        useThumbData,
        tms,
      })
      initLayerOptions()
      if (visible) {
        if (getTile) {
          mapInstance().addTileLayer(layer)
          ;(layer as any).loadRasterTileData = function (tileInfo: any, callback: any) {
            const key = this.getTileKey(tileInfo)

            const handleImageLoad = (image: HTMLImageElement) => {
              (image as any).tileInfo = tileInfo
              callback && callback(image, key)
            }

            const handleError = () => callback && callback(null, key)

            const box = (BMapGL as any).XYZProjection.getTileRangeExtent([tileInfo.zoom, tileInfo.col, tileInfo.row])

            getTile({ x: tileInfo.col, y: tileInfo.row, z: tileInfo.zoom }, box, (img) => {
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
      startWatchProps()
    }

    init()

    // const addTileLayer = (layer: BMapGL.XYZLayer) => {
    //   const { getTile } = props.options
    //   if (getTile) {
    //     mapInstance().addTileLayer(layer)
    //     ;(layer as any).loadRasterTileData = function (tileInfo: any, callback: any) {
    //       const key = this.getTileKey(tileInfo)

    //       const handleImageLoad = (image: HTMLImageElement) => {
    //         (image as any).tileInfo = tileInfo
    //         callback && callback(image, key)
    //       }

    //       const handleError = () => callback && callback(null, key)

    //       getTile(tileInfo, (img) => {
    //         if (typeof img === 'string' || img instanceof HTMLCanvasElement) {
    //           const image = new Image()
    //           image.crossOrigin = 'anonymous'

    //           image.onload = () => handleImageLoad(image)
    //           image.onerror = handleError

    //           image.src = typeof img === 'string' ? img : img.toDataURL()
    //         } else if (img instanceof HTMLImageElement) {
    //           handleImageLoad(img)
    //         } else {
    //           handleError()
    //         }
    //       })
    //     }
    //   } else {
    //     mapInstance().addTileLayer(layer)
    //   }
    // }

    // const removeTileLayer = (layer: BMapGL.XYZLayer) => {
    //   mapInstance().removeTileLayer(layer)
    // }

    // const createLayer = () => {
    //   if (layer) {
    //     removeTileLayer(layer)
    //   }
    //   const { getTile, ...retProps } = props
    //   layer = new BMapGL.XYZLayer(retProps)
    //   addTileLayer(layer)
    // }

    // props.visible && createLayer()

    // watch(() => props.visible, n => layer && (n ? addTileLayer(layer) : removeTileLayer(layer)))
    // watch(() => props.options, () => createLayer())

    onUnmounted(() => {
      if (layer) {
        mapInstance().removeTileLayer(layer)
      }
    })

    return () => <></>
  },
})
