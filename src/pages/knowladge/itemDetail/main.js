import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
var a;
Page({
    data: {
        init: false,
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
        replyType:'',
        comment_id:'',//从消息通知带来的id
        content_url:'',
        notification_id:''

    },
    onLoad(e){
        this.setData({
            id:e.id,
            content_id:e.content_id
        });
        if(e.comment_id){
            this.setData({
                comment_id:e.comment_id
            })
        }
        if(e.notification_id){
            this.setData({
                notification_id:e.notification_id
            })
        }
    },
    onShow(){
        if(a){
            a = false;
            return
        }
        this.postContent(this.data.id,this.data.content_id,this.data.notification_id);
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            var comment_id = this.data.comment_id || '';
            this.getcomment(this.data.content_id,comment_id,page);
        } else {
            /*wx.showToast({
             image: '../../../assets/image/error.png',
             title: '再拉也没有啦'
             });*/
            return
        }
    },
    onShareAppMessage(){
        var title = '';
        var path = '';
        var imageUrl = '';
        if(this.data.content_url){
            title = '来自'+ this.data.itemdetail.coterie.name + this.data.itemdetail.user.nick_name+'的主题分享';
            path = '/pages/knowladge/shareItem/main?id='+this.data.id+'&content_id='+this.data.content_id+'&invite_user_code='+this.data.itemdetail.invite_user_code;
        }
        return{
            title:title,
            path:path
        }
    },
    changeSetting() {
        this.setData({
            show_setting: !this.data.show_setting
        })
    },
    changeSet(){
        this.setData({
            show_setting: !this.data.show_setting
        })
    },
    jumpPersonal(e){
        var user_id = '';
        if(e.currentTarget.dataset.userid){
            user_id = e.currentTarget.dataset.userid
        } else {
            user_id = this.data.itemdetail.user_id
        }
      wx.navigateTo({
          url:'/pages/user/personal/main?id='+this.data.id + '&user_id='+user_id
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
            show_share: !this.data.show_share,
            content_url:''
        })
        wx.hideShareMenu()
    },
    //跳到朋友圈生成海报
    getShearImg(){
        if(this.data.content_url){
            wx.navigateTo({
                url:'/pages/knowladge/shareCoterie/main?url='+this.data.content_url
            })
        }
        this.changeShare();
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
    report(){
        wx.showModal({
            content:'举报成功，待管理员审核',
            showCancel:false
        })
    },
    //请求果酱圈动态详情页接口
    postContent(coterie_id,content_id,notification_id){
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
                content_id:content_id,
                notification_id:notification_id

            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    var detail = res.data;
                    if(detail.meta_info.at_user){
                        var reg = '@'+detail.meta_info.at_user.nick_name;
                        var describeArr = detail.description.split(reg);
                        detail.describeArr = describeArr;
                    }
                    this.setData({
                        itemdetail:detail,
                        init: true
                    })
                    if(detail){
                        var comment_id = this.data.comment_id || '';
                        this.getcomment(this.data.content_id,comment_id,1);
                    }
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
    getcomment(content_id,comment_id,page){
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
                comment_id:comment_id,
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
                    if (res.meta.comment && res.data) {
                        res.data.forEach((item, index) => {
                            if (item.id == res.meta.comment.id) {
                                res.data.splice(index, 1)
                            }
                        })
                    }
                    if (res.meta.comment && current_page == '1') {
                        res.data.unshift(res.meta.comment)
                    }
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
                        'itemdetail.comment_count':this.data.itemdetail.comment_count-1
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
    shareSome(e){
        this.postContentUrl(this.data.itemdetail.invite_user_code,this.data.content_id,this.data.notification_id)
    },
    //请求content图片的url
    postContentUrl(code,content_id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/content/share',
            header:{
                Authorization: token
            },
            data:{
                invite_user_code:code,
                content_id:content_id,
                pages: 'pages/knowladge/shareItem/main'
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        show_share:!this.data.show_share,
                        content_url:res.data.url
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
    commentPraise(comment_id,idx,index){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/comment/praise/store',
            header:{
                Authorization: token
            },
            data:{
                comment_id: comment_id
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        [`commentList[${idx}][${index}].is_praise_user`]:1,
                        [`commentList[${idx}][${index}].praise_count`]:this.data.commentList[idx][index].praise_count + 1
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
    //点击评论的赞按钮
    praiseComment(e){
        var idx = e.currentTarget.dataset.idx;
        var index = e.currentTarget.dataset.index;
        var id = e.currentTarget.dataset.id;
        this.commentPraise(id,idx,index);
    },
    //圈主设置置顶动态或者取消动态
    postSetStick(content_id,coterie_id,type){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/content/stick',
            header:{
                Authorization: token
            },
            data:{
                content_id: content_id,
                coterie_id:coterie_id,
                type:type

            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        show_setting:false
                    });
                    if(type == 1){
                        wx.showToast({
                            title:'置顶成功',
                            icon:'success'
                        })
                        this.setData({
                            'itemdetail.is_stick':1
                        })
                    } else {
                        this.setData({
                            'itemdetail.is_stick':0
                        })
                        wx.showToast({
                            title:'取消置顶',
                            icon:'success'
                        })
                    }
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
    //圈主设置为置顶状态
    setStick(){
        //type = 1 为置顶
        var content_id = this.data.content_id;
        var coterie_id = this.data.id;
        this.postSetStick(content_id,coterie_id,1);
    },

    cancleStick(){
        //type = 0 为取消置顶
        var content_id = this.data.content_id;
        var coterie_id = this.data.id;
        this.postSetStick(content_id,coterie_id,0);
    },
    //圈主删除动态或者自己删除动态
    postDeletecontent(content_id,coterie_id){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/content/delete',
            header:{
                Authorization: token
            },
            data:{
                content_id: content_id,
                coterie_id:coterie_id,
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        show_setting:false
                    });
                    wx.navigateTo({
                        url:'/pages/knowladge/detail/main?id='+coterie_id
                    })
                    wx.showToast({
                        title:'删除动态成功',
                        icon:'success'
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
    deleteContent(){
        var content_id = this.data.content_id;
        var coterie_id = this.data.id;
        this.postDeletecontent(content_id,coterie_id);
    },
    //圈主或者嘉宾推荐精华或者取消精华
    postSetRecommend(content_id,coterie_id,type){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/content/recommended',
            header:{
                Authorization: token
            },
            data:{
                content_id: content_id,
                coterie_id:coterie_id,
                type:type
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        show_setting:false
                    });
                    if(type == 1){
                        wx.showToast({
                            title:'标记成功',
                            icon:'success'
                        })
                        this.setData({
                            'itemdetail.is_recommend':1
                        })
                    } else {
                        this.setData({
                            'itemdetail.is_recommend':0
                        })
                        wx.showToast({
                            title:'取消成功',
                            icon:'success'
                        })
                    }
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
    //圈主设置为推荐精华
    setRecommend(){
        //type = 1 为置顶
        var content_id = this.data.content_id;
        var coterie_id = this.data.id;
        this.postSetRecommend(content_id,coterie_id,1);
    },
    cancleRecommend(){
        //type = 0 为取消置顶
        var content_id = this.data.content_id;
        var coterie_id = this.data.id;
        this.postSetRecommend(content_id,coterie_id,0);
    },

})