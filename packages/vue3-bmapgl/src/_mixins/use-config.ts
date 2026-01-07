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
        zoom: zoom ?? BConfigProvider?.mergedMapSetRef.value?.zoom,
        center: center ?? BConfigProvider?.mergedMapSetRef.value?.center,
        heading: heading ?? BConfigProvider?.mergedMapSetRef.value?.heading,
        minZoom: minZoom ?? BConfigProvider?.mergedMapSetRef.value?.minZoom,
        maxZoom: maxZoom ?? BConfigProvider?.mergedMapSetRef.value?.maxZoom,
        enableScrollWheelZoom: enableScrollWheelZoom ?? BConfigProvider?.mergedMapSetRef.value?.enableScrollWheelZoom,
        enableDragging: enableDragging ?? BConfigProvider?.mergedMapSetRef.value?.enableDragging,
        tilt: tilt ?? BConfigProvider?.mergedMapSetRef.value?.tilt,
        enableTilt: enableTilt ?? BConfigProvider?.mergedMapSetRef.value?.enableTilt,
        mapType: mapType ?? BConfigProvider?.mergedMapSetRef.value?.mapType,
        enableAutoResize: enableAutoResize ?? BConfigProvider?.mergedMapSetRef.value?.enableAutoResize,
        enableTiltGestures: enableTiltGestures ?? BConfigProvider?.mergedMapSetRef.value?.enableTiltGestures,
        enableRotate: enableRotate ?? BConfigProvider?.mergedMapSetRef.value?.enableRotate,
        enableRotateGestures: enableRotateGestures ?? BConfigProvider?.mergedMapSetRef.value?.enableRotateGestures,
        displayOptions: displayOptions ?? BConfigProvider?.mergedMapSetRef.value?.displayOptions,
      } as MapConfig
    }),
  }
}
