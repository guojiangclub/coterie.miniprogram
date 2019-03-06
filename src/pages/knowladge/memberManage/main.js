import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        id:7,//圈子id
        memberList:[],//成员列表
        guest_list:[],//嘉宾列表
        owner_list:[],//圈主
        forbidden_list:[],//禁言列表
        page:0,
        hasMore:true,
        is_show:false,
        activeItem:{},
        name:''
    },
    onLoad(e){
        this.setData({
            id:e.id
        })
    },
    onShow(){
        var token = cookieStorage.get('user_token');
        if (token){
            this.getMember(this.data.id,1,this.data.name)
        }
    },
    onReachBottom() {
        if (this.data.hasMore) {
            var page = this.data.page + 1;
            this.getMember(this.data.id,page,this.data.name);
        } else {
            wx.showToast({
                image: '../../../assets/image/error.png',
                title: '再拉也没有啦'
            });
        }
    },
    //点击每个item弹出设置
    showSet(e){
        this.setData({
            activeItem:e.currentTarget.dataset.item
        })
         if(this.data.activeItem.user_type == 'owner'){
            return
         } else {
             this.setData({
                 is_show:true
             })
         }
    },
    //设为嘉宾
    setGuest(){
        var user_type = "";
        if (this.data.activeItem.user_type == 'normal'){
            user_type = 'guest';
            this.postUser(this.data.activeItem.id,user_type,this.data.activeItem.coterie_id);
        }  else {
            return
        }

    },
    //邀请嘉宾

    //踢出知识圈数据
    delete(){
        this.postDelete(this.data.activeItem.id,this.data.activeItem.coterie_id)
    },
    //取消嘉宾
    cancleGuest(){
        if (this.data.activeItem.user_type == 'guest'){
            var user_type = 'normal';
            this.postUser(this.data.activeItem.id,user_type,this.data.activeItem.coterie_id);
        } else {
            return
        }
    },
    //请求踢出知识圈接口
    postDelete(id,coterie_id){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        this.setData({
            is_show:false
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api:'api/member/delete',
            data:{
                member_id:id,
                coterie_id:coterie_id
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if(res.status){
                    wx.showToast({
                        titel:'成功踢出知识圈'
                    })
                    this.getMember(this.data.id,1,this.data.name);
                } else {
                    wx.showModal({
                        content:res.message ||  "服务器开了小差，请重试",
                        showCancel: false
                    });
                }
            } else {
                wx.showModal({
                    content:res.message ||  "服务器开了小差，请重试",
                    showCancel: false
                });
            }
            wx.hideLoading();
        }).catch(rej=>{
            wx.hideLoading();
            wx.showModal({
                content:"服务器开了小差，请重试",
                showCancel: false
            });
        })

    },
    cancle(){
      this.setData({
          is_show:!this.data.is_show
      })
    },
    //请求设为嘉宾接口或者修改会员类型接口
    postUser(id,user_type,coterie_id){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        this.setData({
            is_show:false
        })
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api:'api/member/user',
            data:{
                member_id:id,
                user_type:user_type,
                coterie_id:coterie_id
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if(res.status){
                    this.getMember(this.data.id,1,this.data.name);
                    if(user_type == 'normal'){
                        wx.showToast({
                            title:'取消嘉宾成功'
                        })
                    } else if(user_type == 'guest'){
                        wx.showToast({
                            titel:'设置嘉宾成功'
                        })
                    }
                } else {
                    wx.showModal({
                        content:res.message ||  "服务器开了小差，请重试",
                        showCancel: false
                    });
                }
            } else {
                wx.showModal({
                    content:res.message ||  "服务器开了小差，请重试",
                    showCancel: false
                });
            }
            wx.hideLoading();
        }).catch(rej=>{
            wx.hideLoading();
            wx.showModal({
                content:"服务器开了小差，请重试",
                showCancel: false
            });
        })

    },
    //获取name
    changeName(e){
      this.setData({
          name:e.detail.value
      })
    },
    // 确认搜索
    sureSearch(){
       this.getMember(this.data.id,1,this.data.name) ;
    },
    //请求获取知识圈会员接口
    getMember(id,page,name){
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        var token = cookieStorage.get('user_token')
        sandBox.get({
            api:'api/member',
            data:{
                coterie_id:id,
                page:page,
                name:name || ''
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if(res.statusCode == 200){
                res = res.data;
                if(res.status){
                    var pages = res.meta.pagination;
                    var current_page = pages.current_page;
                    var total_pages = pages.total_pages;
                    var owner_list = res.meta.owner_list;
                     var guest_list = res.meta.guest_list;
                    /* var forbidden_list = res.meta.forbidden_list;*/
                    var member_list = res.data;
                    this.setData({
                        [`memberList[${page-1}]`]:member_list,
                        page:current_page,
                        hasMore:current_page<total_pages,
                        owner_list:owner_list,
                        guest_list:guest_list
                    })
                } else {
                    wx.showModal({
                        content:res.message || '服务器开了小差，请重试',
                        showCancel:false
                    })
                }
            } else {
                wx.showModal({
                    content:res.message || '服务器开了小差，请重试',
                    showCancel:false
                })
            }
            wx.hideLoading();
        }).catch(rej=>{
            wx.hideLoading();
            wx.showModal({
                content:'服务器开了小差，请重试',
                showCancel:false
            })
        })
    }

})