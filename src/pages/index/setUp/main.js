import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        checked:false
    },
    checkboxChange(){
        this.setData({
            checked:!this.data.checked
        })
    },
    jumpNext(){
        if (this.data.checked){
            wx.navigateTo({
                url:'/pages/index/fillIn/main'
            })
        } else {
            return
        }
    }

})