import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data: {
        descAll: false,
        guestAll: false,
        detail:'',
        id:'',//圈子id
        show_desc_btn:false,
        show_guest_btn:false

    },
    onLoad(e){
        this.setData({
            id:e.id
        })
        this.getDetail(e.id);

    },
    changeDesc() {
        this.setData({
            descAll: !this.data.descAll
        })
    },
    changeGuest() {
        this.setData({
            guestAll: !this.data.guestAll
        })
    },
    // 获取节点信息
    getDomInfo(name) {
        var query = wx.createSelectorQuery();
        query.select(name).boundingClientRect(res => {
            if (name == '.js_desc' && res.height == 64) {
                this.setData({
                    show_desc_btn: true
                })
            }
            if (name == '.js_guest'&& res.height == 183) {
                this.setData({
                    show_guest_btn: true
                })
            }
            /*this.setData({
             [`domInfo.${type}`]: res.height
             })*/
        }).exec();
    },
    // 获取圈子详情
    getDetail(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/coterie',
            header:{
                Authorization: token
            },
            data:{
                id:id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        detail: res.data,
                        init: true
                    },()=>{
                        this.getDomInfo('.js_desc');

                        if (res.data.member_guest.length != 0) {
                            this.getDomInfo('.js_guest');
                        }
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
})