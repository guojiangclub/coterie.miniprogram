import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        is_pay:false

    },
    onLoad(e){
        this.setData({
            is_pay:e.is_pay
        })
    }

})