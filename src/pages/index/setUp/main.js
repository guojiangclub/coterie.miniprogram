import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        checked:false
    },
    checkboxChange(){
        this.setData({
            checked:!this.data.checked
        })
    }

})