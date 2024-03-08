<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import {
  ElButton,
  ElDatePicker,
  ElInput,
  ElIcon,
  ElSelect,
  ElOption,
  ElTree,
  ElDropdown,
  ElDropdownItem,
  ElPopover,
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElCheckbox,
  ElDialog,
  ElDivider
} from 'element-plus'
import { fileSearchSelect_arr, FileItem, operate_Arr } from './model/type'
import {
  changeKBToEvent,
  is_dark,
  formatDate,
  copyData,
  handleDownloadRource,
  getImgWH_path,
  getVideoLengthAcsyn,
  denImgChangePreview
} from './FileTools/tools' // 这个是工具类
// 这里面是接口返回数据参，将接口和数据进行隔离分开
import {
  groud_data,
  updateGroupName,
  addGroudEvent,
  deleGroupEvent,
  getrRightFileListEvent,
  postUploadFileApitEvent,
  deleFileEvent,
  putFileNameEvent,
  moveFileEvent
} from './model/data'
import { CutOperate } from './components/CutOperate'
import { UploadFile } from './components/UploadFile'
import { WaterMark } from './components/WaterMark'
const props = defineProps({
  typeobj: {
    type: Object,
    default: null
  }
})
const operate_Btn_Arr = ref([]) as any
if (props.typeobj.name != 'images') {
  operate_Btn_Arr.value = operate_Arr.filter((item:any) => item.keyStr != '编辑')
} else {
  operate_Btn_Arr.value = operate_Arr
}

