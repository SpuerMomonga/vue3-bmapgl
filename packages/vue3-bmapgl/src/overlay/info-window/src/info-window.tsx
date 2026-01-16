import { computed, defineComponent, nextTick, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { infoWindowProps } from './info-window-props'

export default defineComponent({
  name: 'InfoWindow',
  props: infoWindowProps,
  setup(props, { slots, attrs }) {
    const mapInstance = useMapInstance()

    const infoWindowContentRef = ref<HTMLDivElement>()

    let infoWindow: BMapGL.InfoWindow | null = null

    const visible = computed({
      get: () => props.show,
      set: value => props['onUpdate:show']?.(value),
    })

    const openInfoWindow = () => {
      const { position } = props
      if (!position || !infoWindow)
        return
      const point = Array.isArray(position) ? new BMapGL.Point(position[0], position[1]) : position
      ;(mapInstance() as any).openInfoWindow(infoWindow, point)
      visible.value = true
    }

    const closeInfoWindow = () => {
      if (!infoWindow)
        return
      infoWindow?.hide?.()
      visible.value = false
    }

    const setPosition = (position?: BMapGL.Point | [number, number]) => {
      openInfoWindow()
      const point = Array.isArray(position) ? new BMapGL.Point(position[0], position[1]) : position
      ;(infoWindow as any)?.setPosition(point)
      if (!visible.value)
        closeInfoWindow()
    }

    const redraw = () => {
      infoWindow?.redraw()
      Array.prototype.forEach.call(infoWindowContentRef.value?.querySelectorAll('img') ?? [], (imgEl) => {
        imgEl.onload = () => {
          infoWindow?.redraw()
        }
      })
    }

    const setContent = (content: string | HTMLElement) => {
      infoWindow?.setContent(content)
    }

    const setWidth = (width: number) => {
      infoWindow?.setWidth(width)
    }

    const setHeight = (height: number) => {
      infoWindow?.setHeight(height)
    }

    const startWatchProps = () => {
      watch(() => props.position, setPosition, { deep: true })
      watch(() => props.width, setWidth)
      watch(() => props.height, setHeight)
      watch(() => props.show, () => props.show ? openInfoWindow() : closeInfoWindow())
    }

    onMounted(() => {
      const { width, height, maxWidth, offset, enableAutoPan, enableCloseOnClick } = props
      infoWindow = new BMapGL.InfoWindow(infoWindowContentRef.value!, {
        width,
        height,
        maxWidth,
        offset: new BMapGL.Size(offset.x, offset.y),
        enableAutoPan,
        enableCloseOnClick,
      })
      infoWindow.addEventListener('close', () => {
        if (props.show)
          visible.value = false
      })
      infoWindow.addEventListener('open', () => {
        if (!props.show)
          visible.value = true
      })
      mapInstance().addOverlay(infoWindow)
      redraw()

      if (props.show) {
        nextTick(() => {
          openInfoWindow()
          nextTick(() => {
            if (infoWindow && '_visible' in infoWindow) {
              !infoWindow._visible && (visible.value = false)
            } else {
              !infoWindow?.isOpen() && (visible.value = false)
            }
          })
        })
      }

      startWatchProps()
    })

    onUpdated(() => {
      if (infoWindow && infoWindow.isOpen()) {
        setContent(infoWindowContentRef.value ?? '')
      }
    })

    onUnmounted(() => {
      if (infoWindow) {
        mapInstance().removeOverlay(infoWindow)
        redraw()
      }
    })

    return () => (
      <div style="display: none">
        <div ref={infoWindowContentRef} {...attrs}>{slots.default?.()}</div>
      </div>
    )
  },
})
