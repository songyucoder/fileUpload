<script setup lang="ts">
import { ElTreeSelect } from 'element-plus'
import { is_dark, denImgChangePreview } from '../../../FileTools/tools'
import { ref } from 'vue'
const props = defineProps({
  groups: {
    type: Array as any,
    default: null
  },
  // eslint-disable-next-line vue/prop-name-casing
  default_group_ID: {
    type: Number,
    default: 0
  },
  // eslint-disable-next-line vue/prop-name-casing
  upload_type: {
    type: Object,
    default: null
  }
})
const select_groupID = ref(0)
select_groupID.value = props.default_group_ID
const files_Arr = ref([]) as any
if (select_groupID.value == 0) {
  select_groupID.value = props.groups[0].id
}
const selectFile = (event) => {
  const files = event.target.files
  for (const obj of files) {
    files_Arr.value.push(obj)
  }
  console.log(files_Arr.value)
}

const dragEnter = (event) => {
  event.preventDefault()
}
const dragLeave = (event) => {
  event.preventDefault()
}

const dragOver = (event) => {
  event.preventDefault()
}
const dropFile = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  for (const obj of files) {
    //  判断是否为一个对象
    if (files_Arr.value.some((item) => item.name !== obj.name)) {
      files_Arr.value.push(obj)
    }
  }
  console.log(files)
}
const changeFileToBlob = (item) => {
  console.log(URL.createObjectURL(item))
  return URL.createObjectURL(item)
}
// 进行对象的删除工作
const deleClickEvent = (element) => {
  files_Arr.value = files_Arr.value.filter((item) => item != element)
}
defineExpose({ files_Arr, select_groupID })
</script>

<template>
  <div  style="display: flex;flex-direction: column">
    <div  style="display: flex;flex-direction: row;align-items: center;">
      <div style="margin-right: 10px;">上传分组至:</div>
      <el-tree-select
        v-model="select_groupID"
        :data="props.groups"
        check-strictly
        :render-after-expand="false"
        :props="{ label: 'name', value: 'id' }"
      />
    </div>
    <div
      :style="{ 'background-color': is_dark ? '#000' : '#f0f0f0' }"
      style="height:140px;display: flex;
      border-radius: 1px; flex-direction: column; align-items: center;
      padding: 20px;margin-top: 10px;"
      @dragenter="dragEnter"
      @dragleave="dragLeave"
      @dragover="dragOver"
      @drop="dropFile"
    >
      <div  style="display: flex;width: 90px;height: 90px;"
        ><svg
          style="color: #105cfb"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          data-v-ea893728=""
        >
          <path
            fill="currentColor"
            d="M160 160v704h704V160zm-32-64h768a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H128a32 32 0 0 1-32-32V128a32 32 0 0 1 32-32"
          />
          <path
            fill="currentColor"
            d="M384 288q64 0 64 64t-64 64q-64 0-64-64t64-64M185.408 876.992l-50.816-38.912L350.72 556.032a96 96 0 0 1 134.592-17.856l1.856 1.472 122.88 99.136a32 32 0 0 0 44.992-4.864l216-269.888 49.92 39.936-215.808 269.824-.256.32a96 96 0 0 1-135.04 14.464l-122.88-99.072-.64-.512a32 32 0 0 0-44.8 5.952z"
          /></svg
      ></div>
      <div  style="display: flex;flex-direction: row;margin-top: 10px;"
        ><div>将文件拖拽至此处，或点击</div>
        <div style="position: relative">
          <!--设置input的position为absolute，使其不按文档流排版，并设置其包裹整个布局 -->
          <!-- 设置opactity为0，使input变透明 -->
          <!-- 只接受jpg，gif和png格式 -->
          <input
            id="upload-input"
            multiple="true"
            style="position: absolute; inset: 0; opacity: 0"
            type="file"
            :accept="props.upload_type.choice_type"
            @change="selectFile"
          />
          <!-- 自定义按钮效果 -->
          <div style="margin-left: 5px;">
            <span style="font-size: 14px; font-weight: 600; color: #105cfb">选择文件</span>
          </div>
        </div></div
      >
      <div class="mt-2">{{ props.upload_type.remarkStr }}</div>
    </div>
    <div  style="display: flex;flex-wrap: wrap">
      <div  style="padding: 8px;margin-top: 5px;" v-for="(item, index) in files_Arr" :key="item + index">
        <div
          style="width: 150px; height: 120px; justify-content: center;display: flex;align-items: center;"
          :style="{ 'background-color': is_dark ? '#000' : '#f0f0f0' }"
        >
          <div style="display: flex;">
            <img
              v-if="props.upload_type.name == 'images'"
              style="position: relative; z-index: 1; max-width: 120px; max-height: 120px"
              :src="changeFileToBlob(item)"
              alt=""
            />
            <div
              style="width: 150px; height: 120px;display: flex;"
              v-else-if="props.upload_type.name == 'video'"
            >
              <video style="width: 100%" controls :src="changeFileToBlob(item)"></video>
            </div>
            <div
              style="display: flex;align-items: center;width: 150px; height: 120px"
              v-else-if="props.upload_type.name == 'audio'"
            >
              <audio
                controls
                style="width: 100%; height: 30px"
                :src="changeFileToBlob(item)"
              ></audio>
            </div>
            <div
              style="display: flex;align-items: center;width: 150px; height: 120px; flex-direction: column; justify-content: center"
              v-else
            >
              <img :src="denImgChangePreview(props.upload_type.name, {})" alt="" />
              <div style="width: 100%"
                ><span class="ml-1 mr-1 text-cute mt-1 flex">{{ item.name }}</span></div
              >
            </div>
          </div>
          <div
            style="position: absolute; z-index: 1; margin-top: -110px; margin-left: 150px;width: 30px;height: 30px;"
            @click="deleClickEvent(item)"
          >
            <svg
              style="color: red"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              data-v-ea893728=""
            >
              <path
                fill="currentColor"
                d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896M288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
audio::-webkit-media-controls-current-time-display {
  display: none;
}

audio::-webkit-media-controls-current-time-display {
  display: none;
}

.text-cute {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 2;
}
</style>
