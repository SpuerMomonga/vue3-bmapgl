import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

export type GetTilesUrlFn = (tile: { x: number, y: number, z: number }, boundRange: any, cb: (image: string | HTMLImageElement | HTMLCanvasElement) => void) => void

export const tileLayerProps = {
  visible: {
    type: Boolean,
    default: true,
  },
  transform: Object as PropType<{ source: string, target: string }>,
  png8: Boolean,
  height: Number,
  retry: {
    type: Boolean,
    default: undefined,
  },
  retryTime: Number,
  transparentPng: {
    type: Boolean,
    default: true,
  },
  dataType: Number,
  spanLevel: {
    type: Number,
    default: 0,
  },
  tileTypeName: String,
  cacheSize: {
    type: Number,
    default: 256,
  },
  customLayer: {
    type: Boolean,
    default: undefined,
  },
  clipTile: {
    type: Boolean,
    default: undefined,
  },
  isTop: Boolean,
  opacity: {
    type: Number,
    default: 1,
  },
  isLowText: Boolean,
  boundary: Array as PropType<string[] | string>,
  showRegion: String,
  useThumbData: Boolean,
  zIndex: Number,
  zIndexTop: Boolean,
  tileUrlTemplate: String,
  getTilesUrl: Function as PropType<GetTilesUrlFn>,
} as const

export type TileLayerProps = ExtractPublicPropTypes<typeof tileLayerProps>
