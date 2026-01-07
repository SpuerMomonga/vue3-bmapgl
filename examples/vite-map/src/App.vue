<script setup lang="ts">
import type { XyzLayerOptions } from '@spuermomonga/vue3-bmapgl'
import { BConfigProvider, BMap, BXyzLayer } from '@spuermomonga/vue3-bmapgl'

const ak = import.meta.env.VITE_BMAP_AK

const options: XyzLayerOptions = {
  minZoom: 7,
  maxZoom: 23,
  getTile: (info, cb) => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, 256, 256)
    // 设置文字样式
    ctx.font = '24px Arial'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // 画布显示瓦片编号
    const centerX = canvas.width / 2 - 20 // 128
    const centerY = canvas.height / 2 - 20 // 128
    ctx.fillText(`${info.row},${info.col},${info.zoom}`, centerX, centerY)
    cb(canvas.toDataURL())
  },
  useThumbData: true,
}

const mapConfig = {
  displayOptions: {
    building: false,
  },
}
</script>

<template>
  <BConfigProvider :ak="ak" :map-config="mapConfig">
    <BMap enable-scroll-wheel-zoom>
      <BXyzLayer :options="options" />
    </BMap>
  </BConfigProvider>
</template>
