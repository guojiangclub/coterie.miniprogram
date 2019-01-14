import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        id:'',//圈子id
        detail:'',
        info:'',//个人信息
        show_share:false,//分享
        coterie_url:'',//圈子url


    },
    onLoad(e){
        this.setData({
            id:e.id
        })
        this.getmeInfo();
        wx.hideShareMenu()
    },
    onShow(){
        this.getDetail(this.data.id);
    },
    onShareAppMessage(){
        var title = '';
        var path = '';
        var imageUrl = '';
        if(this.data.coterie_url){
            title = this.data.detail.login_user_meta.nick_name + '向你推荐' + this.data.detail.name;
            path = '/pages/knowladge/join/main?id='+this.data.id+'&invite_user_code='+this.data.detail.invite_user_code;
            imageUrl = this.data.coterie_url
        }
        return{
            title:title,
            path:path,
            imageUrl:imageUrl
        }
    },
    //跳到朋友圈生成海报
    getShearImg(){
        if(this.data.coterie_url){
            wx.navigateTo({
                url:'/pages/knowladge/shareCoterie/main?url='+this.data.coterie_url
            })
        }
        this.changeShare();
    },
    changeShare(){
        this.setData({
            show_share:!this.data.show_share
        })
        wx.hideShareMenu()
    },
    //跳到邀请嘉宾页面去
    jumpInvite(){
        wx.navigateTo({
            url:'/pages/knowladge/goInvite/main?id='+this.data.id
        })
    },
    shareSome(e){
        this.postImgUrl(this.data.detail.invite_user_code)
    },
    //请求圈子图片的url
    postImgUrl(code) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/coterie/share',
            header:{
                Authorization: token
            },
            data:{
                invite_user_code:code,
                pages: 'pages/knowladge/join/main'
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        show_share:!this.data.show_share,
                        coterie_url:res.data.url
                    })
                    wx.showShareMenu();

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
    //跳到查看详细信息去
    jumpAll(){
        wx.navigateTo({
            url:'/pages/knowladge/all/main?id='+this.data.id
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
                coterie_id:id
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
        wx.showModal({
            content:'您确定解散圈子吗？',
            success:res=>{
                if (res.confirm || (!res.confirm && !res.cancel)){
                    this.postDismiss(this.data.id)
                }
            }
        })
    },
    //请求退出圈子的接口
    postDropout(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/member/quit',
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
                        title:'退出圈子成功',
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
    //点击退出圈子的按钮
    dropOut(){
        this.postDropout(this.data.id);
    },
    //点击成员管理跳到成员管理页面
    jumpManage(){
        wx.navigateTo({
            url:'/pages/knowladge/memberManage/main?id='+this.data.id
        })
    },
    //邀请嘉宾

    //点击数据圈设置更新信息
    jumpchangeSet(){
        wx.navigateTo({
            url:'/pages/knowladge/update/main?id='+this.data.id
        })
    },
    //点击跳到个人中心页
    jumpPersonal(){
        wx.switchTab({
            url:'/pages/user/index/main'
        })

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


})