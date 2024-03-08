<script setup lang="ts">
import FileOperate from './components/FileOperate/FileOperate.vue';

const typeObj = {
    label: '图片',
    name: 'images',
    choice_type: 'image/gif, image/jpg, image/png, image/jpeg, image/svg, image/svg+xml',
    remarkStr:
      '支持上传25MB以内的jpg、jpeg、png、gif、bmp格式图片，图像长度、宽度<3万像素和长宽像素相乘<2.5亿像素，一次最多上传10个文件'
  }
</script>

<template>
   <div style="width: 1200px;display: flex;">
      <FileOperate  :typeobj="typeObj"  />
   
   </div>
</template>

<style scoped>

</style>
