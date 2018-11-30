import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
var a;
Page({
    data: {
        show_share: false,  // 分享
        show_setting: false, // 设置
        show_comment:false,//评论
        id:'',//圈子id
        content_id:'',//圈子item  id
        itemdetail:{},
        commentValue:'',
        commentList:[],//评论列表
        page:0,
        hasMore:true,
        commentId:'',
        to_meta:{},
        replyType:''
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
    //剪贴板的内容
    clipBoard(e){
        var link = e.currentTarget.dataset.link;
        wx.getClipboardData({
            data:link,
            success:res=>{
                wx.showToast({
                    title:'复制链接成功'
                })
            }
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
        if(e.currentTarget.dataset.type){
            if (e.currentTarget.dataset.type == 'one'){
                //一级不需要传nick-name 跟user-id
                this.setData({
                    replyType:e.currentTarget.dataset.type
                })
            } else if(e.currentTarget.dataset.type == 'second'){
                //二级回复需要nick_name 跟 user-id
                var nick_name = e.currentTarget.dataset.nickname;
                var user_id = e.currentTarget.dataset.userid;
                this.setData({
                    to_meta:{
                        id:user_id,
                        nick_name:nick_name
                    },
                    replyType:e.currentTarget.dataset.type
                })
            }
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
                        itemdetail:res.data
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
                    wx.showToast({
                        title:'评论成功'
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
                if(this.data.replyType == 'one'){
                    this.replyComment(this.data.content_id,this.data.commentValue,this.data.commentId,'');
                } else if(this.data.replyType == 'second'){
                    this.replyComment(this.data.content_id,this.data.commentValue,this.data.commentId,this.data.to_meta);
                }
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
          commentId:'',
          to_meta:{},
          replyType:''
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
    replyComment(content_id,content,comment_id,to_meta){
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
                comment_id:comment_id,
                to_meta:to_meta || ''
    },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        commentValue:''
                    })
                    wx.showToast({
                        title:'回复评论成功'
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
    //删除评论
    postdDelete(comment_id,idx,index){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/comment/delete',
            header:{
                Authorization: token
            },
            data:{
                comment_id:comment_id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    var list = this.data.commentList;
                    list[idx].splice(index,1);
                    this.setData({
                        commentList:list,
                        'itemdetail.comment_count':this.data.itemdetail.comment_count+1
                    })
                    wx.showToast({
                        title:'删除成功'
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
    //点击删除按钮
    deleteComment(e){
        var idx = e.currentTarget.dataset.idx;
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.id;
        this.postdDelete(id,idx,index);
    },
    //请求内容点赞接口
    postPraise(content_id){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/content/praise/store',
            header:{
                Authorization: token
            },
            data:{
                content_id: content_id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    var  list = this.data.itemdetail.praise;
                    list.push(res.data);
                    this.setData({
                        'itemdetail.is_praise_user':1,
                        'itemdetail.praise_count':this.data.itemdetail.praise_count+1,
                        'itemdetail.praise':list
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
    //点击给内容点赞
    praiseStore(){
        if (this.data.itemdetail.is_praise_user == 1){
            return
        } else {
            this.postPraise(this.data.content_id)
        }
    },
    //请求评论点赞接口

})