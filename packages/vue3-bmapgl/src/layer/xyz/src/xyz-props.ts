import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

// type TemplateFn = (x: number, y: number, z: number) => number

export interface XyzLayerOptions extends BMapGL.XYZLayerOptions {
  getTile?: (info: any, cb: (image: string | HTMLImageElement | HTMLCanvasElement) => void) => void
}

export const xyzLayerProps = {
  visible: {
    type: Boolean,
    default: true,
  },
  options: {
    type: Object as PropType<XyzLayerOptions>,
    default: {},
  },
} as const

export type XyzLayerProps = ExtractPublicPropTypes<typeof xyzLayerProps>
