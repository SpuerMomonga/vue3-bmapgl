import type { Ref } from 'vue'

export type LoadStatus = 'pending' | 'loaded' | 'failed' | 'notload'

export interface GlobalMapConfig {
  minZoom?: number
  maxZoom?: number
  showControls?: boolean
}

export interface ConfigProviderInjection {
  statusRef: Ref<LoadStatus>
  mapConfigRef: Ref<GlobalMapConfig>
}
