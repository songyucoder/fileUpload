import request from '../FileTools/request'
export const getFileGroupApi = (params: any): Promise<IResponse> => {
  // 获取分组列表
  return request.get({ url: '/api/file-group', params: params })
}
// 更新分组名称
export const putFileGroupNameApi = (id: number | string, data: any): Promise<IResponse> => {
  return request.put({ url: `/api/file-group/${id}`, data })
}
// 增加分组
export const addFileGroupApi = (data: any): Promise<IResponse<IResponse>> => {
  return request.post({ url: '/api/file-group', data })
}

//  删除分组
export const deleFileGroupApi = (id: number | string, data: any): Promise<IResponse> => {
  return request.delete({ url: `/api/file-group/${id}`, data })
}

// admin/file 获取右边的文件数据
export const getrRightFileListApi = (params: any): Promise<IResponse> => {
  // 获取分组列表
  return request.get({ url: '/api/file', params: params })
}

//  上传文件
export const postFileApi = (params: FormData): Promise<IResponse> => {
  // 获取分组列表
  return request.post({
    url: '/api/file',
    data: params
  })
}

// 删除文件
export const delFileApi = (data: any): Promise<IResponse> => {
  return request.post({ url: '/api/file/handle', data })
}

// 对文件进行移动分组
export const moveFileApi = (data: any): Promise<IResponse> => {
  return request.post({ url: `/api/file/move`, data })
}

// 对文件单独进行更新
export const putFileNameApi = (id: number | string, data: any): Promise<IResponse> => {
  return request.put({ url: `/api/file/${id}`, data })
}
// 对文件批量进行更新
export const putFileAllApi = (data: any): Promise<IResponse> => {
  return request.put({ url: `/api/file/all`, data })
}

//  获取回收站文件列表
export const getFileRecycleBinApi = (data: any): Promise<IResponse> => {
  return request.get({ url: `/api/file/recycleBin`, params: data })
}
// 还原
export const putFileRecycleBinApi = (data: any): Promise<IResponse> => {
  return request.post({ url: `/api/file/reduction`, data })
}
// 真实删除
export const deleFileRecycleBinApi = (data: any): Promise<IResponse> => {
  return request.post({ url: `/api/file/deletes`, data })
}

// 手动上传
export const filecreateApi = (data: any): Promise<IResponse> => {
  return request.get({ url: `/api/file/create`, params: data })
}
