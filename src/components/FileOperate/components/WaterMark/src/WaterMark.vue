<script setup lang="ts">
import { reactive } from 'vue'
import {
  ElWatermark,
  ElForm,
  ElFormItem,
  ElInput,
  ElSlider,
  ElSpace,
  ElColorPicker,
  ElInputNumber
} from 'element-plus'
import html2canvas from 'html2canvas'
const props = defineProps({ fileobj: { type: Object, default: null } })
const config = reactive({
  content: '品乐家',
  font: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.15)'
  },
  zIndex: -1,
  rotate: -22,
  gap: [100, 100] as [number, number],
  offset: [] as unknown as [number, number]
})
// 这里面对div 转化成 base64-file文，，可以不使用html2canvas
const savePicEvent = async () => {
  // eslint-disable-next-line
  return html2canvas(document.querySelector('#capture') as HTMLElement, {
    allowTaint: true,
    useCORS: true
  })
}
defineExpose({ savePicEvent })
</script>
<template>
  <div class="wrapper">
    <div class="flex" style="flex-direction: column">
      <h1 style="font-size: 20px;">{{ fileobj.filename }}</h1>
      <div style="max-height: 500px" class="flex items-center">
        <el-watermark
          id="capture"
          class="watermark"
          :content="config.content"
          :font="config.font"
          :z-index="config.zIndex"
          :rotate="config.rotate"
          :gap="config.gap"
          :offset="config.offset"
        >
          <div class="demo">
            <img  :src="props.fileobj.url" alt="示例图片" />
          </div>
        </el-watermark>
      </div>
    </div>

    <el-form class="form" :model="config" label-position="top" label-width="50px">
      <el-form-item label="文字水印">
        <el-input v-model="config.content" />
      </el-form-item>
      <el-form-item label="颜色">
        <el-color-picker v-model="config.font.color" show-alpha />
      </el-form-item>
      <el-form-item label="字体大小">
        <el-slider v-model="config.font.fontSize" />
      </el-form-item>
      <el-form-item label="水印元素层级值">
        <el-slider v-model="config.zIndex" />
      </el-form-item>
      <el-form-item label="水印的旋转角度, 单位 °">
        <el-slider v-model="config.rotate" :min="-180" :max="180" />
      </el-form-item>
      <el-form-item label="水印之间的间距">
        <el-space>
          <el-input-number v-model="config.gap[0]" controls-position="right" />
          <el-input-number v-model="config.gap[1]" controls-position="right" />
        </el-space>
      </el-form-item>
      <el-form-item label="水印从容器左上角的偏移量">
        <el-space>
          <el-input-number
            v-model="config.offset[0]"
            placeholder="offsetLeft"
            controls-position="right"
          />
          <el-input-number
            v-model="config.offset[1]"
            placeholder="offsetTop"
            controls-position="right"
          />
        </el-space>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
}

.watermark {
  display: flex;
  flex: auto;
}

.demo {
  flex: auto;
}

.form {
  width: 330px;
  padding-left: 20px;
  margin-left: 20px;
  border-left: 1px solid #eee;
}

img {
  position: relative;
  z-index: 10;
  width: 100%;
}
</style>
