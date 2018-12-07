import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data: {
        id:'',//圈子id
        page:0,
        hasMore:true,
        user_id:16,//用户id
        type:'user',
        contentList:[],
        detail:''
    },
    onLoad(e){
        var id = e.id;
        var user_id = e.user_id;
        this.setData({
            id:id,
            user_id:user_id
        })

    },
    onShow(){
        this.getContnetList(this.data.id,1,'user',this.data.user_id);
        this.getDetail(this.data.id);

    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.tagpage + 1;
            this.getContnetList(this.data.id,page,this.data.type,this.data.user_id);
        } else {
          /*  wx.showToast({
             image: '../../../assets/image/error.png',
             title: '再拉也没有啦'
             });*/
            return
        }
    },
    //获取内容列表
    getContnetList(id,page,type,value) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/coterie/content',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: id,
                page:page,
                type:type || '',
                value:value || ''
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    //分页数据
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
                    // 如果加入过当前课程，需要跳转到详情页面
                    if (res.data.is_coterie_member) {
                        /* wx.redirectTo({
                         url: '/pages/knowladge/detail/main?id=' + res.data.id
                         })*/
                    }
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
    //跳到动态详情页
    jumpItem(e){
        var content_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url:'/pages/knowladge/itemDetail/main?id='+this.data.id+'&content_id='+content_id
        })
    }
})