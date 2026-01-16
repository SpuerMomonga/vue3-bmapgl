import type { PropType } from 'vue'
import type { AnyFunction, ExtractPublicPropTypes } from '../../_utils'
import type { onInitd } from './interface'

export const mapProps = {
  maxZoom: Number,
  minZoom: Number,
  heading: Number,
  center: Object as PropType<BMapGL.Point | string | [number, number]>,
  zoom: Number,
  class: String,
  contentClass: String,
  enableScrollWheelZoom: {
    type: Boolean,
    default: undefined,
  },
  enableDragging: {
    type: Boolean,
    default: undefined,
  },
  tilt: Number,
  enableTilt: {
    type: Boolean,
    default: undefined,
  },
  mapType: String as PropType<BMapGL.MapTypeId>,
  enableAutoResize: {
    type: Boolean,
    default: undefined,
  },
  enableTiltGestures: {
    type: Boolean,
    default: undefined,
  },
  enableRotate: {
    type: Boolean,
    default: undefined,
  },
  enableRotateGestures: {
    type: Boolean,
    default: undefined,
  },
  displayOptions: Object as PropType<BMapGL.displayOptions>,
  onInitd: Function as PropType<onInitd>,
  onClick: Function as PropType<AnyFunction>,
  onDblclick: Function as PropType<AnyFunction>,
  onMousemove: Function as PropType<AnyFunction>,
} as const

export type MapProps = ExtractPublicPropTypes<typeof mapProps>
