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

    const removeInfoWindow = () => {
      if (infoWindow) {
        infoWindow.hide?.()
        mapInstance().removeOverlay(infoWindow)
        infoWindow = null
      }
    }

    const redraw = () => {
      infoWindow?.redraw()
      Array.prototype.forEach.call(infoWindowContentRef.value?.querySelectorAll('img') ?? [], (imgEl) => {
        imgEl.onload = () => {
          infoWindow?.redraw()
        }
      })
    }

    const createInfoWindow = () => {
      const { width, height, title, maxWidth, offset, enableAutoPan, position, enableCloseOnClick } = props
      infoWindow = new BMapGL.InfoWindow(infoWindowContentRef.value!, {
        width,
        height,
        title,
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
      const point = Array.isArray(position) ? new BMapGL.Point(position[0], position[1]) : position
      ;(mapInstance() as any)?.openInfoWindow(infoWindow, point)
      redraw()
    }

    const setPosition = (position: any) => {
      const point = Array.isArray(position)
        ? new BMapGL.Point(position[0], position[1])
        : position
      ;(infoWindow as any)?.setPosition(point)
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

    const setTitle = (title?: string) => {
      infoWindow?.setTitle(title!)
    }

    const bindObserver = () => {
      const MutationObserver = window.MutationObserver
      if (!MutationObserver) {
        return
      }
      new MutationObserver(() => {
        infoWindow?.redraw()
      }).observe(infoWindowContentRef.value!, { attributes: true, childList: true, characterData: true, subtree: true })
    }

    const startWatchProps = () => {
      watch(() => props.position, setPosition, { deep: true })
      watch(() => props.width, setWidth)
      watch(() => props.height, setHeight)
      watch(() => props.title, setTitle)
      watch(() => props.show, () => props.show ? createInfoWindow() : removeInfoWindow())
    }

    const init = () => {
      if (props.show) {
        createInfoWindow()
      }

      bindObserver()

      startWatchProps()
    }

    onMounted(() => {
      if (!infoWindowContentRef.value) {
        nextTick(() => init())
      } else {
        init()
      }
    })

    onUpdated(() => {
      if (infoWindow && infoWindow.isOpen()) {
        setContent(infoWindowContentRef.value ?? '')
        redraw()
      }
    })

    onUnmounted(() => {
      if (infoWindow) {
        removeInfoWindow()
      }
    })

    return () => (
      <div style="display: none">
        <div ref={infoWindowContentRef} {...attrs}>{slots.default?.()}</div>
      </div>
    )
  },
})
