import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        is_pay:false

    },
    onLoad(e){
        if (e.is_pay) {
            this.setData({
                is_pay:e.is_pay
            })
        }
    },
    create() {
        var data = cookieStorage.get('knowObj');
        data.price = 0;
        var token = cookieStorage.get('user_token');
        if (!data) {

            return
        }
        sandBox.post({
            api: 'api/coterie/store',
            data: data,
            header:{
                Authorization: token
            }
        }).then(res => {
            console.log(res);
        })
    }

})