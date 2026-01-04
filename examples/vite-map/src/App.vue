<script setup lang="ts">
  import { BConfigProvider } from 'vue3-bmapgl'

  const ak = import.meta.env.VITE_BMAP_AK
</script>

<template>
  <BConfigProvider :ak="ak">
    <div>文字</div>
  </BConfigProvider>
</template>

<style scoped>
</style>
