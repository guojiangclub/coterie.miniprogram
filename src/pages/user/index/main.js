import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        info:'',
        token:''

    },
    onLoad(){
        var token = cookieStorage.get('user_token');
        this.setData({
            token :token
        })

    },
    onShow(){
        if(this.data.token){
            this.getmeInfo();
        }

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
    //跳到登录页面去
    jumpLogin(){
        var url = getUrl();
        wx.navigateTo({
            url: '/pages/user/login/main?url=' + url
        })
    }

})