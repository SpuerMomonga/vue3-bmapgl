import type { ExtractPropTypes, PropType } from 'vue'

export const configProviderProps = {
  ak: String,
  apiUrl: String,
  plugins: Array as PropType<string[]>,
  zoom: Number,
  minZoom: Number,
  maxZoom: Number,
  showControls: Boolean,
  center: Object as PropType<BMapGL.Point | string | [number, number]>,
} as const

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>
