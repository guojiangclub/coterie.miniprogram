import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        is_pay:false,
        price: 0
    },
    onLoad(e){
        if (e.is_pay) {
            this.setData({
                is_pay:e.is_pay
            })
        }
    },
    setPrice(e) {
        this.setData({
            price: e.detail.value
        })
    },
    create() {
        var token = cookieStorage.get('user_token');
        var data = cookieStorage.get('knowObj');
        if (!data) {
            wx.showModal({
                content: '数据不全，请返回重新填写',
                showCancel: false
            })
            return
        }
        data.price = this.data.price * 100;
        data.duration_type = 'joined';
        wx.showLoading({
            content: '创建中',
            mask: true
        })
        sandBox.post({
            api: 'api/coterie/store',
            data: data,
            header:{
                Authorization: token
            }
        }).then(res => {
            if (res.statusCode == 200) {
                res = res.data;
                if (res.status) {
                    wx.showToast({
                        title: '创建成功',
                        mask: true
                    })
                    cookieStorage.clear('knowObj');
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/knowladge/detail/main?id=' + res.data.id
                        })
                    }, 1000)
                } else {
                    wx.showModal({
                        content: res.message || '创建失败',
                        showCancel: false
                    })
                }
            }  else {
                wx.showModal({
                    content: '创建失败',
                    showCancel: false
                })
            }
            wx.hideLoading();
        }).catch(err => {
            wx.showModal({
                content: '创建失败',
                showCancel: false
            })
            wx.hideLoading();
        })
    }

})