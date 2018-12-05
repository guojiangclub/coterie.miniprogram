import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        contentList:[],
        page:0,
        hasMore:true

    },
    onShow(){
        this.getpraoiseList(1)
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            this.getpraoiseList(page);
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
            return
        }
    },
    //获取除了点赞以外的消息通知列表
    getpraoiseList(page) {
        wx.showLoading({
            title: '加载中',
            mask: true

        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/notification/praise',
            header:{
                Authorization: token
            },
            data:{
                page:page
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    var pages = res.meta.pagination;
                    var current_page = pages.current_page;
                    var total_pages = pages.total_pages;
                    this.setData({
                        [`contentList[${page-1}]`]:res.data,
                        page:current_page,
                        hasMore:current_page < total_pages
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