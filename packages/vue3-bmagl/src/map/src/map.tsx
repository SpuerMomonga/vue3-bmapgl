import { defineComponent, nextTick, onUnmounted, ref, watchEffect } from 'vue'
import { useConfig } from '../../_mixins'
import { mapProps } from './map-props'
import styles from './style/map.module.css'

export default defineComponent({
  name: 'Map',
  props: mapProps,
  setup(props) {
    const { mergedMapSetRef, mergedStatusRef } = useConfig(props)

    const contentRef = ref<HTMLDivElement | null>()
    let map: BMapGL.Map | null = null

    const setCenterAndZoom = (center: BMapGL.Point | string | [number, number]) => {
      if (typeof center === 'string') {
        map!.centerAndZoom(center, mergedMapSetRef.value.zoom!)
      } else if (Array.isArray(center)) {
        map!.centerAndZoom(new BMapGL.Point(center[0], center[1]), mergedMapSetRef.value.zoom!)
      } else {
        map!.centerAndZoom(new BMapGL.Point(center.lng, center.lat), mergedMapSetRef.value.zoom!)
      }
    }

    const init = () => {
      const { center, maxZoom, minZoom } = mergedMapSetRef.value
      map = new BMapGL.Map(contentRef.value!, {
        maxZoom,
        minZoom,
      })
      setCenterAndZoom(center!)
    }

    watchEffect(() => {
      if (mergedStatusRef?.value === 'loaded') {
        nextTick(init)
      }
    })

    onUnmounted(() => {
      if (map) {
        try {
          map.destroy()
        } catch (error: any) {
          console.error(`[Vue3 BMapGL]: ${error.message}`)
        }
      }
    })

    return () => (
      <div ref={contentRef} class={[styles['b-map-content'], props.class]}>
        {mergedStatusRef?.value === 'pending' && <div>map loading...</div>}
        {mergedStatusRef?.value === 'failed' && <div>map failed</div>}
      </div>
    )
  },
})
