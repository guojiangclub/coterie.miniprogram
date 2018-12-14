import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
var a;
Page({
    data: {
        id:'',//圈子id
        question_id:'',//提问id
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
            question_id:e.question_id
        })
        if(e.notification_id){
            this.setData({
                notification_id:e.notification_id
            })
        }
        this.getQuestionContent(this.data.id,this.data.question_id,this.data.notification_id);
    },
    onShow(){
        if(a){
            a = false;
            return
        }
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
    //请求提问详情页接口
    getQuestionContent(coterie_id,content_id,notification_id){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.get({
            api: 'api/question',
            header:{
                Authorization: token
            },
            data:{
                coterie_id:coterie_id,
                question_id:content_id,
                notification_id:notification_id
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
            } else{
                var message = ''
                if (res.data) {
                    message = res.data.message
                }
                wx.showModal({
                    content: message || "请求失败",
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
    submit(){
        if (!this.data.commentValue) {
            wx.showModal({
                content: '请输入回复内容',
                showCancel: false
            })
        } else {
            this.replyComment()
        }
    },
    //请求回复评论接口
    replyComment(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api: 'api/content/store',
            header:{
                Authorization: token
            },
            data:{
                coterie_id: this.data.id,
                question_id: this.data.question_id,
                description: this.data.commentValue,
                style_type: 'question',
                content_type: 'default'
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    this.setData({
                        commentValue:''
                    })
                    wx.showToast({
                        title:'回复成功'
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/knowladge/detail/main?id=' + this.data.id
                        })
                    }, 1500)
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
    }

})