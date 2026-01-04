import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../_utils'

export const mapProps = {
  center: Array as PropType<number[]>,
} as const

export type MapProps = ExtractPublicPropTypes<typeof mapProps>
