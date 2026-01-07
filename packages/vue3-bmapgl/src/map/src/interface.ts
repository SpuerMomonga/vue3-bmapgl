export type onInitd = (value: { map: BMapGL.Map }) => void

export interface MapInjection {
  mapInstance: () => BMapGL.Map
}
