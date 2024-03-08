import axios from 'axios'
// 域名设置
 const base_url = 'https://XXX'
const request = (option: any) => {
  const { url, method, params, data } = option
  
 const  session_Parms = JSON.parse(window.sessionStorage.getItem('headersUrl') as any) 
  console.log(session_Parms)
  return axios({
    method,
    url: base_url + url,
    data,
    params
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
