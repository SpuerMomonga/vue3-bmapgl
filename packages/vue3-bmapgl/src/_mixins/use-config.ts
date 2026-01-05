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
  const NConfigProvider = inject(configProviderInjectionKey, null)
  return {
    mergedStatusRef: NConfigProvider?.mergedStatusRef,
    mergedMapSetRef: computed(() => {
      const { zoom, center, minZoom, maxZoom } = props
      return {
        zoom: zoom ?? NConfigProvider?.mergedMapSetRef.value?.zoom,
        center: center ?? NConfigProvider?.mergedMapSetRef.value?.center,
        minZoom: minZoom ?? NConfigProvider?.mergedMapSetRef.value?.minZoom,
        maxZoom: maxZoom ?? NConfigProvider?.mergedMapSetRef.value?.maxZoom,
      } as MapConfig
    }),
  }
}
