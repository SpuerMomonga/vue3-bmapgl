import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

export interface Box {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

type TemplateFn = (x: number, y: number, z: number) => number
type BTemplateFn = (x: number, y: number, z: number) => string
type GetTile = (info: any, box: Box, cb: (image: string | HTMLImageElement | HTMLCanvasElement) => void) => void

export const xyzLayerProps = {
  visible: {
    type: Boolean,
    default: true,
  },
  getTile: {
    type: Function as PropType<GetTile>,
  },
  useThumbData: {
    type: Boolean,
    default: false,
  },
  xTemplate: {
    type: Function as PropType<TemplateFn>,
  },
  yTemplate: {
    type: Function as PropType<TemplateFn>,
  },
  zTemplate: {
    type: Function as PropType<TemplateFn>,
  },
  bTemplate: {
    type: Function as PropType<BTemplateFn>,
  },
  minZoom: {
    type: Number,
    default: 3,
  },
  maxZoom: {
    type: Number,
    default: 23,
  },
  extent: {
    type: Array as PropType<number[]>,
  },
  extentCRSIsWGS84: {
    type: Boolean,
    default: false,
  },
  boundary: {
    type: Array as PropType<string[]>,
  },
  zIndex: {
    type: Number,
    default: 1,
  },
  zIndexTop: {
    type: Boolean,
    default: false,
  },
  tms: {
    type: Boolean,
    default: false,
  },
} as const

export type XyzLayerProps = ExtractPublicPropTypes<typeof xyzLayerProps>
