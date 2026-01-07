import { inject } from 'vue'
import { mapInjectionKey } from '../map'

export default function useMapInstance() {
  const BMap = inject(mapInjectionKey, null)
  return BMap!.mapInstance
}
