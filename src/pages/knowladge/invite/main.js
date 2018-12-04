import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';

Page({
    data: {
        descAll: false,
        guestAll: false,
        id: '',
        detail: '',
        init: false,
        show_desc_btn: false,
        show_guest_btn: false
    },
    onLoad(e) {
      if (e.id && e.code) {
          this.setData({
              id: e.id,
              code: e.code
          })
          this.getDetail(e.id)
      } else {
          wx.showModal({
              content: '参数错误',
              showCancel: false
          })
      }
      var token = cookieStorage.get('user_token');
      this.setData({
          token: token
      })
    },
    changeDesc() {
        this.setData({
            descAll: !this.data.descAll
        })
    },
    changeGuest() {
        this.setData({
            guestAll: !this.data.guestAll
        })
    },
    // 获取节点信息
    getDomInfo(name) {
        console.log(name);
        var query = wx.createSelectorQuery();
        query.select(name).boundingClientRect(res => {
            if (name == '.js_desc' && res.height == 64) {
                this.setData({
                    show_desc_btn: true
                })
            }
            if (name == '.js_guest' && res.height == 183) {
                this.setData({
                    show_guest_btn: true
                })
            }
            /*this.setData({
                [`domInfo.${type}`]: res.height
            })*/
            console.log(res.height);
        }).exec();
    },
    //邀请加入圈子
    freeJoin(){
        if (!this.data.token) {
            wx.navigateTo({
                url:'/pages/user/login/main?url='+getUrl()
            })
            return
        }
       if (this.data.detail.is_perfect_user_info){
           this.postfreeMember();
       } else {
           return
       }
    },
    //邀请加入圈子接口
    postfreeMember(){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api:'api/member/store/code',
            data:{
                code: this.data.code
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if (res.status){
                    //看一下请求成功
                    wx.redirectTo({
                        url:'/pages/knowladge/detail/main?id='+res.data.coterie_id
                    })
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
            wx.showModal({
                content:"服务器开了小差，请重试",
                showCancel: false
            });
            wx.hideLoading();
        })
    },
    // 更新用户信息
    bindgetuserinfo(e) {
        if (e.detail.userInfo) {
            this.updateUserInfo(e.detail.userInfo)
        }
    },
    updateUserInfo(e){
        wx.showLoading({
            title: '更新中',
            mask: true
        })
        var token = cookieStorage.get('user_token')
        sandBox.post({
            api: 'api/users/update/info',
            header:{
                Authorization: token
            },
            data:{
                nick_name:e.nickName,
                sex:e.gender == 1 ? '男' : '女',
                avatar:e.avatarUrl,
            },
        }).then(res =>{
            if(res.statusCode==200){
                res = res.data;
                if (res.status) {
                    wx.showToast({
                        title:'更新成功',
                        duration: 1500,
                    });
                    this.setData({
                        'detail.is_perfect_user_info': 1
                    })
                } else {
                    wx.showModal({
                        content:res.message ||  "更新失败",
                        showCancel: false
                    });
                }
                wx.hideLoading();
            }
            else{
                wx.showModal({
                    content:"更新失败",
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
                    // 如果加入过当前圈子，需要跳转到详情页面
                    if (res.data.is_coterie_member) {
                        wx.redirectTo({
                            url: '/pages/knowladge/detail/main?id=' + res.data.id
                        })
                    }
                    this.setData({
                        detail: res.data,
                        init: true
                    }, () => {
                        this.getDomInfo('.js_desc');

                        if (res.data.member_guest.length != 0) {
                            this.getDomInfo('.js_guest');
                        }
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