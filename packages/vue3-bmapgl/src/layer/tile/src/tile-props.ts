import type { PropType } from 'vue'
import type { ExtractPublicPropTypes } from '../../../_utils'

export interface Tile {
  x: number
  y: number
  z: number
}

export interface TileImg {
  key: string
  img?: string | HTMLImageElement | HTMLCanvasElement
}

export interface Tiles {
  key: string
  tile: Tile
  boundRange: any
}

export type GetTileUrlFn = (tile: Tile, boundRange: any, cb: (image?: string | HTMLImageElement | HTMLCanvasElement) => void) => void
export type GetTilesUrlFn = (tiles: Tiles[], cb: (values: TileImg[]) => void) => void

export const tileLayerProps = {
  visible: {
    type: Boolean,
    default: true,
  },
  transform: Object as PropType<{ source: string, target: string }>,
  png8: Boolean,
  height: Number,
  retry: {
    type: Boolean,
    default: undefined,
  },
  retryTime: Number,
  transparentPng: {
    type: Boolean,
    default: true,
  },
  dataType: Number,
  spanLevel: {
    type: Number,
    default: 0,
  },
  tileTypeName: String,
  cacheSize: {
    type: Number,
    default: 256,
  },
  customLayer: {
    type: Boolean,
    default: undefined,
  },
  clipTile: {
    type: Boolean,
    default: undefined,
  },
  isTop: Boolean,
  opacity: {
    type: Number,
    default: 1,
  },
  isLowText: Boolean,
  boundary: Array as PropType<string[] | string>,
  showRegion: String,
  useThumbData: Boolean,
  zIndex: Number,
  zIndexTop: Boolean,
  tileUrlTemplate: String,
  getTileUrl: Function as PropType<GetTileUrlFn>,
  getTilesUrl: Function as PropType<GetTilesUrlFn>,
} as const

export type TileLayerProps = ExtractPublicPropTypes<typeof tileLayerProps>
