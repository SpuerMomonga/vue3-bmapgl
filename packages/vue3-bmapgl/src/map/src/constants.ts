import type { InjectionKey } from 'vue'
import type { MapInjection } from './interface'

export const mapInjectionKey: InjectionKey<MapInjection> = Symbol('b-map')
