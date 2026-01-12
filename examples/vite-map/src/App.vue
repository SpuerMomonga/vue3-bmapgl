<script setup lang="ts">
import type { GetTilesUrlFn } from '@spuermomonga/vue3-bmapgl'
import { BConfigProvider, BCustomControl, BMap, BTileLayer } from '@spuermomonga/vue3-bmapgl'

const ak = import.meta.env.VITE_BMAP_AK

const getTile: GetTilesUrlFn = (info, cb) => {
  console.log('------->')
  const imgs = info.map((value) => {
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
    ctx.fillText(`${value.tile.x},${value.tile.y},${value.tile.z}`, centerX, centerY)
    return { img: canvas.toDataURL(), key: value.key }
  })
  cb(imgs)
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
      <BCustomControl>
        文字
      </BCustomControl>
      <BTileLayer :get-tiles-url="getTile" />
    </BMap>
  </BConfigProvider>
</template>