const loading = ref(false)
const is_allBtn = ref(true) // 是否点开全部按妞
const timeSearch = ref('') // 时间搜索
const nameGroupSearch = ref('') // 分组名称搜索
const treeRef = ref<InstanceType<typeof ElTree>>()
const nameFileSearch = ref('') // 文件名称搜索
const fileSearchSelectValue = ref(1) // 条件间接搜索
const is_row = ref(true) // 排布方式
const is_visibleGroud = ref(false) // 是否删除分组
const multipleTableRef = ref()
const currentPage = ref(1) // 当前页数
const pageSize = ref(10) // 总页数
const total = ref(0)
const is_CutOperate = ref(false)
const group_Obj = ref({}) as any
const UploadFileRef = ref()
const is_UploadFile = ref(false)
const is_clickMoveGroup = ref(false)
const is_clickIMG = ref(false) //  查看图片或者视频
const select_RightObj = ref({}) as any //  查看图片或者视频, 右边选中的数据
const select_leftObj = ref({}) as any // 点击右边选择的数据
const is_waterMark = ref(false) // 是否添加水印
const WaterMarkRef = ref()
const rightParms = ref({
  group_id: '',
  extension: props.typeobj.name,
  order: fileSearchSelect_arr[fileSearchSelectValue.value].value,
  page: currentPage.value,
  size: pageSize.value
}) as any
const tableData = ref([] as FileItem[])
onMounted(async () => {

  //  获取分组
  group_Obj.value = await groud_data({ extension: props.typeobj.name })
  rightParms.value.group_id = group_Obj.value.public[0].id
  select_leftObj.value = group_Obj.value.public[0]
  getRightDataList(rightParms.value)
  // 获取用户信息列表
})
// 获取右边的数据
const getRightDataList = async (params:any) => {
  loading.value = true
  const res = await getrRightFileListEvent(params)
  total.value = res.total
  pageSize.value = res.size
  tableData.value = res.list
  loading.value = false
}
const clickGroudEvent = (type: string, data: { id: string | number; name: string }) => {
  console.log(type, data)

  if (type == 'dele') {
    is_visibleGroud.value = true
  } else if (type == 'add') {
    ElMessageBox.prompt('请输入内容', '添加分组', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        const res = await addGroudEvent({
          name: value,
          extension: props.typeobj.name,
          parent_id: data.id
        })
        if (res) {
          //  添加分组成功
          group_Obj.value = await groud_data({ extension: props.typeobj.name })
        }
      })
      .catch(() => {})
  } else if (type == 'eidt') {
    ElMessageBox.prompt('请输入内容', '编辑分组', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: data.name
    })
      .then(async ({ value }) => {
        const update_success = await updateGroupName(data.id, { name: value })
        if (update_success) {
          data.name = value
        }
      })
      .catch(() => {})
  }
}
//  进行分组删除
const deleGroupOperateEvent = async (data: { id: string | number; alias_name: any }) => {
  const res = await deleGroupEvent(data.id, { name: data.alias_name })
  if (res) {
    is_visibleGroud.value = false
    // const parent = node.parent
    // const children: Tree[] = parent.data.children || parent.data
    // const index = children.findIndex((d) => d.id === data.id)
    // children.splice(index, 1)
    // group_Obj.value.list = [...group_Obj.value.list]
    group_Obj.value = await groud_data({ extension: props.typeobj.name })
  }
}
// 进行分组名搜索
const nameGroudSearchEvent = (e: any) => {
  console.log(e)
}
const mousemoveGroupEvent = (e: { is_opeate: boolean }) => {
  changeNestedArrayValue(group_Obj.value.list, 'is_opeate', false)
  e.is_opeate = true
}
const changeNestedArrayValue = (obj: any | any[], propName: string, propValue: boolean) => {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      for (let i = 0; i < obj.length; i++) {
        changeNestedArrayValue(obj[i], propName, propValue)
      }
    } else {
      for (let key in obj) {
        if (key === propName) {
          obj[key] = propValue
        } else {
          changeNestedArrayValue(obj[key], propName, propValue)
        }
      }
    }
  }
}
// 对文件进行批量操作
const clickAllSelectOpearateEvent = (type: string) => {
  let select_Arr = [] as any
  for (const obj of tableData.value) {
    if (obj.is_checked == true) {
      select_Arr.push(obj)
    }
  }
  if (select_Arr.length == 0) {
    ElMessage.error('请先选择文件!')
    return
  }
  if (type == 'dele') {
    ElMessageBox.alert('是否删除已选择' + select_Arr.length + '记录', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(async () => {
        let id_Arr = [] as any
        for (const obj of select_Arr) {
          id_Arr.push(obj.id)
        }
        const res = await deleFileEvent({ ids: id_Arr.join(','), type: 'del' })
        if (res) {
          getRightDataList(rightParms.value)
        }
      })
      .catch(() => {})
  } else if (type == 'move') {
    // 批量进行操作
    let id_Arr = [] as any
    for (const obj of select_Arr) {
      id_Arr.push(obj.id)
    }
    moveGroupObj.value.ids = id_Arr.join(',')
    moveGroupObj.value.type = 'move'
    is_clickMoveGroup.value = true
  }
}
// 对文件操作
const fileEidtEvent = async (type: string, data: { url: any; id: any }) => {
  console.log(type, data)
  if (type == 'cut') {
    // 进行裁剪
    is_CutOperate.value = true
    select_RightObj.value = data
  } else if (type == 'watermark') {
    is_waterMark.value = true
    select_RightObj.value = data
  } else if (type == 'copy') {
    // 复制
    copyData(data.url)
  } else if (type == 'download') {
    // 下载资源
    handleDownloadRource(data)
  } else if (type == 'dele') {
    // 对文件进行删除
    ElMessageBox.alert('是否删除该记录', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(async () => {
        const res = await deleFileEvent({ ids: [data.id].join(','), type: 'del' })
        if (res) {
          getRightDataList(rightParms.value)
        }
      })
      .catch(() => {})
  } else if (type == 'move') {
    // 对单个文件进行移动
    moveGroupObj.value.ids = data.id
    moveGroupObj.value.type = 'move'
    is_clickMoveGroup.value = true
  }
}

const moveGroupObj = ref({}) as any
//  进行文件移动
const moveReqGrounpIDEvent = async () => {
  if (!moveGroupObj.value.group_id) {
    ElMessage.error('请选择分组!')
    return
  }
  const res = await moveFileEvent(moveGroupObj.value)
  if (res) {
    getRightDataList(rightParms.value)
    is_clickMoveGroup.value = false
  }
}

// 修改文件名称
const fileNameEidt = (data: { alias_name: string; id: string | number }) => {
  ElMessageBox.prompt('请输入内容', '修改文件名称', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: data.alias_name
  })
    .then(async ({ value }) => {
      const res = await putFileNameEvent(data.id, { alias_name: value })
      if (res) {
        data.alias_name = value
      }
    })
    .catch(() => {})
}

// 分页业务逻辑
const handleSizeChange = (e: any) => {
  console.log(e)
  rightParms.value.size = e
  getRightDataList(rightParms.value)
}
// 进行分页的数组选择
const handleCurrentChange = (e: any) => {
  console.log(e)
  rightParms.value.page = e
  getRightDataList(rightParms.value)
}
// 点击左边对右边的数据进行帅选
const reqRightDataEvent = (data: { id: any }) => {
  select_leftObj.value = data
  rightParms.value.group_id = data.id
  getRightDataList(rightParms.value)
}
// 时间选择事件
const timeChangeEvent = (e: (string | number | Date)[]) => {
  const dateTimeS = new Date(e[0])
  const dateTimeE = new Date(e[1])
  rightParms.value.start_time = formatDate(dateTimeS)
  rightParms.value.end_time = formatDate(dateTimeE)
  getRightDataList(rightParms.value)
}
// 文件名进行搜索事件
const nameFileSearchEvent = (e: any) => {
  console.log(e)
  rightParms.value.alias_name = nameFileSearch.value
  getRightDataList(rightParms.value)
}
// 对间接条件搜索
const fileSearchSelectValueEvent = (e: any) => {
  rightParms.value.order = e
  getRightDataList(rightParms.value)
}
// 重置搜索条件,进行查询
const resetSearchEvent = () => {
  timeSearch.value = ''
  nameFileSearch.value = ''
  rightParms.value = { group_id: rightParms.value.group_id, extension: props.typeobj.name }
  getRightDataList(rightParms.value)
}
// 点击全部图
const clickAllGroupEvent = () => {
  is_allBtn.value = !is_allBtn.value
  if (is_allBtn.value) {
    rightParms.value.group_id = 0
    getRightDataList(rightParms.value)
  }
}
//  点击右边的按钮事件
const clickUploadRightEvent = () => {
  if ([...group_Obj.value.public, ...group_Obj.value.list].length == 0) {
    ElMessage.error('请先添加分组!')
    return
  }
  is_UploadFile.value = true
}
// 进行上传事件操作
const UploadFileEvent = async () => {
  console.log(UploadFileRef.value.files_Arr)
  if (UploadFileRef.value.files_Arr.length == 0) {
    ElMessage.error('请先选择资源')
    return
  }
  const select_groupID_UploadFile = UploadFileRef.value.select_groupID
  is_UploadFile.value = false
  loading.value = true
  let queue = [] as any
  for (const obj of UploadFileRef.value.files_Arr) {
    let formData = new FormData()
    formData.append('file', obj)
    formData.append('extension', props.typeobj.name)
    formData.append('group_id', select_groupID_UploadFile)
    if (props.typeobj.name == 'images') {
      // 如果是图片的画
      const resData = (await getImgWH_path(URL.createObjectURL(obj))) as any
      formData.append('resolution', resData.width.toString() + '*' + resData.height.toString())
      formData.append('size', obj.size)
    }
    if (props.typeobj.name == 'video') {
      // 如果是图片的画
      const resVideo = (await getVideoLengthAcsyn(obj)) as any
      formData.append('length', resVideo)
      formData.append('size', obj.size)
    }
    const res = await postUploadFileApitEvent(formData)
    queue.push(res)
  }
  const resAll = await Promise.all(queue)
  console.log(resAll)
  if (resAll) {
    loading.value = false
    getRightDataList(rightParms.value)
  } else {
    loading.value = false
  }
}
//  点击图片进行放大
const clickIMGEvent = (data: { extension: string }) => {
  if (data.extension == 'images' || data.extension == 'video') {
    is_clickIMG.value = true
    select_RightObj.value = data
  }
}
// 对添加水印的图片处理
const sureWaterMarkEvent = async () => {
  const data = WaterMarkRef.value.savePicEvent()
  data.then(async (canvas: { toDataURL: () => string }) => {
    var arr = canvas.toDataURL().split(',') as any,
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const obj = new File(
      [u8arr],
      select_RightObj.value.alias_name + new Date().getTime().toString(),
      {
        type: mime
      }
    ) as any
    console.log(obj)
    let formData = new FormData()
    formData.append('file', obj)
    formData.append('extension', props.typeobj.name)
    formData.append('group_id', rightParms.value.group_id)
    const resData = (await getImgWH_path(URL.createObjectURL(obj))) as any
    formData.append('resolution', resData.width.toString() + '*' + resData.height.toString())
    formData.append('size', obj.size)
    const res = await postUploadFileApitEvent(formData)
    if (res.code == 0) {
      loading.value = false
      is_waterMark.value = false
    } else {
      loading.value = false
    }
    getRightDataList(rightParms.value)
  })
}
// 对table的点击事件进行处理
const currentChangeEvent = (selection: any[], row: any) => {
  console.log(selection, row)
  for (const obj of tableData.value) {
    if (selection.some((item: { id: string | number }) => item.id === obj.id)) {
      obj.is_checked = true
    } else {
      obj.is_checked = false
    }
  }
  for (const obj of selection) {
    obj.is_checked = true
  }
}
// 记录点击所有的
const selectAllChangeEvent = (selection: any) => {
  for (const obj of selection) {
    obj.is_checked = true
  }
}
const getSelectRow = () => {
  let i = 0
  for (const obj of tableData.value) {
    if (obj.is_checked) {
      i = i + 1
    }
  }
  return i
}
// 切换试图
const exchangeRowEvent = async () => {
  is_row.value = !is_row.value
  await nextTick()
  if (is_row.value) {
    tableData.value.forEach((item, index) => {
      console.log(index)
      if (item.is_checked) {
        multipleTableRef.value?.toggleRowSelection(item, true)
      }
    })
  } else {
  }
}
// 进行分组检索
watch(nameGroupSearch, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}

// 进行对外暴露数据
const selectRowsDataExportEvent = () => {
  let select_arr = [] as any
  for (const obj of tableData.value) {
    if (obj.is_checked) {
      select_arr.push(obj)
    }
  }
  console.log(select_arr)
  return select_arr
}
//  select_leftObj.value.num = select_leftObj.value.num + 1
// 进行分组检索
watch(total, async (val) => {
  //  监听数量变化
  console.log(val)
  //  获取分组
  group_Obj.value = await groud_data({ extension: props.typeobj.name })
})
// 进行裁剪的数、、
const onCutSave = async (obj: any | Blob | MediaSource) => {
  console.log(obj)
  let formData = new FormData()
  formData.append('file', obj)
  formData.append('extension', props.typeobj.name)
  formData.append('group_id', rightParms.value.group_id)
  const resData = (await getImgWH_path(URL.createObjectURL(obj))) as any
  formData.append('resolution', resData.width.toString() + '*' + resData.height.toString())
  formData.append('size', obj.size)
  const res = await postUploadFileApitEvent(formData)
  if (res.code == 0) {
    loading.value = false
    is_CutOperate.value = false
  } else {
    loading.value = false
  }
  getRightDataList(rightParms.value)
}
const onCutCancel = () => {
  is_CutOperate.value = false
}
defineExpose({ selectRowsDataExportEvent, tableData })
</script>
<template>
  <div class="s_row"  style="width: 100%;">
    <div class="s_column"  style="width: 20%;border-style: solid;border-width: 0.3px;padding: 15px;"
    :style="{ 'border-color': is_dark ? '#444' : '#e0e0e0' }">
      <div class="ml-3 mr-3 s_flex">
        <el-input v-model="nameGroupSearch" class="w-40" placeholder="请输入分组名称" size="large">
          <template #suffix>
            <!--   vue3图标使用方式  -->

            <ElIcon size="20" @click="nameGroudSearchEvent">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="">
                <path
                  fill="currentColor"
                  d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z"
                />
              </svg>
            </ElIcon>
          </template> </el-input
      ></div>
      <div style="font-size: 15px;align-self: flex-start;margin-top: 15px;">分组列表</div>
      <div
        class="s_flex s_items_center"
        style="justify-content: space-between; font-size: 15px;height: 32px;padding: 5px;margin-top: 10px;"
        :style="{ 'background-color': is_dark ? '#000' : '#fff' }"
      >
        <div class="s_flex s_items_center" @click="clickAllGroupEvent">
          <ElIcon v-if="is_allBtn" size="17">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="">
              <path fill="currentColor" d="m192 384 320 384 320-384z" />
            </svg>
          </ElIcon>
          <ElIcon v-else size="17">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="">
              <path fill="currentColor" d="M384 192v640l384-320.064z" />
            </svg>
          </ElIcon>
          <div class="ml-1">全部{{ props.typeobj.label }}</div>
        </div>
        <div class="s_row">
          <ElIcon size="17" @click="clickGroudEvent('add', {id: 0,name: ''})">
            <svg
              style="color: #105cfb"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              data-v-ea893728=""
            >
              <path fill="currentColor" d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64z" />
              <path fill="currentColor" d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0z" />
              <path
                fill="currentColor"
                d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
              />
            </svg>
          </ElIcon>
          <div class="text-3 ml-2">{{ group_Obj.files_count }}</div>
        </div>
      </div>
      <div v-if="is_allBtn" style="margin-top: 5px;">
        <el-tree
          :data="group_Obj.public"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ data }">
            <span class="custom-tree-node" @click="reqRightDataEvent(data)">
              <div class="s_row" style="justify-content: space-between; width: 100%;background-color:transparent">
                <div>{{ data.name }}</div>
                <div>{{ data.files_count }}</div>
              </div>
            </span>
          </template>
        </el-tree></div
      >
      <el-divider style="margin: 10px 0" />
      <div v-if="is_allBtn">
        <el-tree
          ref="treeRef"
          :data="group_Obj.list"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
        >
          <template #default="{ data }">
            <span
              @mouseover="mousemoveGroupEvent(data)"
              class="custom-tree-node"
            >
              <div  @click="reqRightDataEvent(data)">{{ data.name }}</div>
              <span>
                <!-- <a @click="append(data)"> Append </a>
                <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a> -->
                <div v-if="data.is_opeate">
                  <ElIcon size="17" @click="clickGroudEvent('add', data)">
                    <svg
                      style="color: #105cfb"
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      data-v-ea893728=""
                    >
                      <path
                        fill="currentColor"
                        d="M352 480h320a32 32 0 1 1 0 64H352a32 32 0 0 1 0-64z"
                      />
                      <path
                        fill="currentColor"
                        d="M480 672V352a32 32 0 1 1 64 0v320a32 32 0 0 1-64 0z"
                      />
                      <path
                        fill="currentColor"
                        d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"
                      />
                    </svg>
                  </ElIcon>
                  <el-dropdown>
                    <span>
                      <ElIcon style="margin-left: 5px;" size="17">
                        <svg
                          viewBox="0 0 1024 1024"
                          xmlns="http://www.w3.org/2000/svg"
                          data-v-ea893728=""
                        >
                          <path
                            fill="currentColor"
                            d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"
                          />
                        </svg>
                      </ElIcon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          ><span @click="clickGroudEvent('eidt', data)"
                            >重命名</span
                          ></el-dropdown-item
                        >
                        <el-dropdown-item :disabled="data.files_count != 0 ? true : false">
                          <el-popover
                            v-if="data.children.length == 0"
                            :visible="is_visibleGroud"
                            placement="right-end"
                            :width="180"
                          >
                            <p>是否删除该分组?</p>
                            <div>
                              <el-button size="small" text @click="is_visibleGroud = false"
                                >取消</el-button
                              >
                              <el-button
                                size="small"
                                type="primary"
                                @click="deleGroupOperateEvent(data)"
                                >确定</el-button
                              >
                            </div>
                            <template #reference>
                              <span @click="clickGroudEvent('dele', data)">删除分组</span>
                            </template>
                          </el-popover>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <div style="font-size: 12px; color: #666" v-else>{{ data.files_count }}</div>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="s_flex" style="flex-direction: column;width: 80%;padding-left: 10px;padding-right: 15px;">
      <div class="s_flex s_justify_between">
        <ElButton class="ml-3" type="primary" @click="clickUploadRightEvent()"
          >上传至{{ props.typeobj.label }}</ElButton
        >
        <div class="s_row s_items_center">
          <div class="text-4">上传时间：</div>
          <div>
            <el-date-picker
              v-model="timeSearch"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="large"
              @change="timeChangeEvent"
            />
          </div>
          <div style="margin-left: 10px;">
            <el-input
              v-model="nameFileSearch"
              class="w-40"
              placeholder="请输入文件名称"
              size="large"
            >
              <template #suffix>
                <!--   vue3图标使用方式  -->
                <ElIcon size="20" @click="nameFileSearchEvent">
                  <svg
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-ea893728=""
                  >
                    <path
                      fill="currentColor"
                      d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z"
                    />
                  </svg>
                </ElIcon>
              </template> </el-input
          ></div>
          <ElButton type="primary" style="margin-left: 10px;" @click="resetSearchEvent()">重置</ElButton>
        </div>
      </div>
      <div class="s_flex s_justify_between w-100% s_items_center" style="margin-top: 5px;">
        <div class="ml-3 text-3">素材总量：{{ total }}</div>
        <div class="s_row s_items_center">
          <el-select
            class="w-39 selectInput"
            v-model="fileSearchSelectValue"
            placeholder="Select"
            size="default"
            @change="fileSearchSelectValueEvent"
          >
            <el-option
              v-for="item in fileSearchSelect_arr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div @click="exchangeRowEvent()"
            >
            <!-- <Icon :size="20" v-if="is_row" icon="material-symbols:key-visualizer" /> -->
            <el-icon :size="20" v-if="is_row"><Switch />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M160 448a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V160.064a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32V416a32 32 0 0 1-32 32zM160 896a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32zm448 0a32 32 0 0 1-32-32V608a32 32 0 0 1 32-32h255.936a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32z"></path></svg>
            </el-icon>
            <el-icon  :size="20" v-else><Operation /><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M118.656 438.656a32 32 0 0 1 0-45.248L416 96l4.48-3.776A32 32 0 0 1 461.248 96l3.712 4.48a32.064 32.064 0 0 1-3.712 40.832L218.56 384H928a32 32 0 1 1 0 64H141.248a32 32 0 0 1-22.592-9.344zM64 608a32 32 0 0 1 32-32h786.752a32 32 0 0 1 22.656 54.592L608 928l-4.48 3.776a32.064 32.064 0 0 1-40.832-49.024L805.632 640H96a32 32 0 0 1-32-32"></path></svg></el-icon>
          </div>
        </div>
      </div>
      <!-- 文件类型 -->
      <div class="s_flex" style="flex-direction: column;margin-top: 8px;flex: 2;">
        <div v-if="is_row">
          <el-table 
            height="440"
            ref="multipleTableRef"
            v-loading="loading"
            :data="tableData"
            style="width: 100%;background-color: transparent;"
            @select="currentChangeEvent"
            @select-all="selectAllChangeEvent"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column :label="props.typeobj.label">
              <template #default="scope">
                <div class="s_row" style="margin-top: 5px;">
                  <div
                    class="s_flex s_items_center"
                    style="justify-content: center; height: 50px"
                    :style="{
                      width:
                        props.typeobj.name == 'images' || props.typeobj.name == 'video'
                          ? '100px'
                          : ''
                    }"
                  >
                    <img
                      :src="denImgChangePreview(props.typeobj.name, scope.row)"
                      style="max-width: 100px; max-height: 50px"
                      @click="clickIMGEvent(scope.row)"
                      alt=""
                    />
                    <ElIcon
                      v-if="props.typeobj.name == 'video'"
                      size="30"
                      style="position: absolute"
                      @click="clickIMGEvent(scope.row)"
                    >
                      <svg
                        t="1701416335737"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="10897"
                        width="48"
                        height="48"
                      >
                        <path
                          d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667zM456.704 305.92C432.704 289.152 405.333333 303.082667 405.333333 331.797333v360.533334c0 28.586667 27.541333 42.538667 51.370667 25.856l252.352-176.768c21.76-15.253333 21.632-43.541333 0-58.709334l-252.373333-176.768z m-8.597333 366.72V351.466667l229.269333 160.597333-229.269333 160.597333z"
                          fill="#3D3D3D"
                          p-id="10898"
                        />
                      </svg>
                    </ElIcon>
                  </div>
                  <div class="s_flex" style="margin-left:15px;flex-direction: column; justify-content: center">
                    <div class="s_row" style="width: 120px;">
                      <div class="text-cute" style="font-size: 15px;">{{ scope.row.alias_name }}</div>
                      <div class="s_flex" @click="fileNameEidt(scope.row)" 
                       style="display: flex;width: 20px;height: 30px;margin-left: 5px;"
                        ><svg
                          style="color: #999"
                          viewBox="0 0 1024 1024"
                          xmlns="http://www.w3.org/2000/svg"
                          data-v-ea893728=""
                        >
                          <path
                            d="m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z"
                            fill="currentColor"
                          /></svg
                      ></div>
                    </div>
                    <div
                      v-if="props.typeobj.name == 'images'"
                      style="font-size: 11px; color: #666"
                      >{{ scope.row.resolution }}</div
                    >
                  </div>
                </div></template
              >
            </el-table-column>
            <el-table-column property="size" label="大小" width="100">
              <template #default="scope">
                <div>{{ changeKBToEvent(scope.row.size) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              property="updated_at"
              label="上传日期"
              width="200"
              show-overflow-tooltip
            />
            <el-table-column property="author" label="上传者" width="100" show-overflow-tooltip />
            <el-table-column label="操作" width="230">
              <template #default="scope"
                ><div class="s_row">
                  <div
                    v-for="(item, index) in operate_Btn_Arr"
                    :key="index"
                    class="s_flex s_items_center"
                    style="width: 120px"
                  >
                    <div v-if="item.value == 'edit'" class="s_flex s_items_center">
                      <div class="s_flex" v-if="props.typeobj.name == 'images'">
                        <div class="s_row">
                          <div style="color: #409eff" @click="fileEidtEvent('watermark', scope.row)">
                          水印
                        </div>
                        <!-- <div style="color: #409eff" @click="fileEidtEvent('cut', scope.row)">
                          裁剪
                        </div> -->
                        </div>
                        <!-- <el-dropdown>
                        <span style="color: #409eff">
                          {{ item.keyStr }}
                        </span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item @click="fileEidtEvent('watermark', scope.row)"
                              >添加水印</el-dropdown-item
                            >
                            <el-dropdown-item @click="fileEidtEvent('cut', scope.row)"
                              >裁剪</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </template>
                        </el-dropdown> -->
                      </div>
                      <div v-else></div>
                    </div>
                    <el-button
                      v-else
                      style="width: 30px"
                      :type="item.buttonType"
                      text
                      @click="fileEidtEvent(item.value, scope.row)"
                      >{{ item.keyStr }}</el-button
                    >
                  </div>
                </div></template
              >
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="s_flex" style="flex-wrap: wrap;flex: 1;margin-left: 5px;">
          <div
            class="s_flex"
            style="width: 120px; height: 130px; flex-direction: column;padding: 10px;"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <div class="s_flex  s_items_center" style="justify-content: center;flex: 1;"
              ><img
                style="max-width: 120px; max-height: 100px"
                :src="denImgChangePreview(props.typeobj.name, item)"
                @click="clickIMGEvent(item)"
                alt=""
              /><ElIcon
                v-if="props.typeobj.name == 'video'"
                size="30"
                style="position: absolute"
                @click="clickIMGEvent(item)"
              >
                <svg
                  t="1701416335737"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="10897"
                  width="48"
                  height="48"
                >
                  <path
                    d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667zM456.704 305.92C432.704 289.152 405.333333 303.082667 405.333333 331.797333v360.533334c0 28.586667 27.541333 42.538667 51.370667 25.856l252.352-176.768c21.76-15.253333 21.632-43.541333 0-58.709334l-252.373333-176.768z m-8.597333 366.72V351.466667l229.269333 160.597333-229.269333 160.597333z"
                    fill="#3D3D3D"
                    p-id="10898"
                  />
                </svg>
              </ElIcon>
            </div>
            <div style="height: 30px">
              <div class=" s_row s_items_center" style="flex:2">
                <div class="s_flex" style="flex:2"
                  ><el-checkbox
                    :checked="item.is_checked"
                    @click="item.is_checked = !item.is_checked"
                  />
                </div>
                <div class="text-cute" style="margin-left: 5px;">{{ item.alias_name }}</div>
                <div
                  v-if="props.typeobj.name == 'images'"
                  class="w-4 h-6 ml-1 s_flex flex-1"
                 
                  @click="fileNameEidt(item)"
                  ><svg
                    style="color: #999"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-ea893728=""
                  >
                    <path
                      d="m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z"
                      fill="currentColor"
                    /></svg
                ></div>
              </div>
              <div class="flex justify-between" style="font-size: 12px; color: #999">
                <div
                  v-if="props.typeobj.name != 'images'"
                  class="w-4 h-4 ml-1 s_flex flex-1"
                  @click="fileNameEidt(item)"
                  ><svg
                    style="color: #999"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-ea893728=""
                  >
                    <path
                      d="m199.04 672.64 193.984 112 224-387.968-193.92-112-224 388.032zm-23.872 60.16 32.896 148.288 144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112 56.704-98.112-193.984-112-56.64 98.112zM104.32 708.8l384-665.024 304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z"
                      fill="currentColor"
                    /></svg
                ></div>
                <div>
                  <div>{{ changeKBToEvent(item.size) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="s_row" style="flex:2;">
          <div class="s_flex" style="justify-content: space-between;width: 100%;margin-left: 10px;margin-top: 10px;">
            <div class="s_row" style="align-self: flex-end;">
              <div class="text-3">已选 {{ getSelectRow() }}/{{ total }}</div>
              <ElButton style="margin-left: 5px;" type="danger" @click="clickAllSelectOpearateEvent('dele')"
                >批量删除</ElButton
              >
              <ElButton @click="clickAllSelectOpearateEvent('move')">批量移动</ElButton>
            </div>
            <div style="display: flex;align-self: flex-end;">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                background
                :page-sizes="[10, 20, 30, 40, 50]"
                layout="sizes, prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog style="padding: 20px;padding-bottom: 0px;width: 80%;" v-model="is_CutOperate" title=" 裁剪" width="40%" top="5%">
      <CutOperate :fileobj="select_RightObj" @save="onCutSave" @cancel="onCutCancel" />
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="is_CutOperate = false">取消</el-button>
          <el-button type="primary" @click="is_CutOperate = false"> 完成 </el-button>
        </span>
      </template> -->
    </el-dialog>
    <!-- 上传控件 -->
    <el-dialog
      class="pt-5 pl-5 pr-5"
      v-model="is_UploadFile"
      :title="'上传' + props.typeobj.label"
      width="70%"
      destroy-on-close
    >
      <UploadFile
        ref="UploadFileRef"
        :default_group_ID="rightParms.group_id"
        :groups="[...group_Obj.public, ...group_Obj.list]"
        :upload_type="props.typeobj"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="is_UploadFile = false">取消</el-button>
          <el-button type="primary" @click="UploadFileEvent"> 确认上传 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 进行分组选择 -->
    <el-dialog class="pt-5 pl-5 pr-5" width="20%" v-model="is_clickMoveGroup" title="选择分组">
      <div class="s_flex">
        <el-tree
          :data="[...group_Obj.public, ...group_Obj.list]"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <div
                class="s_flex"
                style="justify-content: space-between; width: 100%"
                @click="moveGroupObj.group_id = data.id"
              >
                <span>{{ data.name }}</span>
                <span>{{ data.files_count }}</span>
              </div>
            </span>
          </template>
        </el-tree>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="is_clickMoveGroup = false">取消</el-button>
          <el-button type="primary" @click="moveReqGrounpIDEvent()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog style="padding: 20px;padding-bottom: 0px;width: 80%;" v-model="is_clickIMG" :title="select_RightObj.alias_name">
      <div class="s_flex s_items_center" style="justify-content: center">
        <img
          v-if="select_RightObj.extension == 'images'"
          style="max-width: 100%"
          :src="select_RightObj.url"
          alt=""
        />
        <video
          style="width: 100%; height: 400px"
          v-else-if="select_RightObj.extension == 'video'"
          controls
          :src="select_RightObj.url"
        ></video>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="is_clickIMG = false">取消</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog  style="padding: 20px;padding-bottom: 0px;width: 80%;" v-model="is_waterMark" title="品乐家水印操作台">
      <div class="s_flex s_items_center" style="justify-content: center">
        <WaterMark ref="WaterMarkRef" :fileobj="select_RightObj" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="is_waterMark = false">取消</el-button>
          <el-button type="primary" @click="sureWaterMarkEvent()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="less">

.s_flex{
  display: flex;
}
.s_row{
  display: flex;
  flex-direction: row;
}
.s_column{
  display: flex;
  flex-direction: column;
}

.s_items_center{
  align-items: center;
}
.s_justify_between{
  justify-content: space-between;
}

.selectInput :deep(.el-input) {
  --el-input-focus-border: transparent;
  --el-input-transparent-border: 0 0 0 0px;
  --el-input-border-color: transparent;
  --el-input-hover-border: 0px !important;
  --el-input-hover-border-color: transparent;
  --el-input-focus-border-color: transparent;
  --el-input-clear-hover-color: transparent;
  --el-input-border: 0px;
  box-shadow: 0 0 0 0 !important;
}
:deep(.el-input__wrapper){
  background-color:transparent
}
:deep(.el-tree){
  background-color:transparent
}
:deep(.el-table){
  background-color:transparent
}
.custom-tree-node {
  display: flex;
  padding-right: 8px;
  font-size: 14px;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}

.text-cute {
  overflow: hidden;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 1;
}

:deep(.el-tree-node__content) {
  height: 36px;
}
</style>
