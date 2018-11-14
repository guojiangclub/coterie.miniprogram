import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{

    },
    jumpSet(){
        wx.navigateTo({
            url:'/pages/index/setUp/main'
        })
    }

})