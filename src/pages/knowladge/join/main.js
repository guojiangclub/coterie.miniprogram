import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';

Page({
    data: {
        descAll: false,
        guestAll: false,
        id: '',
        detail: '',
        init: false,
        show_desc_btn: false,
        show_guest_btn: false,
        is_black:false
    },
    onLoad(e) {

        if (e.id) {
          this.setData({
              id: e.id
          })
          this.getDetail(e.id)
      } else if(e.scene){
            var scene = decodeURIComponent(e.scene);
            var sceneArr = scene.split('_');
            if(sceneArr.length > 0){
                this.setData({
                    id:sceneArr[0]
                })
            }
            if(sceneArr.length>1){
                var invite_user_code = sceneArr[1];
                cookieStorage.set('invite_user_code',invite_user_code,'30n');
            }
            this.getDetail(this.data.id);
        }

        if (!this.data.id) {
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
    onShow(){
        wx.getSystemInfo({
            success:res=>{

                if(res.system.indexOf('iOS') != -1){
                    /*wx.showModal({
                     content:'十分抱歉，由于相关规范，暂不支持IOS。',
                     showCancel:false
                     })*/
                    this.setData({
                        is_black:true
                    })

                }
            }
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
    //免费加入圈子
    freeJoin(){
        if (!this.data.token) {
            wx.navigateTo({
                url:'/pages/user/login/main?url='+getUrl()
            })
            return
        }
       if (this.data.detail.is_perfect_user_info){
           if (this.data.detail.cost_type == 'charge')  {
               this.createOrder(this.data.id);
           } else {
               this.postfreeMember(this.data.id)
           }
       } else {
           return
       }
    },
    //请求免费加入圈子接口
    postfreeMember(id){
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        var invite_user_code = cookieStorage.get('invite_user_code') || '';
        sandBox.post({
            api:'api/member/store',
            data:{
                coterie_id:id,
                invite_user_code:invite_user_code
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
                        url:'/pages/knowladge/detail/main?id='+this.data.id
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
        var token = cookieStorage.get('user_token') || '';
        sandBox.get({
            api: 'api/coterie',
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
    // 获取openid
    getOpenid() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: (res) => {
                    sandBox.post({
                        api: 'api/oauth/miniprogram/openid',
                        data: {
                            code: res.code,
                            app: 'coterie'
                        }

                    }).then((res) => {
                        res = res.data
                        resolve(res.data.openid)
                    }).catch(() => {
                        reject('获取openid失败')
                    })
                },
                fail: () => {
                    wx.showModal({
                        content: "接口请求失败",
                        showCancel: false
                    })
                }
            })
        })
    },
    // 请求加入付费圈子接口
    createOrder(id) {
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api:'api/order/store',
            data:{
                coterie_id:id,
                is_ios:this.data.is_black
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if (res.status){
                    this.getOpenid().then(ret => {
                        var invite_user_code = cookieStorage.get('invite_user_code') || '';

                        var oauth = cookieStorage.get('user_token');
                        var data = {
                            openid: ret,
                            order_no: res.data.order_no,
                            invite_user_code:invite_user_code
                        };
                        sandBox.post({
                            api: `api/coterie/payment`,
                            data: data,
                            header: {
                                Authorization: oauth
                            }
                        }).then((res) => {
                            res = res.data;
                            if (res.status) {
                                this.charge(true, res.data.charge)
                            } else {
                                this.charge(false, res.message)
                            }
                        }).catch((rej) => {
                            this.charge(false)
                        })
                    })
                } else {
                    wx.showModal({
                        content:res.message ||  "服务器开了小差，请重试",
                        showCancel: false
                    });
                    wx.hideLoading();

                }
            } else {
                wx.showModal({
                    content:res.message ||  "服务器开了小差，请重试",
                    showCancel: false
                });
                wx.hideLoading();
            }
        }).catch(rej=>{
            wx.showModal({
                content:"服务器开了小差，请重试",
                showCancel: false
            });
            wx.hideLoading();
        })
    },
    // 支付
    charge(success, charge) {
        if (success) {
            var that = this;
            wx.requestPayment({
                "timeStamp": charge.credential.wechat.timeStamp,
                "nonceStr": charge.credential.wechat.nonceStr,
                "package": charge.credential.wechat.package,
                "signType": charge.credential.wechat.signType,
                "paySign": charge.credential.wechat.paySign,
                success: res => {

                    if (res.errMsg == 'requestPayment:ok') {
                        this.checkStatus(charge.charge_id);
                    } else {
                        wx.showModal({
                            content: '调用支付失败！',
                            showCancel: false
                        })
                        wx.hideLoading();
                    }
                },
                fail: err => {
                    console.log(err);
                    if (err.errMsg == 'requestPayment:fail cancel') {
                       /* wx.redirectTo({
                            url: `/pages/order/detail/detail?no=${that.data.order_no}`
                        })*/
                    } else {
                        wx.showModal({
                            content: '调用支付失败！',
                            showCancel: false
                        })
                    }
                    wx.hideLoading();
                }
            })
        } else {
            wx.hideLoading();
            wx.showModal({
                content: charge || '请求支付失败，请重试！',
                showCancel: false
            })
        }
    },
    // 校验状态
    checkStatus(id) {
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api:'api/coterie/payment/success',
            data:{
                charge_id:id
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
                        url:'/pages/knowladge/detail/main?id='+this.data.id
                    })
                } else {
                    wx.showModal({
                        content:res.message ||  "服务器开了小差，请重试",
                        showCancel: false
                    });

                }
            } else {
                if (res.data) {
                    var data = res.data;
                }
                wx.showModal({
                    content:data.message ||  "服务器开了小差，请重试",
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
})