import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        token:''

    },
    onLoad(){

    },
    onShow(){
        var token = cookieStorage.get('user_token');
        if(token) {
            this.setData({
                token:token
            })
        }
    },
    //跳到搜索页面
    jumpSearch(){
        wx.navigateTo({
            url:'/pages/index/search/main'
        })
    },
    //跳到创建圈子页面
    jumpSet(){
        if (this.data.token){
            wx.navigateTo({
                url:'/pages/index/setUp/main'
            })
        } else {
            var url = getUrl();
            wx.navigateTo({
                url: '/pages/user/login/main?url=' + url
            })
        }

    }

})