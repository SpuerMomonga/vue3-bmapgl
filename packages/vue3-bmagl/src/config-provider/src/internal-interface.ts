import type { Ref } from 'vue'

export type LoadStatus = 'pending' | 'loaded' | 'failed' | 'notload'

export interface GlobalMapConfig {
  minZoom?: number
  maxZoom?: number
  zoom?: number
  showControls?: boolean
  center?: BMapGL.Point | string | [number, number]
}

export interface ConfigProviderInjection {
  mergedStatusRef: Ref<LoadStatus>
  mergedMapSetRef: Ref<GlobalMapConfig>
}
