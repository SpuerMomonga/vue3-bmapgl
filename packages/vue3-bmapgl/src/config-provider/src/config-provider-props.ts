import type { ExtractPropTypes, PropType } from 'vue'

export interface MapConfig {
  minZoom?: number
  maxZoom?: number
  zoom?: number
  showControls?: boolean
  center?: BMapGL.Point | string | [number, number]
  enableScrollWheelZoom?: boolean
}

export const configProviderProps = {
  ak: String,
  apiUrl: String,
  plugins: Array as PropType<string[]>,
  mapConfig: Object as PropType<MapConfig>,
} as const

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>
