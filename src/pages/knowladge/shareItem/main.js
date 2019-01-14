import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
var a;
Page({
    data: {
        show_share: false,  // 分享
        show_setting: false, // 设置
        id:'',//圈子id
        content_id:'',//圈子item  id
        itemdetail:{},
        commentValue:'',
        commentId:'',
        to_meta:{},
        replyType:'',
        comment_id:'',//从消息通知带来的id
        invite_user_code:'',//分享的code码子
    },
    onLoad(e){
        var id = '';
        var content_id = '';
        var invite_user_code = '';
        if(e.id){
            id = e.id
        }
        if(e.content_id){
            content_id = e.content_id
        }
        if(e.invite_user_code){
            invite_user_code = e.invite_user_code;

        }
        if(e.scene){
            var scene = decodeURIComponent(e.scene);
            var sceneArr = scene.split('_');
            if(sceneArr.length > 0){
                id = sceneArr[0];
            }
            if(sceneArr.length>1){
                content_id = sceneArr[1];
            }
            if(sceneArr.length>2){
                invite_user_code = sceneArr[2];
            }
        }
        this.setData({
            id: id,
            content_id: content_id,
            invite_user_code: invite_user_code
        })
        cookieStorage.set('invite_user_code',invite_user_code,'30n');
        this.getContent(id,content_id)

    },
    onShow(){
        if(a){
            a = false;
            return
        }
    },

    //回到首页
    backHome(){
        wx.switchTab({
            url:'/pages/index/index/index'
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
    getContent(coterie_id,content_id){
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var token = cookieStorage.get('user_token');
        sandBox.get({
            api: 'api/content/info',
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
                    var detail = res.data;
                    if(detail.meta_info.at_user){
                        var reg = '@'+detail.meta_info.at_user.nick_name;
                        var describeArr = detail.description.split(reg);
                        detail.describeArr = describeArr;
                    }
                    this.setData({
                        itemdetail:detail
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
    jumpJoin(){
        wx.redirectTo({
            url:'/pages/knowladge/join/main?id='+this.data.id
        })
    }
})