<script setup lang="ts">
import { BConfigProvider, BMap } from '@spuermomonga/vue3-bmapgl'

const ak = import.meta.env.VITE_BMAP_AK
</script>

<template>
  <BConfigProvider :ak="ak">
    <BMap style="width: 100%;height: 100%;" />
  </BConfigProvider>
</template>
