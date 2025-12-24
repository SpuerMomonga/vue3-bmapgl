import type { LoadStatus } from './internal-interface'
import { loader } from '@vue3-bmapgl/utils'
import { computed, defineComponent, provide, ref, renderSlot } from 'vue'
import { configProviderProps } from './config-provider-props'
import { configProviderInjectionKey } from './constants'

const ConfigProvider = defineComponent({
  name: 'ConfigProvider',
  props: configProviderProps,
  setup(props, { slots }) {
    const statusRef = ref<LoadStatus>('notload')

    const scriptKey = props.apiUrl ? `_initBMap_` : `_initBMap_${props.ak}`
    const src = props.apiUrl
      ? `${props.apiUrl.replace(/&$/, '')}&callback=${scriptKey}`
      : `//api.map.baidu.com/api?type=webgl&v=1.0&ak=${props.ak}&callback=${scriptKey}`

    statusRef.value = 'pending'
    loader({ key: scriptKey, src }).then(() => {
      statusRef.value = 'loaded'
    }).catch(() => {
      statusRef.value = 'failed'
    })

    const mapConfigRef = computed(() => {
      const { minZoom, maxZoom, showControls } = props
      return { minZoom, maxZoom, showControls }
    })

    provide(configProviderInjectionKey, { statusRef, mapConfigRef })

    return () => renderSlot(slots, 'default')
  },
})

export default ConfigProvider
