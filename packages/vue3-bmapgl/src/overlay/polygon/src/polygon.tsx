import { defineComponent, onUnmounted, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { listToMapPoints } from '../../../_utils'
import { polygonProps } from './polygon-props'

export default defineComponent({
  name: 'Polygon',
  props: polygonProps,
  setup: (props) => {
    const mapInstance = useMapInstance()

    let overlay: BMapGL.Polygon | null = null

    const setStrokeColor = (color: string) => {
      overlay && overlay.setStrokeColor(color)
    }

    const startWatchProps = () => {
      watch(() => props.strokeColor, setStrokeColor)
      watch(() => props.visible, (n) => {
        mapInstance()[n ? 'addOverlay' : 'removeOverlay'](overlay!)
      })
    }

    const init = () => {
      const { points, visible, strokeColor, fillColor, strokeWeight, strokeOpacity, fillOpacity, strokeStyle, enableMassClear, enableEditing, enableClicking } = props
      if (!points || !points.length) {
        return
      }
      overlay = new BMapGL.Polygon(listToMapPoints(points), {
        strokeColor,
        fillColor,
        strokeWeight,
        strokeOpacity,
        fillOpacity,
        strokeStyle,
        enableMassClear,
        enableEditing,
        enableClicking,
      })
      visible && mapInstance().addOverlay(overlay)
      startWatchProps()
    }

    init()

    onUnmounted(() => {
      if (overlay) {
        mapInstance().removeOverlay(overlay)
      }
    })

    return () => <></>
  },
})
