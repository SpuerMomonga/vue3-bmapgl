import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useMapInstance } from '../../../_mixins'
import { customControlProps } from './custom-props'

export default defineComponent({
  name: 'CustomControl',
  props: customControlProps,
  setup(props, { attrs, slots }) {
    const mapInstance = useMapInstance()

    const controlContentRef = ref<HTMLDivElement>()

    let control: BMapGL.Control | null = null

    onMounted(() => {
      const { offset, anchor, visible } = props
      control = new BMapGL.Control()
      control.defaultAnchor = (window as any)[anchor]
      control.defaultOffset = new BMapGL.Size(offset.x, offset.y)
      control.initialize = (_map: BMapGL.Map) => {
        return _map.getContainer().appendChild(controlContentRef.value as Node) as HTMLElement
      }
      visible && mapInstance().addControl(control)
      watch(
        () => props.visible,
        (n) => {
          if (control)
            mapInstance()[n ? 'addControl' : 'removeControl'](control)
        },
      )
    })

    onUnmounted(() => {
      if (control) {
        mapInstance().removeControl(control)
      }
    })

    return () => (
      <div style="display: none">
        <div ref={controlContentRef} {...attrs}>{slots.default?.()}</div>
      </div>
    )
  },
})
