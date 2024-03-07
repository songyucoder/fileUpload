import { ElMessage } from 'element-plus'
//  对数据大小K、、M/G 进行转换
export const changeKBToEvent = (limit) => {
  let size = ''
  if (limit < 0.1 * 1024) {
    //小于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  } else if (limit < 0.1 * 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    //小于0.1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  const sizeStr = size + '' //转成字符串
  const index = sizeStr.indexOf('.') //获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2) //获取小数点后两位的值
  if (dou == '00') {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return size
}

// 监听系统的主题色
export const is_dark = window.matchMedia('(prefers-color-scheme: dark)').matches

// 转换年月日
export const formatDate = (datas: Date) => {
  const yy = datas.getFullYear()
  const MM = datas.getMonth() + 1 < 10 ? '0' + (datas.getMonth() + 1) : datas.getMonth() + 1
  const dd = datas.getDate() < 10 ? '0' + datas.getDate() : datas.getDate()
  const HH = datas.getHours() < 10 ? '0' + datas.getHours() : datas.getHours()
  const mm = datas.getMinutes() < 10 ? '0' + datas.getMinutes() : datas.getMinutes()
  const ss = datas.getSeconds() < 10 ? '0' + datas.getSeconds() : datas.getSeconds()
  const time = yy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss
  return time
}

// 复制路径
export const copyData = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      ElMessage.success('文本已成功复制到剪贴板')
    })
    .catch((error) => {
      ElMessage.success('复制到剪贴板失败:', error)
    })
}

// 下载资源
export const handleDownloadRource = (data) => {
  // 这里是获取到的图片base64编码,这里只是个例子哈，要自行编码图片替换这里才能测试看到效果
  const imgUrl = data.url
  // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
  if (navigator.userAgent.indexOf('Chrome') > -1) {
    // 这里就按照chrome等新版浏览器来处理
    const a = document.createElement('a')
    document.body.append(a)
    if (data.extension == 'video') {
      const x = new XMLHttpRequest()
      x.open('GET', imgUrl, true)
      x.responseType = 'blob'
      x.onload = () => {
        // 会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        const url = window.URL.createObjectURL(x.response)
        a.href = url
        a.download = data.filename
        a.click()
      }
      x.send()
    } else {
      a.href = imgUrl
      a.setAttribute('download', data.filename)
      a.rel = 'noopener noreferrer'
      a.click()
      document.body.removeChild(a)
    }
  } else {
    ElMessage.error('下载失败请直接复制路径')
  }
}
// 获取图片的宽高比
export const getImgWH_path = (path) => {
  const image = new Image()
  // 获取的是图片的base64代码
  image.src = path
  return new Promise((resolve, reject) => {
    image.onload = function () {
      resolve({ width: image.width, height: image.height })
    }
    image.onerror = function () {
      reject('获取图片宽高失败')
    }
  })
}

// 获取视频的长度
export const getVideoLengthAcsyn = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = URL.createObjectURL(file)
    video.load()
    video.addEventListener('loadedmetadata', async function () {
      // video.duration //时长以秒作为单位
      // console.log('时长：', parseFloat(video.duration).toFixed(1))
      console.log(video.duration)
      if (video.duration != 0) {
        resolve(video.duration)
      } else {
        ElMessage.error('获取时长！')
        reject(0)
      }
    })
  })
}

