import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        info:'',
        token:''

    },
    onLoad(){

    },
    onShow(){
        wx.getSystemInfo({
                success:res=>{

                    if(res.system.indexOf('iOS') != -1){
                        wx.showModal({
                            content:'十分抱歉，由于相关规范，暂不支持IOS。',
                            showCancel:false
                        })
                        this.setData({
                            is_black:true
                        })

                    } else {
                        var token = cookieStorage.get('user_token');
                        this.setData({
                            token :token
                        })
                        if(this.data.token){
                            this.getmeInfo();
                        }
                    }
                }
            }


        )


    },
    //请求me接口
    getmeInfo() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/me',
            header:{
                Authorization: token
            },
            data:{
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        info:res.data
                    })
                } else {
                    wx.showModal({
                        content:res.message ||  "请求失败",
                        showCancel: false
                    });
                }
                wx.hideLoading();
            }
            else{
                wx.showModal({
                    content:"请求失败",
                    showCancel: false
                });
                wx.hideLoading();
            }
        })
    },
    bindgetuserinfo(e){
        if (e.detail.userInfo) {
            this.updateUserInfo(e.detail.userInfo)
        }
    },
    //将得到的信息发送给后台
    updateUserInfo(info){
        wx.showLoading({
            title: '更新中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/users/update/info',
            header:{
                Authorization: token
            },
            data:{
                nick_name:info.nickName,
                sex:info.gender == 1 ? '男' : '女',
                avatar:info.avatarUrl,
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                   this.getmeInfo();
                } else {
                    wx.showModal({
                        content:res.message ||  "更新失败",
                        showCancel: false
                    });
                }
                wx.hideLoading();
            }
            else{
                wx.showModal({
                    content:"更新失败",
                    showCancel: false
                });
                wx.hideLoading();
            }
        })
    },
    //跳到登录页面去
    jumpLogin(){
        var url = getUrl();
        wx.navigateTo({
            url: '/pages/user/login/main?url=' + url
        })
    }

})