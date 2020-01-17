import qs from "qs"
import axios from "axios";
import encodeParams from "@assets/sign"
const http = axios.create({
  baseURL: process.browser?"/":"http://service.inswindows.com",//根url,根据服务端与客户端区分
  timeout: 8000
});
//服务端http请求
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36
// 请求拦截器
http.interceptors.request.use( config =>{
  if(config.method=="post"){
    //post方式
    let data = qs.parse(config.data)
    config.data = encodeParams(config.url,{
      ...data
    })
  }else if(config.method=="get"){
    //get方式
    config.params = encodeParams(config.url,{
      ...config.params
    })
  }
  return config;
},  error =>{
  return Promise.reject(error);
});
http.interceptors.response.use( response =>{
  return response;
},  error =>{
  return Promise.reject(error);
});
export default http