import axios from 'axios'
// const headersParm = {
//   appId: 'RxrRZJWPRsd2Z2PM9u',
//   appSecret: 'wawOhkjQgaiTQjlkqhAcvOnNEhOmmmSSNfsUvo6bXPSpGDz9NXtxifhMAfY0Sp3P',
// }
// 域名设置
// const base_url = 'https://file.lianqin.shop'
const request = (option: any) => {
  const { url, method, params, data } = option
  
 const  session_Parms = JSON.parse(window.sessionStorage.getItem('headersUrl') as any) 
  console.log(session_Parms)
  return axios({
    method,
    url: session_Parms.base_file_url + url,
    data,
    params,
    headers: {
      appId: session_Parms.appId,
      appSecret: session_Parms.appSecret,
    }
  }).then((res) => {
    console.log(res)
    if (res.status == 200) {
      return res.data as any
    } else {
      return res as any
    }
  })
}

export default {
  get: <T = any>(option: any) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: any) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: any) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: any) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  }
}
