import {
  getFileGroupApi,
  putFileGroupNameApi,
  addFileGroupApi,
  deleFileGroupApi,
  getrRightFileListApi,
  postFileApi,
  delFileApi,
  moveFileApi,
  putFileNameApi
} from '../api/index'

// 模拟数据json 
import { groud_dataJson, file_dataJson } from '../model/json'

// 获取分组数据
export const groud_data = async (data:any) => {
 // const res = await getFileGroupApi(data)
 // return res.data
 return groud_dataJson
}
// 修改分组名称数据
export const updateGroupName = async (id: number | string, data: any) => {
  const res = (await putFileGroupNameApi(id, data)) as any
  if (res.code == 0) {
    return true
  } else {
    return false
  }
}
// 添加分组事件
export const addGroudEvent = async (data:any) => {
  const res = (await addFileGroupApi(data)) as any
  if (res.code == 0) {
    return true
  } else {
    return false
  }
}

// 删除分组
export const deleGroupEvent = async (id: number | string, data: any) => {
  const res = (await deleFileGroupApi(id, data)) as any
  if (res.code == 0) {
    return true
  } else {
    return false
  }
}

// 对文件进行操作api

// 获取文件列表
export const getrRightFileListEvent = async (data:any) => {
  // const res = (await getrRightFileListApi(data)) as any
  // return res.data
  return file_dataJson
}

// 对文件上传-postFileApi
/*

// 文件上传
export function postUpload (file) {
   let formData = new FormData()
    formData.append('file',file)
    return axios({
        url: 'upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
注意 :请求都是封装好的，重点就是需要加请求头： headers：{ ‘Content-Type’: ‘multipart/form-data’ }
*/
export const postUploadFileApitEvent = async (data:any) => {
  const res = (await postFileApi(data)) as any
  return res
}
// 进行文件删除 type = del 软删除type = reduction 还原 type = deletes 真实删除
export const deleFileEvent = async (data: any) => {
  const res = (await delFileApi(data)) as any
  if (res.code == 0) {
    return true
  } else {
    return false
  }
}

// 对文件进行移动操作
export const moveFileEvent = async (data: any) => {
  const res = (await moveFileApi(data)) as any
  if (res.code == 0) {
    return true
  } else {
    return false
  }
}

// 对文件进行操作修改
export const putFileNameEvent = async (id: number | string, data: any) => {
  const res = (await putFileNameApi(id, data)) as any
  if (res.code == 0) {
    return true
  } else {
    return false
  }
}
