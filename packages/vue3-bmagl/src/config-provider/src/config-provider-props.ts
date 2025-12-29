import type { ExtractPropTypes, PropType } from 'vue'

export const configProviderProps = {
  ak: String,
  apiUrl: String,
  plugins: Array as PropType<string[]>,
  minZoom: Number,
  maxZoom: Number,
  showControls: Boolean,
} as const

export type ConfigProviderProps = Partial<ExtractPropTypes<typeof configProviderProps>>
