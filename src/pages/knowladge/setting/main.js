import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        id:'',//圈子id
        detail:''


    },
    onShow(){
        this.getDetail(this.data.id)

    },
    onLoad(e){
        this.setData({
            id:e.id
        })
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
                id: id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        detail: res.data,
                        init: true
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
    //请求解散圈子的接口
    postDismiss(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/coterie/delete',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    wx.showToast({
                        title:'解散圈子成功',
                    })
                    setTimeout(() => {
                        wx.switchTab({
                            url:'/pages/index/index/index'
                        })
                    }, 1600)


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
    //点击解散圈子按钮
    disMiss(){
        this.postDismiss(this.data.id)
    },
    //点击成员管理跳到成员管理页面
    jumpManage(){
        wx.navigateTo({
            url:'/pages/knowladge/memberManage/main?id='+this.data.id
        })
    },
    //点击数据圈设置更新信息
    jumpchangeSet(){
        wx.navigateTo({
            url:'/pages/knowladge/update/main?id='+this.data.id
        })
    }


})