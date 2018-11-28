import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data: {
        show_share: false,  // 分享
        show_setting: false, // 设置
        show_publish: false, // 发表
        show_filter: false, // 筛选
        id:'',//圈子id
        detail:'',
        init:false,
        memberList:[],
        contentList:[],
        page:0,
        hasMore:true,
        sticknews:{},
        hotTagList:[],//热门标签列表
        tagpage:0,
        tagMore:true,
        type:'',
        tagname:''
    },
    onLoad(e){
      this.setData({
          id:e.id
      })
    },
    onShow(){
        this.getDetail(this.data.id);
        this.getStick(this.data.id);
        this.getContnetList(this.data.id,1);
        this.getTags(this.data.id,1);
    },
    onReachBottom() {
        if (this.data.tagMore) {
            var page = this.data.tagpage + 1;
            this.getContnetList(this.data.id,page);
        } else {
            /*wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });*/
            return
        }
    },
    //热门标签scroll-view底部滑动
    scrolltolower(){
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            this.getTags(this.data.id,page);
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
        }
    },
    changeSetting() {
        this.setData({
            show_setting: !this.data.show_setting
        })
    },
    changeShare() {
        this.setData({
            show_share: !this.data.show_share
        })
    },
    changePublish() {
        this.setData({
            show_publish: !this.data.show_publish
        })
    },
    changeFilter() {
        this.setData({
            show_filter: !this.data.show_filter
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
                        init: true,
                        memberList:res.data.member_guest.concat(res.data.member_normal)
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
    //获取置顶状态 内容
    getStick(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/content/stick',
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
                   this.setData({
                       sticknews:res.data
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
    //获取热门标签
    getTags(id,page) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/content/tags',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: id,
                page:page
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    if (!res.data) return
                    //分页数据
                    var pages = res.data.meta;
                    var current_page = pages.current_page;
                    var total_pages = pages.total_pages;
                    this.setData({
                        [`hotTagList[${page-1}]`]:res.data.data,
                        tagpage:current_page,
                        tagMore:current_page < total_pages
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
    //切换热门标签tab
    changeTab(e){
        var type = e.currentTarget.dataset.type;
        var tagname = ''
        if(e.currentTarget.dataset.item){
            var item = e.currentTarget.dataset.item;
            tagname = item.name;
        } else {
            tagname = '' ;
        }
        this.setData({
            tagname:tagname,
            type:type
        })
        this.getContnetList(this.data.id,1,this.data.type,this.data.tagname);
        this.setData({
            show_filter:false
        })
    }
})