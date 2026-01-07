import type { ExtractPropTypes, PropType } from 'vue'

export interface MapConfig {
  minZoom?: number
  maxZoom?: number
  zoom?: number
  heading?: number
  // showControls?: boolean
  center?: BMapGL.Point | string | [number, number]
  enableScrollWheelZoom?: boolean
  enableDragging?: boolean
  tilt?: number
  enableTilt?: boolean
  mapType?: BMapGL.MapTypeId
  enableAutoResize?: boolean
  enableTiltGestures?: boolean
  enableRotate?: boolean
  enableRotateGestures?: boolean
  displayOptions?: BMapGL.displayOptions
}

export const configProviderProps = {
  ak: String,
  apiUrl: String,
  plugins: Array as PropType<string[]>,
  mapConfig: Object as PropType<MapConfig>,
} as const

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>
