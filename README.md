## 

项目基础架构：element-plus 上进行开发的文件管理插件

# 组件名称: file-operate-ui
[![NPM version](https://img.shields.io/npm/v/vue-file-upload.svg?style=flat-square)](https://www.npmjs.com/package/file-operate-ui?activeTab=versions)
[![npm download](https://img.shields.io/npm/dm/vue-file-upload.svg?style=flat-square)](https://www.npmjs.com/package/file-operate-ui)

> vue3 element-plus

## 安装
### npm
```shell
npm install --save file-operate-ui
```
所用技术栈：

- element-plus 2.4.4+
- Vue 3
- axios 
- html2canvas
- less 
- unocss

###  已支持的平台：
- Windows 7 及以上
- Mac OS
- Linux

### 注意该组件与业务绑定 需要注意以下参数：

- appId和appSecret 是针对不同的项目分配
- base_file_url 为通用文件上传的域名

### 使用步骤如下：
```shell
<script setup lang="ts">
import 'file-operate-ui/index.css'
const typeObj = {
    label: '图片',
    name: 'images',
    choice_type: 'image/gif, image/jpg, image/png, image/jpeg, image/svg, image/svg+xml',
    remarkStr:
      '支持上传25MB以内的jpg、jpeg、png、gif、bmp格式图片，图像长度、宽度<3万像素和长宽像素相乘<2.5亿像素，一次最多上传10个文件'
  }
  const headersUrl = {
  appId: '',
  appSecret: '',
  base_url:''
}
</script>

<template>
   <div style="width: 1200px;display: flex;">
      <FileOperate  :headersurl="headersUrl"  :typeobj="typeObj"/>
   </div>
</template>
```
<h2>代码中注意以下几：</h2>
<h3>1、file-operate-ui/index.css 为样式，不导入会出现样式问题，由于vite和rollup打包特性</h3>
<h3>2、文件类型的有如下 :</h3>

<h2>文件的可选择类型：</h2>
<h3>图片</h3>

```bash
 {
    label: '图片',
    name: 'images',
    choice_type: 'image/gif, image/jpg, image/png, image/jpeg, image/svg, image/svg+xml',
    remarkStr:
      '支持上传25MB以内的jpg、jpeg、png、gif、bmp格式图片，图像长度、宽度<3万像素和长宽像素相乘<2.5亿像素，一次最多上传10个文件'
  }
```

 <h3>音频</h3>

```bash
  {
    label: '音频',
    name: 'audio',
    choice_type: 'audio/x-m4a, audio/mp3, audio/acc, audio/mpeg',
    remarkStr: '支持上传500MB以内的m4a、mp3,acc格式音频，一次最多上传10个文件'
  }
```

 <h3>视频</h3>

  ```bash
  {
    label: '视频',
    name: 'video',
    choice_type:
      'video/mp4,video/avi,video/wmv,video/mov,video/flv,video/rmvb,video/mkv,video/webm',
    remarkStr:
      '支持上传5GB以内的mp4、avi、wmv、mov、flv、rmvb、mkv、webm格式视频，一次最多上传10个文件,当前版本最大支持1080高清转码'
  }
  ```

 <h3>表格</h3>

```bash
  {
    label: '表格',
    name: 'excel',
    choice_type:
      'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
```

<h3>文档</h3>

```bash
  {
    label: '文档',
    name: 'word',
    choice_type:
      'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document ',
    remarkStr: '支持上传1G以内，一次最多上传10个文件'
  }
  ```

<h3>ppt</h3>

```bash
  {
    label: 'PPT',
    name: 'ppt',
    choice_type:
      'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
    remarkStr: '支持上传1G以内，一次最多上传10个文件'
  }
   ```

 <h3>pdf</h3>

   ```bash
  {
    label: 'PDF',
    name: 'pdf',
    choice_type: 'application/pdf',
    remarkStr: '支持上传1G以内，一次最多上传10个文件'
  }
   ```