import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'
import type { onInitd } from './interface'

export const mapProps = {
  maxZoom: {
    type: Number,
    default: 21,
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  heading: {
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
  contentClass: String,
  enableScrollWheelZoom: {
    type: Boolean,
    default: false,
  },
  enableDragging: {
    type: Boolean,
    default: true,
  },
  tilt: {
    type: Number,
    default: 0,
  },
  enableTilt: {
    type: Boolean,
    default: false,
  },
  mapType: {
    type: String as PropType<BMapGL.MapTypeId>,
    default: 'BMAP_NORMAL_MAP',
  },
  enableAutoResize: {
    type: Boolean,
    default: true,
  },
  enableTiltGestures: {
    type: Boolean,
    default: false,
  },
  enableRotate: {
    type: Boolean,
    default: false,
  },
  enableRotateGestures: {
    type: Boolean,
    default: false,
  },
  displayOptions: {
    type: Object as PropType<BMapGL.displayOptions>,
  },
  onInitd: Function as PropType<onInitd>,
} as const

export type MapProps = ExtractPublicPropTypes<typeof mapProps>
