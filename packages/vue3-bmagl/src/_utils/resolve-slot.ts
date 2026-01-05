import type { Slot, VNodeArrayChildren, VNodeChild } from 'vue'
import { Fragment, isVNode } from 'vue'

export function ensureValidVNode(
  vnodes: VNodeArrayChildren,
): VNodeArrayChildren | null {
  return vnodes.some((child) => {
    if (!isVNode(child)) {
      return true
    }
    if (child.type === Comment) {
      return false
    }
    if (
      child.type === Fragment
      && !ensureValidVNode(child.children as VNodeArrayChildren)
    ) {
      return false
    }
    return true
  })
    ? vnodes
    : null
}

export function resolveWrappedSlot(
  slot: Slot | undefined,
  wrapper: (children: VNodeArrayChildren | null) => VNodeChild,
): VNodeChild {
  const children = slot && ensureValidVNode(slot())
  return wrapper(children || null)
}
