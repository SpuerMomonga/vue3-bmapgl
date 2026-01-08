<script setup lang="ts">
import { BConfigProvider, BMap, BXyzLayer } from '@spuermomonga/vue3-bmapgl'

const ak = import.meta.env.VITE_BMAP_AK

function getTile(info: any, cb: any) {
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
  ctx.fillText(`${info.x},${info.y},${info.z}`, centerX, centerY)
  cb(canvas.toDataURL())
}

const mapConfig = {
  displayOptions: {
    building: false,
  },
  center: [106.71, 26.60],
}
</script>

<template>
  <BConfigProvider :ak="ak" :map-config="mapConfig">
    <BMap enable-scroll-wheel-zoom>
      <BXyzLayer :get-tile="getTile" />
    </BMap>
  </BConfigProvider>
</template>
