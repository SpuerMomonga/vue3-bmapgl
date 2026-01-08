import type { Ref } from 'vue'
import type { MapConfig } from '../config-provider/src/config-provider-props'
import type { LoadStatus } from '../config-provider/src/internal-interface'
import { computed, inject } from 'vue'
import { configProviderInjectionKey } from '../config-provider'

type UseConfigProps = Readonly<{
  bordered?: boolean
  [key: string]: unknown
}>

export default function useConfig(props: UseConfigProps = {}): {
  mergedStatusRef: Ref<LoadStatus> | undefined
  mergedMapSetRef: Ref<MapConfig>
} {
  const BConfigProvider = inject(configProviderInjectionKey, null)
  return {
    mergedStatusRef: BConfigProvider?.mergedStatusRef,
    mergedMapSetRef: computed(() => {
      const { zoom, center, heading, minZoom, maxZoom, enableScrollWheelZoom, enableDragging, tilt, enableTilt, mapType, enableAutoResize, enableTiltGestures, enableRotate, enableRotateGestures, displayOptions } = props
      return {
        zoom: zoom ?? BConfigProvider?.mergedMapSetRef.value?.zoom ?? 14,
        center: center ?? BConfigProvider?.mergedMapSetRef.value?.center ?? [116.403901, 39.915185],
        heading: heading ?? BConfigProvider?.mergedMapSetRef.value?.heading ?? 0,
        minZoom: minZoom ?? BConfigProvider?.mergedMapSetRef.value?.minZoom ?? 0,
        maxZoom: maxZoom ?? BConfigProvider?.mergedMapSetRef.value?.maxZoom ?? 21,
        enableScrollWheelZoom: enableScrollWheelZoom ?? BConfigProvider?.mergedMapSetRef.value?.enableScrollWheelZoom ?? false,
        enableDragging: enableDragging ?? BConfigProvider?.mergedMapSetRef.value?.enableDragging ?? true,
        tilt: tilt ?? BConfigProvider?.mergedMapSetRef.value?.tilt ?? 0,
        enableTilt: enableTilt ?? BConfigProvider?.mergedMapSetRef.value?.enableTilt ?? false,
        mapType: mapType ?? BConfigProvider?.mergedMapSetRef.value?.mapType ?? 'BMAP_NORMAL_MAP',
        enableAutoResize: enableAutoResize ?? BConfigProvider?.mergedMapSetRef.value?.enableAutoResize ?? true,
        enableTiltGestures: enableTiltGestures ?? BConfigProvider?.mergedMapSetRef.value?.enableTiltGestures ?? false,
        enableRotate: enableRotate ?? BConfigProvider?.mergedMapSetRef.value?.enableRotate ?? false,
        enableRotateGestures: enableRotateGestures ?? BConfigProvider?.mergedMapSetRef.value?.enableRotateGestures ?? false,
        displayOptions: displayOptions ?? BConfigProvider?.mergedMapSetRef.value?.displayOptions,
      } as MapConfig
    }),
  }
}
