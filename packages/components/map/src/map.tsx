import { defineComponent, inject } from 'vue'
import { configProviderInjectionKey } from '../../config-provider'
import { mapProps } from './map-props'

export default defineComponent({
  name: 'Map',
  props: mapProps,
  setup(props) {
    // const

    const configProvider = inject(configProviderInjectionKey, null)

    // configProvider?.statusRef.value

    return () => <div></div>
  },
})
