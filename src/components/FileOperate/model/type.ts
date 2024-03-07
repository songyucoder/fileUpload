export const fileType_Arr = [
  {
    label: '图片',
    name: 'images',
    choice_type: 'image/gif, image/jpg, image/png, image/jpeg, image/svg, image/svg+xml',
    remarkStr:
      '支持上传25MB以内的jpg、jpeg、png、gif、bmp格式图片，图像长度、宽度<3万像素和长宽像素相乘<2.5亿像素，一次最多上传10个文件'
  },
  {
    label: '音频',
    name: 'audio',
    choice_type: 'audio/x-m4a, audio/mp3, audio/acc, audio/mpeg',
    remarkStr: '支持上传500MB以内的m4a、mp3,acc格式音频，一次最多上传10个文件'
  },
  {
    label: '视频',
    name: 'video',
    choice_type:
      'video/mp4,video/avi,video/wmv,video/mov,video/flv,video/rmvb,video/mkv,video/webm',
    remarkStr:
      '支持上传5GB以内的mp4、avi、wmv、mov、flv、rmvb、mkv、webm格式视频，一次最多上传10个文件,当前版本最大支持1080高清转码'
  },
  {
    label: '表格',
    name: 'excel',
    choice_type:
      'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  {
    label: '文档',
    name: 'word',
    choice_type:
      'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document ',
    remarkStr: '支持上传1G以内，一次最多上传10个文件'
  },
  {
    label: 'PPT',
    name: 'ppt',
    choice_type:
      'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
    remarkStr: '支持上传1G以内，一次最多上传10个文件'
  },
  {
    label: 'PDF',
    name: 'pdf',
    choice_type: 'application/pdf',
    remarkStr: '支持上传1G以内，一次最多上传10个文件'
  }
]

export const fileSearchSelect_arr = [
  { label: '上传时间（新-旧）', value: 1 },
  { label: '上传时间（旧-新）', value: 2 },
  { label: '文件大小（大-小）', value: 4 },
  { label: '文件大小（小-大）', value: 3 },
  { label: '使用次数 （多-少）', value: 5 },
  { label: '使用次数 （少-多）', value: 6 }
]

// 操作项数据
export const operate_Arr = [
  {
    keyStr: '编辑',
    buttonType: 'primary',
    value: 'edit'
  },
  {
    keyStr: '复制',
    buttonType: 'primary',
    value: 'copy'
  },
  {
    keyStr: '下载',
    buttonType: 'primary',
    value: 'download'
  },
  {
    keyStr: '移动',
    buttonType: 'primary',
    value: 'move'
  },
  {
    keyStr: '删除',
    buttonType: 'danger',
    value: 'dele'
  }
] as any

export interface FileItem {
  filename: string
  alias_name: string
  id: string | number
  url: string
  extension: string
  size: string | number
  length: string | number
  author: string
  created_at: string
  updated_at: string
  is_checked: boolean
  resolution: string
}
