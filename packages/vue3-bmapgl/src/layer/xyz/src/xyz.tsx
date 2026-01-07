import { defineComponent, onUnmounted, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { xyzLayerProps } from './xyz-props'

export default defineComponent({
  name: 'XyzLayer',
  props: xyzLayerProps,
  setup(props) {
    const mapInstance = useMapInstance()

    let layer: BMapGL.XYZLayer | null = null

    const addTileLayer = (layer: BMapGL.XYZLayer) => {
      const { getTile } = props.options
      if (getTile) {
        mapInstance().addTileLayer(layer)
        ;(layer as any).loadRasterTileData = function (tileInfo: any, callback: any) {
          const key = this.getTileKey(tileInfo)

          const handleImageLoad = (image: HTMLImageElement) => {
            (image as any).tileInfo = tileInfo
            callback && callback(image, key)
          }

          const handleError = () => callback && callback(null, key)

          getTile(tileInfo, (img) => {
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

    const removeTileLayer = (layer: BMapGL.XYZLayer) => {
      mapInstance().removeTileLayer(layer)
    }

    const createLayer = () => {
      if (layer) {
        removeTileLayer(layer)
      }
      const { getTile, ...retProps } = props.options
      layer = new BMapGL.XYZLayer(retProps)
      addTileLayer(layer)
    }

    props.visible && createLayer()

    watch(() => props.visible, n => layer && (n ? addTileLayer(layer) : removeTileLayer(layer)))
    watch(() => props.options, () => createLayer())

    onUnmounted(() => {
      if (layer) {
        mapInstance().removeTileLayer(layer)
      }
    })

    return () => <></>
  },
})