// 根据资源类型对应不同img展示内容
export const denImgChangePreview = (type, data) => {
  if (type == 'images') {
    // 图片
    return data.url
  } else if (type == 'video') {
    // 视频类型 这里使用的是 阿里云的oss资源
    return data.url + '?x-oss-process=video/snapshot,t_1000,m_fast'
  } else if (type == 'ppt') {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOASURBVHgB7Zw/bBMxFId/trowUbEiQZFYK+jCBKLdkGBhLQNITCCGjrBAO4HE0koIJqQw0JUFJDaCxMRCoCsSAYkVwsQCZ/zucvTic5w/jp3GeZ90anK5G/Ll+T3bpz6AYZgZRmBE1MbiIvDnNDK5qu8+jhRQ+AqZNYGFltjudEa5dWiBWpyWll2DEFf120Uki2pAyC0tsj3M1QMF5hGnsnv60g3MFWq7K9IZkU6BWt4SlHqjXy5hPmnrEbfmisa+Alnef5wSrQKLYas+gOWVkMQV23CW1svznMfyKix1ndSoRWB36H4BU6eIwlb1VD0Cs2wTjB2axhn0RGA39/0E04+OjsIT1VxoRKBeYTAuaAHR46hXIC3PGDd/M4dArryDkTjV+5bxggV6wgI9WUBsli8C528AR47Bmx/fir+f3+0fkYkrkKRdf46JUf4IJ88Wf0no6wfA+13EIu4QPrOOoJDQ9cfA3U+TifAhSDMHkrxbL4GjywhNukWklBg4EuMXEZO3T4pjHEgOHZQayjxY5dDhQuLDc8DvXwjB9AXSFyur6aiU91HR6Bdx9J6qPhWXAKQzhEnmo0v2H4MEUjQGIK0cWEo0hyvJCzQDSK+IkERbTqUJfADSrMK2iXSgKU2aAikKbcM4wJQm3XlgoGmLCe/GeJKmwH7Dddz5poM0Bdoq7vc9hCBNgRdu18+xwCG5fN8+fAMt5aa/Fp4UlPco8mjZZrL3Kkj+I2ZfYLlMcz0meHEHoZi+QPriPuvUQZNjkhco+ojpC6QICrRTkue9cfcahySdHFiFViER5BHpCaRHm7s3gw7bKmkIJFlUaemI/Gx4tp+JEDRcI20c2JjtZyIHAN6N8YQFesICPWGBnrBAT1igJyzQExboCQv0hAV6wgI9YYGesEBP4gq07dVF/JeEEMTdziKBT6/sP3qkfcAZ3soi4u8HljvHicA50BMW6AkL9MQU2Abjhjq9VegVKGUTjBvDkRmB1FRmpP5584bY7jSr76XxYQdKPQPTB9Uwz9SLiJQNMHaE3DJP1QTmvaGU2gHTixA7thZ49mmMlJvgilylrY9N2wdWgXkuFGINLJEoGzBaiyu3AHUzsAWocyWS3yjEylzmRJ3zuv0C287LMCR5NFJvwaINcqoU0zg9EzEbLfZj5EbchJa5qmWm1Ii7paV91K9GbsTNMMxM8w9CdxXRlgpM1QAAAABJRU5ErkJggg=='
  } else if (type == 'pdf') {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAYFBMVEUAAAD/R0f/Rkb/QED/R0f/SEj/R0f/SEj/Rkb/Rkb/R0f/RUX/R0f/R0f/////6Oj/dXX/Xl7/jIz/9PT/0dH/rq7/UlL/urr/o6P/3Nz/l5f/amr/xsb/mJj/gYH/gIBEF8lrAAAADXRSTlMAn6AQ3yCQQIDvjzBvIFA5EAAAAgVJREFUWMPl2Ml2ozAQhWHcBPCQ0ogEAmO//1u2uqKg9KF9muFmlX/FyeJLCSEvVPzwyuZ82ty5KV9wt/pC+zpV/5ruSge6Lqas3uhQb9XSQ4olewfFr6u+EqBr9iqCdJvBXxiwnt8gYbqUCWwIVJPAMwp8B75C7rQaHM1TA8FnELEeBjrxkQKBvUi1GFCLOQ8BecF3I2IaArZRkvTAgTJKjibckm2Uel64JeCELW6XA1OCWdguW96TBwbkDybwnmBAnw8KBqQ2gQYFqgRqFEg2rRgG9gwaHOh5RIUDNXrJneAGGCgFZzUINCIVMCAPaHlKhzvLnUqvEQDybDp9jOo4qHjA+HDnjRnjkx7V0xil/C4wfB5jL1kMUszZTm0GTRrQP12kl7mtIM8zOCleNWwDjfhfYRPoX0zmdEwZGx/lBlC1f8/izDim/9AaT97x01rQT1+3s+3TR+K7+W+CMytBI7PmIpYb7I5dHvNi5eJw6C57Ha0CJ8HlJS1I+zH7QKvAXixGWKSmflKeVoHJkyt+VFeBmrnwYHCg42DHK9Xs3QkABv7877xqjQDln8na9HOKANnieoKAJnsYkNrsYUAt04mDgJwyzB0BQZ3QVwTn77rEKC8gsPisBr5C7oYBqwI7Yg2/7sNfSOLE7OXK+tD7K4tl1d4jeKlvxYv2XIy/N2Xxs/sNC3kMGVpMAnYAAAAASUVORK5CYII='
  } else if (type == 'excel') {
    return 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzAxNDE0NjM0ODk4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQ1NzciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PHBhdGggZD0iTTYyNS42NjQgMTMyLjYwOHY2Ny4wNzJoMzA5Ljc2djQzLjAwOGgtMzA5Ljc2djY5LjYzMmgzMDkuNzZ2NDMuMDA4aC0zMDkuNzZ2NjguNjA4aDMwOS43NnY0My4wMDhoLTMwOS43NnY2OC42MDhoMzA5Ljc2djQzLjAwOGgtMzA5Ljc2djY4LjYwOGgzMDkuNzZ2NDMuMDA4aC0zMDkuNzZ2NjguMDk2aDMwOS43NnY0My4wMDhoLTMwOS43NnY4OS4wODhIMTAyNHYtNzU3Ljc2SDYyNS42NjR6TTAgOTE0Ljk0NEw1NzcuMDI0IDEwMjRWMEwwIDEwOS4wNTYiIHAtaWQ9IjQ1NzgiIGZpbGw9IiMwYTg0ZmYiPjwvcGF0aD48cGF0aCBkPSJNMjI5LjM3NiA2NjAuNDhoLTg5LjZsMTE4LjI3Mi0xODcuOTA0LTExMi42NC0xODAuNzM2aDkyLjE2bDY1LjUzNiAxMTkuODA4IDY3LjU4NC0xMTkuODA4aDg5LjA4OGwtMTEyLjY0IDE3Ny42NjRMNDY2Ljk0NCA2NjAuNDhoLTkzLjY5NmwtNzAuMTQ0LTEyNS40NC03My43MjggMTI1LjQ0eiIgcC1pZD0iNDU3OSIgZmlsbD0iIzBhODRmZiI+PC9wYXRoPjwvc3ZnPg=='
  } else if (type == 'word') {
    return 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzAxNDE0NzA1NjQ5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY3MjEiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PHBhdGggZD0iTTAgMFYxMDI0aDEwMjRWMHoiIGZpbGw9IiMzMTk2RkEiIHAtaWQ9IjY3MjIiPjwvcGF0aD48cGF0aCBkPSJNNzM1LjIzMiAzNTYuMTczOTEzbC05OS4xMDUzOTEgMzI0Ljc0MTU2NUg1NjkuNDMzMDQzbC02Ny45NDAxNzMtMjAzLjgyMDUyMS02Ny45NDAxNzQgMjAzLjgyMDUyMUgzNjYuODU5MTNMMjY3LjEzMDQzNSAzNTYuMTczOTEzaDg2LjAxNmw1Mi4zNTc1NjUgMjAwLjcwNEw0NzEuNTc0MjYxIDM1Ni4xNzM5MTNoNTkuMjEzOTEzbDY2LjY5MzU2NSAyMDAuNzA0TDY0OS44MzkzMDQgMzU2LjE3MzkxM3oiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjY3MjMiPjwvcGF0aD48L3N2Zz4='
  } else if (type == 'audio') {
    return 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzAxNDE1MjExMTc4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwNTcgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijk5MTMiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PHBhdGggZD0iTTEzMi4xMjkwMzIgMGg2NTIuNzE3NDJhMTMyLjEyOTAzMiAxMzIuMTI5MDMyIDAgMCAxIDg3Ljk5NzkzNSAzMy41NjA3NzRsMTQwLjA1Njc3NCAxMjQuOTk0MDY1QTEzMi4xMjkwMzIgMTMyLjEyOTAzMiAwIDAgMSAxMDU3LjAzMjI1OCAyNTcuMTIzMDk3djYyMi4wMzA0NTFhMTMyLjEyOTAzMiAxMzIuMTI5MDMyIDAgMCAxLTEzMi4xMjkwMzIgMTMyLjEyOTAzM0gxMzIuMTI5MDMyYTEzMi4xMjkwMzIgMTMyLjEyOTAzMiAwIDAgMS0xMzIuMTI5MDMyLTEzMi4xMjkwMzNWMTMyLjEyOTAzMmExMzIuMTI5MDMyIDEzMi4xMjkwMzIgMCAwIDEgMTMyLjEyOTAzMi0xMzIuMTI5MDMyeiIgZmlsbD0iIzJENkFFQSIgcC1pZD0iOTkxNCI+PC9wYXRoPjxwYXRoIGQ9Ik02Ni4wNjQ1MTYgNTgwLjA3OTQ4NGg5MjQuOTAzMjI2YTY2LjA2NDUxNiA2Ni4wNjQ1MTYgMCAwIDEgNjYuMDY0NTE2IDY2LjA2NDUxNnYyNDAuMDc4NDUyYTEzMi4xMjkwMzIgMTMyLjEyOTAzMiAwIDAgMS0xMzIuMTI5MDMyIDEzMi4xMjkwMzJIMTMyLjEyOTAzMmExMzIuMTI5MDMyIDEzMi4xMjkwMzIgMCAwIDEtMTMyLjEyOTAzMi0xMzIuMTI5MDMydi0yNDAuMDc4NDUyYTY2LjA2NDUxNiA2Ni4wNjQ1MTYgMCAwIDEgNjYuMDY0NTE2LTY2LjA2NDUxNnoiIGZpbGw9IiNDRURCRjgiIHAtaWQ9Ijk5MTUiPjwvcGF0aD48cGF0aCBkPSJNMjM4LjQ5MjkwMyA3MDguOTcxMzU1YzE3Ljc3MTM1NSAwIDMyLjIwNjQ1MiAxNC40MzUwOTcgMzIuMjA2NDUyIDMyLjIzOTQ4NHYxMTYuMDA5MjlhMzIuMjM5NDg0IDMyLjIzOTQ4NCAwIDEgMS02NC40NDU5MzYgMFY3NDEuMjQzODcxYzAtMTcuODA0Mzg3IDE0LjQzNTA5Ny0zMi4yMzk0ODQgMzIuMjM5NDg0LTMyLjIzOTQ4NHogbTU1NC4yODEyOTEgMGEzMi4yMzk0ODQgMzIuMjM5NDg0IDAgMCAwLTMyLjIzOTQ4NCAzMi4yMzk0ODR2MTE2LjAwOTI5YTMyLjIzOTQ4NCAzMi4yMzk0ODQgMCAwIDAgNjQuNDc4OTY3IDBWNzQxLjI0Mzg3MWEzMi4yMzk0ODQgMzIuMjM5NDg0IDAgMCAwLTMyLjIzOTQ4My0zMi4yMzk0ODR6IG0tNDE1LjcxMDk2OC0zOC42NDc3NDJjMTcuNzcxMzU1IDAgMzIuMjA2NDUyIDE0LjQwMjA2NSAzMi4yMDY0NTEgMzIuMjA2NDUydjE5My4zNzA4MzhhMzIuMjM5NDg0IDMyLjIzOTQ4NCAwIDEgMS02NC40NDU5MzUgMHYtMTkzLjM3MDgzOGMwLTE3LjgwNDM4NyAxNC40MzUwOTctMzIuMjA2NDUyIDMyLjIzOTQ4NC0zMi4yMDY0NTJ6IG0yNzcuMTQwNjQ1IDBhMzIuMjM5NDg0IDMyLjIzOTQ4NCAwIDAgMC0zMi4yMzk0ODQgMzIuMjA2NDUydjE5My4zNzA4MzhhMzIuMjM5NDg0IDMyLjIzOTQ4NCAwIDEgMCA2NC40NDU5MzYgMHYtMTkzLjM3MDgzOGEzMi4yMzk0ODQgMzIuMjM5NDg0IDAgMCAwLTMyLjIwNjQ1Mi0zMi4yMDY0NTJ6IG0tMTM4LjU3MDMyMy0zOC42ODA3NzRjMTcuODA0Mzg3IDAgMzIuMjA2NDUyIDE0LjQzNTA5NyAzMi4yMDY0NTIgMzIuMjM5NDg0djI3MC42OTkzNTRhMzIuMjM5NDg0IDMyLjIzOTQ4NCAwIDEgMS02NC40MTI5MDMgMHYtMjcwLjY5OTM1NGMwLTE3LjgzNzQxOSAxNC40MDIwNjUtMzIuMjM5NDg0IDMyLjIwNjQ1MS0zMi4yMzk0ODR6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSI5OTE2Ij48L3BhdGg+PHBhdGggZD0iTTM5My45NzU3NDIgNDA3LjcxNzE2MWExMDguNzc1MjI2IDc0LjE1NzQxOSAwIDEgMCAyMTcuNTUwNDUyIDAgMTA4Ljc3NTIyNiA3NC4xNTc0MTkgMCAxIDAtMjE3LjU1MDQ1MiAwWiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iOTkxNyI+PC9wYXRoPjxwYXRoIGQ9Ik00NTMuMjAyNTgxIDExMy4wNjk0MTlhNDkuNTQ4Mzg3IDQ5LjU0ODM4NyAwIDAgMSA3NC44NTEwOTYtNDIuNjExNjEzbDI0Mi4zNTc2NzggMTQ0LjE1Mjc3NWE0OS41NDgzODcgNDkuNTQ4Mzg3IDAgMSAxLTUwLjYzODQ1MiA4NS4xNTcxNjFMNTUyLjI5OTM1NSAyMDAuMTc1NDg0djE3MC4zMTQzMjJhNDkuNTQ4Mzg3IDQ5LjU0ODM4NyAwIDAgMS00NC43NTg3MSA0OS4zMTcxNjJsLTQuNzU2NjQ1IDAuMjMxMjI2YTQ5LjU0ODM4NyA0OS41NDgzODcgMCAwIDEtNDkuNTQ4Mzg3LTQ5LjU0ODM4OFYxMTMuMDY5NDE5eiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iOTkxOCI+PC9wYXRoPjwvc3ZnPg=='
  } else {
    // 未知类型
    return 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzAxNDE0NzQ3MTk5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijc3NTQiIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4Ij48cGF0aCBkPSJNNDMyLjIwOTI1MiA4MzMuNzAyNDk4YTQyLjY2NjQ1MyA0Mi42NjY0NTMgMCAxIDEgNDIuNjY2NDU0IDQyLjY2NjQ1MyA0Mi42NjY0NTMgNDIuNjY2NDUzIDAgMCAxLTQyLjY2NjQ1NC00Mi42NjY0NTN6TTUxMS45OTU1MiA1NjYuNjEwNWEzNi42OTMxNSAzNi42OTMxNSAwIDAgMC00Mi42NjY0NTMtMzcuOTczMTQzIDc4LjUwNjI3NCA3OC41MDYyNzQgMCAwIDAtNTcuMTczMDQ4IDI5LjQzOTg1M2wtNTUuMDM5NzI1LTUwLjc3MzA4QTE2My44MzkxODEgMTYzLjgzOTE4MSAwIDAgMSA0ODIuMTI5MDAzIDQ0Ny45OTc3NmM2OS45NzI5ODMgMCAxMjQuNTg2MDQ0IDMzLjI3OTgzNCAxMjQuNTg2MDQzIDExMS43ODYxMDhTNTExLjk5NTUyIDY2MS4zMzAwMjcgNTE3LjU0MjE1OSA3MzUuOTk2MzJINDMwLjA3NTkzQzQxNi40MjI2NjUgNjQ4Ljk1Njc1NSA1MTEuOTk1NTIgNjEyLjY5MDI3IDUxMS45OTU1MiA1NjYuNjEwNXogbTMxMi43NDUxMDMgMzgzLjk5ODA4SDIwMC4xMDM3NDZWNzIuMTA2MzA2SDUxMS45OTU1MnYyMzkuNzg1NDY4QTcyLjk1OTYzNSA3Mi45NTk2MzUgMCAwIDAgNTg0LjEwMTgyNiAzODMuOTk4MDhoMjM4LjkzMjEzOXpNNTgyLjgyMTgzMyAxMTAuNTA2MTE0bDIwMC45NTg5OTUgMjAxLjgxMjMyNGgtMjAwLjk1ODk5NXogbTI5MS44Mzg1NCAxOTEuMTQ1NzExTDU5Ny4zMjg0MjcgMjEuMzMzMjI3YTc2Ljc5OTYxNiA3Ni43OTk2MTYgMCAwIDAtMTQuNTA2NTk0LTExLjUxOTk0M2wtNC4yNjY2NDYtMi4xMzMzMjJoLTIuOTg2NjUyQTcxLjY3OTY0MiA3MS42Nzk2NDIgMCAwIDAgNTQ2LjEyODY4MyAwSDIwMC45NTcwNzVBNzIuOTU5NjM1IDcyLjk1OTYzNSAwIDAgMCAxMjcuOTk3NDQgNzIuMTA2MzA2djg3OS43ODIyNjhBNzIuOTU5NjM1IDcyLjk1OTYzNSAwIDAgMCAyMDAuOTU3MDc1IDEwMjMuOTk0ODhoNjIyLjkzMDIxOUE3MS4yNTI5NzcgNzEuMjUyOTc3IDAgMCAwIDg5NS45OTM2IDk1MS44ODg1NzRWMzUyLjQyNDkwNWE3MS42Nzk2NDIgNzEuNjc5NjQyIDAgMCAwLTIxLjMzMzIyNy01MC43NzMwOHoiIGZpbGw9IiNkODFlMDYiIHAtaWQ9Ijc3NTUiPjwvcGF0aD48L3N2Zz4='
  }
}
// 将网路图片转化成base64
export const toBase64 = (imgUrl) => {
  // 一定要设置为let，不然图片不显示
  const image = new Image()
  // 解决跨域问题
  image.setAttribute('Access-Control-Allow-Origin', 'anonymous')
  image.crossOrigin = 'anonymous'
  const imageUrl = imgUrl
  image.src = imageUrl
  // image.onload为异步加载
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d') as any
    context.drawImage(image, 0, 0, image.width, image.height)
    const quality = 1.0
    // 这里的dataurl就是base64类型
    // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
    const dataurl = canvas.toDataURL('image/jpeg', quality)

    return dataurl
  }
}
