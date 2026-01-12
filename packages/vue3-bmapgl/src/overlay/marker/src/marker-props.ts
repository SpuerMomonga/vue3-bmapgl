import type { ExtractPublicPropTypes } from '../../../_utils'

export const markerProps = {
  visible: {
    type: Boolean,
    default: true,
  },
} as const

export type MarkerProps = ExtractPublicPropTypes<typeof markerProps>
