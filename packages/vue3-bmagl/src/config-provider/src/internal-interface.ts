import type { Ref } from 'vue'
import type { MapConfig } from './config-provider-props'

export type LoadStatus = 'pending' | 'loaded' | 'failed' | 'notload'

export interface ConfigProviderInjection {
  mergedStatusRef: Ref<LoadStatus>
  mergedMapSetRef: Ref<MapConfig>
}
