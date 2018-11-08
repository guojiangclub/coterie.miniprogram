/**
 * Created by admin on 2017/8/30.
 */
// import weapp from 'weapp-next'
import config from './config';
import  { getUrl }  from "./myapp.js"
// const {Http} = weapp(wx);
// const http = Http(config.GLOBAL.baseUrl);
var gbConfig = {
    appid: 'wx2a84b66430c95b11'
};
export const sandBox = {
    get({api, data, header}){
        if (wx.getStorageSync('globalConfig')) {
            gbConfig = wx.getStorageSync('globalConfig').data
        }
        if (header) {
            header.appid = gbConfig.appid
        } else {
            header = {};
            header.appid = gbConfig.appid
        }
        return new Promise((resolve, reject) => {

            wx.request({
                url:`${config.GLOBAL.baseUrl}${api}`,
                header:header,
                data:data,
                method:'GET',
                success:res => {

                    sandBox.error(res).then(()=>{
                        resolve(res)
                    })

                },
                fail:rej => {

                    reject(rej)
                }
            })
        })
    },
    post({api, data, header}){
        if (wx.getStorageSync('globalConfig')) {
            gbConfig = wx.getStorageSync('globalConfig').data
        }
        if (header) {
            header.appid = gbConfig.appid
        } else {
            header = {};
            header.appid = gbConfig.appid
        }
        return new Promise((resolve, reject) => {
            wx.request({
                url:`${config.GLOBAL.baseUrl}${api}`,
                data:data,
                header:header,
                method:'POST',
                success:res => {

                    sandBox.error(res).then(()=>{
                        resolve(res)
                    })
                },
                fail:rej => {
                    reject(rej)
                }
            })
        })
    },
    error(res){
        return new Promise((resolve,reject)=>{

            var url = getUrl();
            if (res.data.message == 'Unauthenticated.') {

                wx.removeStorageSync('user_token');
                wx.showModal({
                    title:'请重新登录',
                    duration:1500,
                    showCancel: false,
                    success:(res)=>{
                        if (res.confirm) {
                            wx.navigateTo({
                                url:`/pages/user/register/register?url=${url}`
                            })
                            return;
                        }
                    },
                    cancel:()=>{
                        wx.navigateTo({
                            url:`/pages/user/register/register?url=${url}`
                        })
                        return;
                    }
                })
                reject()
                return
            }

            resolve();
            return
        })

    },
    ajax({api, data, method, header}) {
        if (wx.getStorageSync('globalConfig')) {
            gbConfig = wx.getStorageSync('globalConfig').data
        }
        if (header) {
            header.appid = gbConfig.appid
        } else {
            header = {};
            header.appid = gbConfig.appid
        }
        return new Promise((resolve,reject) => {
            wx.request({
                url:`${config.GLOBAL.baseUrl}${api}`,
                data,
                header,
                method:method.toUpperCase(),
                success:res => {

                    sandBox.error(res).then(()=>{
                        resolve(res)
                    })
                },
                fail:rej => {
                    reject(rej)
                }
            })
        })
    },
    uploadFile({api,filePath,header,name}){
        if (wx.getStorageSync('globalConfig')) {
            gbConfig = wx.getStorageSync('globalConfig').data
        }
        if (header) {
            header.appid = gbConfig.appid
        } else {
            header = {};
            header.appid = gbConfig.appid
        }
        return new Promise((resolve,reject) =>{
            wx.uploadFile({
                url:`${config.GLOBAL.baseUrl}${api}`,
                header,
                filePath,
                name,
                success:res => {
                    resolve(res)
                },
                fail:rej => {
                    reject(rej)
                }
            })
        })
    },
    dowloadFile({api, filePath, header, name}) {
        if (wx.getStorageSync('globalConfig')) {
            gbConfig = wx.getStorageSync('globalConfig').data
        }
        if (header) {
            header.appid = gbConfig.appid
        } else {
            header = {};
            header.appid = gbConfig.appid
        }
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url:api,
                header,
                filePath,
                name,
                success:res => {
                    resolve(res)
                },
                fail:rej => {
                    reject(rej)
                }
            })
        })
    },
    APIs: {

    }
};