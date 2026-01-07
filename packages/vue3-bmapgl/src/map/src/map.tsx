import type { SlotsType, VNode } from 'vue'
import { defineComponent, nextTick, onMounted, onUnmounted, provide, ref, watch, watchEffect } from 'vue'
import { useConfig } from '../../_mixins'
import { resolveWrappedSlot } from '../../_utils'
import { mapInjectionKey } from './constants'
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
    const initd = ref(false)

    provide(mapInjectionKey, { mapInstance: () => map! })

    const setCenterAndZoom = (center: BMapGL.Point | string | [number, number]) => {
      if (typeof center === 'string') {
        map?.centerAndZoom(center, mergedMapSetRef.value.zoom!)
      } else if (Array.isArray(center)) {
        map?.centerAndZoom(new BMapGL.Point(center[0], center[1]), mergedMapSetRef.value.zoom!)
      } else {
        map?.centerAndZoom(center, mergedMapSetRef.value.zoom!)
      }
    }

    const setScrollWheelZoom = (enableScrollWheelZoom?: boolean) => {
      enableScrollWheelZoom ? map!.enableScrollWheelZoom() : map!.disableScrollWheelZoom()
    }

    const setDisplayOptions = (displayOptions?: BMapGL.displayOptions) => {
      map?.setDisplayOptions(displayOptions || {})
    }

    const setTilt = (tilt?: number) => {
      map?.setTilt(tilt ?? 0)
    }

    const setHeading = (heading?: number) => {
      map?.setHeading(heading ?? 0)
    }

    const setDragging = (enableDragging?: boolean) => {
      enableDragging ? map!.enableDragging() : map!.disableDragging()
    }

    const setMapType = (mapType?: BMapGL.MapTypeId) => {
      window[mapType as any] !== undefined && map!.setMapType(window[mapType as any] as any)
    }

    const initMapOptions = () => {
      const { center, heading, enableScrollWheelZoom, tilt, enableDragging } = mergedMapSetRef.value
      setHeading(heading)
      setCenterAndZoom(center!)
      setScrollWheelZoom(enableScrollWheelZoom)
      setTilt(tilt)
      setDragging(enableDragging)
    }

    const startWatchProps = () => {
      watch(() => mergedMapSetRef.value.center!, setCenterAndZoom, { deep: true })
      watch(() => mergedMapSetRef.value.enableScrollWheelZoom, setScrollWheelZoom)
      watch(() => mergedMapSetRef.value.displayOptions, setDisplayOptions)
      watch(() => mergedMapSetRef.value.tilt, setTilt)
      watch(() => mergedMapSetRef.value.heading, setHeading)
      watch(() => mergedMapSetRef.value.enableDragging, setDragging)
      watch(() => mergedMapSetRef.value.mapType, setMapType)
    }

    const init = () => {
      const { maxZoom, minZoom, enableTilt, mapType, enableAutoResize, enableTiltGestures, enableRotate, enableRotateGestures, displayOptions } = mergedMapSetRef.value
      map = new BMapGL.Map(contentRef.value!, {
        maxZoom,
        minZoom,
        enableTilt,
        mapType: window[mapType as any] as any,
        enableAutoResize,
        enableTiltGestures,
        enableRotate,
        enableRotateGestures,
        displayOptions,
      })
      const { onInitd } = props
      initMapOptions()
      startWatchProps()
      onInitd?.({ map: map! })
      initd.value = true
    }

    onMounted(() => {
      watchEffect(() => {
        if (mergedStatusRef?.value === 'loaded' && !initd.value) {
          nextTick(init)
        }
      })
    })

    onUnmounted(() => {
      if (map) {
        try {
          map?.destroy()
        } catch (error: any) {
          console.error(`[Vue3 BMapGL]: ${error.message}`)
        }
      }
    })

    return () => (
      <div class={[[styles['b-map']], props.class]}>
        <div ref={contentRef} class={[styles['b-map-content'], props.contentClass]}>
          {mergedStatusRef?.value === 'pending'
            && resolveWrappedSlot(slots.loading, () =>
              (<div class={[styles['b-map-loading']]}>map loading...</div>))}
          {mergedStatusRef?.value === 'failed'
            && resolveWrappedSlot(slots.failed, () =>
              (<div class={[styles['b-map-failed']]}>map failed</div>))}
        </div>
        {initd.value && slots.default?.()}
      </div>
    )
  },
})
