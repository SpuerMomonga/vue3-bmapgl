import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'

export const mapProps = {
  maxZoom: {
    type: Number,
    default: 21,
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  center: {
    type: Object as PropType<BMapGL.Point | string | [number, number]>,
    default: [116.403901, 39.915185],
  },
  zoom: {
    type: Number,
    default: 14,
  },
  class: String,
} as const

export type MapProps = ExtractPublicPropTypes<typeof mapProps>
