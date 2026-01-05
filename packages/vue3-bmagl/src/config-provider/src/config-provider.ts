import type { LoadStatus } from './internal-interface'
import { computed, defineComponent, provide, ref, renderSlot } from 'vue'
import { loader } from '../../_utils'
import { configProviderProps } from './config-provider-props'
import { configProviderInjectionKey } from './constants'

export default defineComponent({
  name: 'ConfigProvider',
  props: configProviderProps,
  setup(props, { slots }) {
    const mergedStatusRef = ref<LoadStatus>('notload')

    const scriptKey = props.apiUrl ? `_initBMap_` : `_initBMap_${props.ak}`
    const src = props.apiUrl
      ? `${props.apiUrl.replace(/&$/, '')}&callback=${scriptKey}`
      : `//api.map.baidu.com/api?type=webgl&v=1.0&ak=${props.ak}&callback=${scriptKey}`

    mergedStatusRef.value = 'pending'
    loader({ key: scriptKey, src }).then(() => {
      mergedStatusRef.value = 'loaded'
    }).catch(() => {
      mergedStatusRef.value = 'failed'
    })

    const mergedMapSetRef = computed(() => {
      const { mapConfig } = props
      return mapConfig ?? {}
    })

    provide(configProviderInjectionKey, { mergedStatusRef, mergedMapSetRef })

    return () => renderSlot(slots, 'default')
  },
})
