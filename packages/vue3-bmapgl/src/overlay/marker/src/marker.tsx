import { defineComponent } from 'vue'
import { markerProps } from './marker-props'

export default defineComponent({
  name: 'Marker',
  props: markerProps,
  setup() {
    return () => <></>
  },
})
