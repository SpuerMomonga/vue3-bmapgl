import type { InjectionKey } from 'vue'
import type { ConfigProviderInjection } from './internal-interface'

export const configProviderInjectionKey: InjectionKey<ConfigProviderInjection> = Symbol('b-config-provider')
