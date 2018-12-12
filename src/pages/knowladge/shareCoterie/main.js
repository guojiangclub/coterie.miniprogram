import {config,pageLogin,sandBox,getUrl,cookieStorage,is} from '../../../lib/myapp.js';
Page({
    data:{
        imgurl:''

    },
    onLoad(e){
       if (e.url){
           this.setData({
               imgurl:e.url

           })
       }
    },
    // 下载图片
    downImg() {
        if (this.data.imgurl) {
            wx.showLoading({
                title: '正在下载',
                mask: true
            });
            sandBox.dowloadFile({
                api: this.data.imgurl
            }).then(res => {
                if (res.statusCode == 200) {
                    wx.getSetting({
                        success: ret => {
                            // 如果之前没有授权
                            if (!ret.authSetting['scope.writePhotosAlbum']) {
                                wx.authorize({
                                    scope: 'scope.writePhotosAlbum',
                                    success: rej => {
                                        this.saveImg(res.tempFilePath);
                                    },
                                    // 用户拒绝授权
                                    fail: ret => {
                                        wx.openSetting({
                                            success: res => {
                                                if (!res.authSetting['scope.writePhotosAlbum']) {
                                                    wx.openSetting({
                                                        success: res => {

                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            } else {
                                this.saveImg(res.tempFilePath);
                            }
                        }
                    })
                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: '下载图片失败',
                        icon: 'none'
                    })
                }
            },err =>{

            })
        }
    },
    // 保存图片
    saveImg(path) {
        wx.saveImageToPhotosAlbum({
            filePath: path,
            success: res => {
                wx.hideLoading();
            },
            fail: rej => {
                wx.hideLoading();
                wx.showToast({
                    title: '保存图片失败',
                    icon: 'none'
                })
            }
        })
    },


})