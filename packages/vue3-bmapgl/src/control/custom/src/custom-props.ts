import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

export const customControlProps = {
  anchor: {
    type: String,
    default: 'BMAP_ANCHOR_TOP_RIGHT',
  },
  offset: {
    type: Object as PropType<{ x: number, y: number }>,
    default: { x: 0, y: 0 },
  },
  visible: {
    type: Boolean,
    default: true,
  },
} as const

export type CustomControlProps = ExtractPublicPropTypes<typeof customControlProps>
