import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
var a;
Page({
    data: {
        show_share: false,  // 分享
        show_setting: false, // 设置
        show_comment:false,//评论
        id:'',//圈子id
        content_id:'',//圈子item  id
        item:{},
        commentValue:'',
        commentList:[],//评论列表
        page:0,
        hasMore:true,
        commentId:''
    },
    onLoad(e){
        this.setData({
            id:e.id,
            content_id:e.content_id
        })
    },
    onShow(){
        if(a){
            a = false;
            return
        }
        this.postContent(this.data.id,this.data.content_id);
        this.getcomment(this.data.content_id,1);
    },
    changeSetting() {
        this.setData({
            show_setting: !this.data.show_setting
        })
    },
    //显示评论模块
    changeComment(e){
        this.setData({
            show_comment: !this.data.show_comment
        })
        if(e.currentTarget.dataset.id){
            this.setData({
                commentId:e.currentTarget.dataset.id
            })
        }
    },
    changeShare() {
        this.setData({
            show_share: !this.data.show_share
        })
    },
    //预览图
    preImage(e){
        a = true;
        var url = e.currentTarget.dataset.url;
        var urlList  = e.currentTarget.dataset.urllist;
        wx.previewImage({
            current:url,
            urls:urlList
        })
    },
    //请求数据圈动态详情页接口
    postContent(coterie_id,content_id){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.get({
            api: 'api/content',
            header:{
                Authorization: token
            },
            data:{
                coterie_id:coterie_id,
                content_id:content_id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        item:res.data
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
    //请求评论接口
    postComment(content_id,content){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/comment/store',
            header:{
                Authorization: token
            },
            data:{
                content:content,
                content_id:content_id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        commentValue:''
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
    //获取评论内容
    getComment(e){
        this.setData({
            commentValue:e.detail.value
        })
    },
    //点击发送按钮
    sendComment(){
        if(this.data.commentValue){
            if(this.data.commentId){
                this.replyComment(this.data.content_id,this.data.commentValue,this.data.commentId);
            }else {
                this.postComment(this.data.content_id,this.data.commentValue);
            }
            this.setData({
                show_comment:!this.data.show_comment
            })
        }
    },
    //点击幕布，清空数据
    clearData(){
      this.setData({
          show_comment:!this.data.show_comment,
          commentValue:'',
          commentId:''
      })
    },
    //请求评论列表
    getcomment(content_id,page){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.get({
            api: 'api/comment',
            header:{
                Authorization: token
            },
            data:{
                content_id:content_id,
                page:page
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
                        [`commentList[${page-1}]`]:res.data,
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
    //请求回复评论接口
    replyComment(content_id,content,comment_id){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/reply/store',
            header:{
                Authorization: token
            },
            data:{
                content:content,
                content_id:content_id,
                comment_id:comment_id
    },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        commentValue:''
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