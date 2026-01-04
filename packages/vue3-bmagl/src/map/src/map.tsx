import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue'
import { configProviderInjectionKey } from '../../config-provider'
import { mapProps } from './map-props'

export default defineComponent({
  name: 'Map',
  props: mapProps,
  setup(props) {
    const containerRef = ref<HTMLDivElement | null>()
    let map: BMapGL.Map | null = null

    const configProvider = inject(configProviderInjectionKey, null)

    const init = () => {
      map = new BMapGL.Map(containerRef.value!)
    }

    onMounted(init)

    onUnmounted(() => {
      if (map) {
        try {
          map.destroy()
        } catch (error: any) {
          console.error(`[Vue3 BMapGL]: ${error.message}`)
        }
      }
    })

    return () => <div ref={containerRef}></div>
  },
})
