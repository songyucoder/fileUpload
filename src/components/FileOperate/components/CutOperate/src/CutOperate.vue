<template>
  <div class="home">
    <!--         imagePath="http://wechatapppro-1252524126.file.myqcloud.com/appuayqwk0a1436/image/kraavusq0x4j.png" -->
    <div>当前的裁剪比例:</div>
    <!-- props.fileobj.url -->
    <div style="padding-top: 20px;"
      ><CutImage :imagePath="fileobj.url" fileType="blob" @save="onSave" @cancel="onCancel"
    /></div>
  </div>
</template>

<script setup lang="ts">
import CutImage from '../../CutImage'
const emit = defineEmits(['save', 'cancel'])
const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  fileobj: {
    type: Object,
    default: null
  },
  // eslint-disable-next-line vue/prop-name-casing
  upload_type: {
    type: Object,
    default: null
  }
})
console.log(props.fileobj)
const onSave = (res: any) => {
  console.log(res)
  emit('save', res)
  if (typeof res === 'string') {
  } else {
  }
}

const onCancel = () => {
  emit('cancel')
}
</script>
