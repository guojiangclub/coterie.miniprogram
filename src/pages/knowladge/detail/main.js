import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
var a;
Page({
    data: {
        show_share: false,  // 分享
        coterie_url:'',//圈子分享图片的url
        content_url:'',//圈子content 分享图片的信息
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
        tagname:'',
        tagtitle:'',
        selectItem:{
            is_stick:'',
            is_recommend:''
        },//举报标记精华选中的item
        activeItem:'',//分享选中的item
        notification_id:''
    },
    onLoad(e){
      this.setData({
          id:e.id
      })
        if(e.notification_id){
          this.setData({
              notification_id:e.notification_id
          })
        }
        wx.hideShareMenu();
    },
    onShow(){
        if(a){
            a = false;
            return
        }
        var notification_id = this.data.notification_id || '';
        this.getTags(this.data.id,1);
        this.getDetail(this.data.id,notification_id);
        this.getStick(this.data.id);
        this.getContnetList(this.data.id,1,this.data.type,this.data.tagname);
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.tagpage + 1;
            this.getContnetList(this.data.id,page,this.data.type,this.data.tagname);
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
        if(this.data.coterie_url){
            title = this.data.detail.login_user_meta.nick_name + '向你推荐' + this.data.detail.name;
            path = '/pages/knowladge/join/main?id='+this.data.id+'&invite_user_code='+this.data.detail.invite_user_code;
            imageUrl = this.data.coterie_url
        } else if(this.data.content_url){
            title = '来自'+ this.data.detail.name + this.data.activeItem.user.nick_name+'的主题分享';
            path = '/pages/knowladge/shareItem/main?id='+this.data.id+'&content_id='+this.data.activeItem.id+'&invite_user_code='+this.data.detail.invite_user_code;
            imageUrl = this.data.content_url
        }
        return{
            title:title,
            path:path,
            imageUrl:imageUrl
        }
    },
    //回到首页
    backHome(){
        wx.switchTab({
            url:'/pages/index/index/index'
        })

    },
    //跳到朋友圈生成海报
    getShearImg(){
      if(this.data.coterie_url){
          wx.navigateTo({
              url:'/pages/knowladge/shareCoterie/main?url='+this.data.coterie_url
          })
      } else if(this.data.content_url){
          wx.navigateTo({
              url:'/pages/knowladge/shareCoterie/main?url='+this.data.content_url
          })
      }
        this.changeShare();
    },
    invitePerson(){
        this.postImgUrl(this.data.detail.invite_user_code);
    },
    shareSome(e){
        this.setData({
            activeItem:e.currentTarget.dataset.item
        },()=>{
            this.postContentUrl(this.data.detail.invite_user_code,this.data.activeItem.id)
        })

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
                    wx.showShareMenu()
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
    //跳到个人页
    jumpPersonal(e){
        var user_id = '';
        if(e.currentTarget.dataset.userid){
            user_id = e.currentTarget.dataset.userid
        }
        wx.navigateTo({
            url:'/pages/user/personal/main?id='+this.data.id + '&user_id='+user_id
        })
    },
    jumpPath(e) {
      var url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url + '?id='+this.data.id
        })
        this.setData({
            show_publish:false
        })
    },
    //热门标签scroll-view底部滑动
    scrolltolower(){
        if (this.data.tagMore) {
            var page = this.data.page + 1;
            this.getTags(this.data.id,page);
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
        }
    },
    changeSetting(e) {
        this.setData({
            selectItem: e.currentTarget.dataset.item
        }, () => {
            this.setData({
                show_setting: !this.data.show_setting
            })
        })
    },
    changeSet(){
        this.setData({
            show_setting: !this.data.show_setting,
            selectItem:''
        })
    },
    changeShare() {
        this.setData({
            show_share: !this.data.show_share,
            coterie_url:'',
            content_url:'',
            activeItem:''
        })
        wx.hideShareMenu();
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
    getDetail(id,notification_id) {
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
                coterie_id: id,
                notification_id:notification_id
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
                    //给数据做处理
                    if(res.data){
                        var list = res.data;
                        list.forEach((val,index)=>{
                            if(val.meta_info.at_user){
                                var reg = '@'+val.meta_info.at_user.nick_name;
                                var describeArr = val.description.split(reg);
                                val.describeArr = describeArr;
                            }
                        })
                    }
                    this.setData({
                        [`contentList[${page-1}]`]:list,
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

                    if (!res.data) {
                        return
                        wx.hideLoading();
                    }
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
            tagname = item;
        } else {
            tagname = '' ;
        }
        if(e.currentTarget.dataset.title){
            var title = e.currentTarget.dataset.title;
            this.setData({
                tagtitle:title
            })
        }
        this.setData({
            tagname:tagname,
            type:type
        })
        this.getContnetList(this.data.id,1,this.data.type,this.data.tagname);
        this.setData({
            show_filter:false
        })
    },
    //跳到圈子设置页面去
    jumpSetting(){
        wx.navigateTo({
            url:'/pages/knowladge/setting/main?id='+this.data.id
        })

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
                    this.getContnetList(this.data.id,1,this.data.type,this.data.tagname);

                    if (this.data.sticknews && this.data.sticknews.id == content_id) {
                        this.getStick(coterie_id);
                    }
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
        var content_id = this.data.selectItem.id;
        var coterie_id = this.data.selectItem.coterie_id;
        this.postDeletecontent(content_id,coterie_id);
    },
    //圈主设置为置顶状态
    setStick(){
        //type = 1 为置顶
        var content_id = this.data.selectItem.id;
        var coterie_id = this.data.selectItem.coterie_id;
        this.postSetStick(content_id,coterie_id,1);
    },
    cancleStick(){
        //type = 0 为取消置顶
        var content_id = this.data.selectItem.id;
        var coterie_id = this.data.selectItem.coterie_id;
        this.postSetStick(content_id,coterie_id,0);
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
                        this.getStick(coterie_id);
                        this.getContnetList(this.data.id,1,this.data.type,this.data.tagname);

                    } else {
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
                    this.getContnetList(this.data.id,1,this.data.type,this.data.tagname);
                    if(type == 1){
                        wx.showToast({
                            title:'标记成功',
                            icon:'success'
                        })
                    } else {
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
        var content_id = this.data.selectItem.id;
        var coterie_id = this.data.selectItem.coterie_id;
        this.postSetRecommend(content_id,coterie_id,1);
    },
    cancleRecommend(){
        //type = 0 为取消置顶
        var content_id = this.data.selectItem.id;
        var coterie_id = this.data.selectItem.coterie_id;
        this.postSetRecommend(content_id,coterie_id,0);
    },
    //请求点赞接口
    postPraise(content_id,idx,index){
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
                   //
                    this.setData({
                        [`contentList[${idx}][${index}].is_praise_user`]:1,
                        [`contentList[${idx}][${index}].praise_count`]:this.data.contentList[idx][index].praise_count+1
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
    //点赞
    givePraise(e){
        var idx = e.currentTarget.dataset.idx;
        var index = e.currentTarget.dataset.index;
        var content_id = e.currentTarget.dataset.id;
        this.postPraise(content_id,idx,index);
    },
    //剪贴板的内容
    clipBoard(e){
        var link = e.currentTarget.dataset.link;
        wx.setClipboardData({
            data:link,
            success:res=>{
                wx.getClipboardData({
                    success:res=>{
                        wx.showToast({
                            title:'复制链接成功'
                        })
                    }
                })
            }
        })
    },
    //跳到知识圈动态详情页
    jumpItemDetail(e){
        var content_id =  e.currentTarget.dataset.id;
        wx.navigateTo({
            url:'/pages/knowladge/itemDetail/main?id='+this.data.id + '&content_id='+content_id
        });
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
    }
    })