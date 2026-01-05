import type { SlotsType, VNode } from 'vue'
import { defineComponent, nextTick, onUnmounted, ref, watch, watchEffect } from 'vue'
import { useConfig } from '../../_mixins'
import { resolveWrappedSlot } from '../../_utils'
import { mapProps } from './map-props'
import styles from './style/map.module.css'

export interface MapSlots {
  default?: () => VNode[]
  loading?: () => VNode[]
  failed?: () => VNode[]
}

export default defineComponent({
  name: 'Map',
  props: mapProps,
  slots: Object as SlotsType<MapSlots>,
  setup(props, { slots }) {
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

    const setScrollWheelZoom = (enableScrollWheelZoom?: boolean) => {
      enableScrollWheelZoom ? map!.enableScrollWheelZoom() : map!.disableScrollWheelZoom()
    }

    const init = () => {
      const { center, maxZoom, minZoom, enableScrollWheelZoom } = mergedMapSetRef.value
      map = new BMapGL.Map(contentRef.value!, {
        maxZoom,
        minZoom,
      })
      setCenterAndZoom(center!)
      setScrollWheelZoom(enableScrollWheelZoom)
    }

    const startWatchProps = () => {
      watch(() => mergedMapSetRef.value.center!, setCenterAndZoom, { deep: true })
      watch(() => mergedMapSetRef.value.enableScrollWheelZoom, setScrollWheelZoom)
    }

    watch(() => mergedStatusRef?.value, (value) => {
      if (value === 'loaded' && !map) {
        nextTick(init)
        startWatchProps()
      }
    }, { immediate: true })

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
        {mergedStatusRef?.value === 'pending'
          && resolveWrappedSlot(slots.loading, () =>
            (<div class={[styles['b-map-loading']]}>map loading...</div>))}
        {mergedStatusRef?.value === 'failed'
          && resolveWrappedSlot(slots.failed, () =>
            (<div class={[styles['b-map-failed']]}>map failed</div>))}
        {slots.default?.()}
      </div>
    )
  },
})
