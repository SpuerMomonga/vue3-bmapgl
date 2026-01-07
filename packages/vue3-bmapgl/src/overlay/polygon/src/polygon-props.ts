import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

export const polygonProps = {
  visible: {
    type: Boolean,
    default: true,
  },
  points: {
    type: Array as PropType<string[] | BMapGL.Point[] | number[][]>,
  },
  strokeColor: {
    type: String,
    default: '#000',
  },
  fillColor: {
    type: String,
    default: '#fff',
  },
  strokeWeight: {
    type: Number,
    default: 2,
  },
  strokeOpacity: {
    type: Number,
    default: 1,
  },
  fillOpacity: {
    type: Number,
    default: 0.3,
  },
  strokeStyle: {
    type: String as PropType<'solid' | 'dashed'>,
    default: 'solid',
  },
  enableMassClear: {
    type: Boolean,
    default: true,
  },
  enableEditing: {
    type: Boolean,
    default: false,
  },
  isBoundary: {
    type: Boolean,
  },
  enableClicking: {
    type: Boolean,
    default: true,
  },
} as const

export type PolygonProps = ExtractPublicPropTypes<typeof polygonProps>
