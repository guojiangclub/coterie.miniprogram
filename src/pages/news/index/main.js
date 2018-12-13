import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        contentList:[],
        hasMore:true,
        page:0,
        token:''

    },
    onLoad(){
      var token = cookieStorage.get('user_token');
      this.setData({
          token:token

      })
    },
    onShow(){
       if(token){
           this.getnotification(1);
       }
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            this.getnotification(page);
        } else {
            wx.showToast({
             image: '../../../assets/image/error.png',
             title: '再拉也没有啦'
             });
            return
        }
    },
    //获取除了点赞以外的消息通知列表
    getnotification(page) {
        wx.showLoading({
            title: '加载中',
            mask: true

        })
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api: 'api/notification',
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
    //跳转链接 跳到itemdetail 详情页 有关评论的就要带评论id
    jumpItem(e){
        var id = e.currentTarget.dataset.id;//圈子id
        var content_id = e.currentTarget.dataset.cid;//内容id
        var comment_id; //评论id
        if(e.currentTarget.dataset.mid){
            comment_id = e.currentTarget.dataset.mid
        } else {
            comment_id = ''
        }
        wx.navigateTo({
            url:'/pages/knowladge/itemDetail/main?id='+id+'&content_id='+content_id+'&comment_id='+comment_id
        })

    },
    //跳到圈子列表页
    jumpDetail(e){
        var id = e.currentTarget.dataset.id;//圈子id
        wx.navigateTo({
            url:'/pages/knowladge/detail/main?id='+id
        })

    },
    //发表问题之后跳到回答问题的页面去
    jumpReply(e){
        var id = e.currentTarget.dataset.id;//圈子id
        var qid = e.currentTarget.dataset.qid;//问题的id
        wx.navigateTo({
            url:'/pages/knowladge/replyQuestion/main?id='+id+'&question_id='+qid
        })
    },
    //跳到点赞列表页
    jumpAwesome(){
       if(token){
           wx.navigateTo({
               url:'/pages/news/awesome/main'
           })
       } else {
           var url = getUrl();
           wx.navigateTo({
               url: '/pages/user/login/main?url=' + url
           })
       }
    }




})
