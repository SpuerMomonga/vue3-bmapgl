import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

export const infoWindowProps = {
  'show': Boolean,
  'offset': {
    type: Object as PropType<{ x: number, y: number }>,
    default: { x: 0, y: 0 },
  },
  'width': {
    type: Number,
    default: 0,
  },
  'height': {
    type: Number,
    default: 0,
  },
  'maxWidth': Number,
  'position': Object as PropType<BMapGL.Point | [number, number]>,
  'enableAutoPan': {
    type: Boolean,
    default: true,
  },
  'enableCloseOnClick': {
    type: Boolean,
    default: true,
  },
  'onUpdate:show': Function,
  'title': String,
} as const

export type InfoWindowProps = ExtractPublicPropTypes<typeof infoWindowProps>
