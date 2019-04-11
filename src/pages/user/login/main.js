import {config, getUrl, pageLogin, sandBox, cookieStorage} from '../../../lib/myapp.js';
Page({
    data: {
        code: '',
        url: '',
        logo: '',
    },
    onLoad(e){
        if (e.url) {
            this.setData({
                url: decodeURIComponent(e.url)
            })
        }
    },
    onShow() {
        var token=cookieStorage.get('user_token');
        this.setData({
            token:token
        });
        var initInfo = cookieStorage.get('init');
        if (initInfo && initInfo.shop_show_logo) {
            this.setData({
                logo: initInfo.shop_show_logo
            })
        }

        if(token){
            wx.switchTab({
                url: '/pages/user/index/main'
            })
        } else {
            this.wxLogin();
        }
    },
    getCode() {
        wx.login({
            success: res => {
                if (res.code) {
                    this.setData({
                        code: res.code
                    })
                } else {
                    wx.showToast({
                        title: '获取code失败',
                        icon: 'none'
                    })
                }
            }
        })
    },
    wxLogin() {
        wx.showLoading({
            title: '正在自动登录',
            mask: true
        })
        wx.login({
            success: res => {
                if (res.code) {

                    this.autoLogin(res.code);
                } else {
                    wx.showToast({
                        title: '获取code失败',
                        icon: 'none'
                    })
                }
            }
        })
    },
    jumpLogin(){
        if (this.data.url) {
            wx.navigateTo({
                url: '/pages/user/register/main?url=' + encodeURIComponent(this.data.url) + '&open_id=' + this.data.open_id
            })
        } else {
            wx.navigateTo({
                url: '/pages/user/register/main?open_id=' + this.data.open_id
            })
        }

    },
    getPhoneNumber(e) {
        if (e.detail.encryptedData) {
            this.phone(e);
        } else {
            this.jumpLogin();
        }
    },

    phone(e) {
        wx.showLoading({
            title: '正在登录',
            mask: true
        })
        sandBox.post({
            api: 'api/oauth/miniprogram/mobile',
            data: {
                open_type:'miniprogram',
                code: this.data.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                open_id: this.data.open_id,
                app: 'coterie'
            }
        }).then(res => {
            if (res.statusCode == 200) {
                res = res.data;
                console.log(res);
                if (res.data.access_token) {
                    var access_token = res.data.token_type + ' ' + res.data.access_token;
                    var expires_in = res.data.expires_in || 315360000;
                    cookieStorage.set("user_token", access_token, expires_in);
                    if (this.data.url) {
                        var path = [
                            'pages/index/index/index',
                            'pages/user/index/main',
                            'pages/news/index/main'
                        ];
                        var pathIndex = path.indexOf(this.data.url);
                        if (pathIndex == -1) {
                            wx.redirectTo({
                                url:"/"+this.data.url
                            })
                        } else {
                            wx.switchTab({
                                url:"/"+this.data.url
                            })
                        }
                    } else {
                        wx.switchTab({
                            url: '/pages/user/index/main'
                        })
                    }
                } else {
                    wx.showModal({
                        content: res.message || '请求失败，请重试',
                        showCancel: false
                    })
                    this.getCode();
                }
            } else {
                this.getCode();
                wx.showModal({
                    content: '请求失败，请重试',
                    showCancel: false
                })
            }
            wx.hideLoading();
        }).catch(rej => {
            this.getCode()
            wx.hideLoading();
            wx.showModal({
                content: '请求失败，请重试',
                showCancel: false
            })
        })
    },
    autoLogin(code) {
        sandBox.post({
            api: 'api/oauth/miniprogram/login',
            data: {
                code: code,
                open_type:'miniprogram',
                app: 'coterie'
            },
        }).then(res => {
            if (res.statusCode == 200) {
                res = res.data;
                if (res.data && res.data.open_id) {
                    this.setData({
                        open_id: res.data.open_id
                    })
                    this.getCode();
                }
                // 如果接口返回token就直接登录，如果没有则弹出授权
                if (res.data.access_token) {
                    wx.hideLoading();
                    var access_token = res.data.token_type + ' ' + res.data.access_token;
                    var expires_in = res.data.expires_in || 315360000;
                    cookieStorage.set("user_token", access_token, expires_in);
                    if (this.data.url) {
                        var path = [
                            'pages/index/index/index',
                            'pages/user/index/main',
                            'pages/news/index/main'
                        ];
                        var pathIndex = path.indexOf(this.data.url);
                        if (pathIndex == -1) {
                            wx.redirectTo({
                                url:"/"+this.data.url
                            })
                        } else {
                            wx.switchTab({
                                url:"/"+this.data.url
                            })
                        }
                    } else {
                        wx.switchTab({
                            url: '/pages/user/index/main'
                        })
                    }
                } else {
                    wx.hideLoading();
                }

            } else {
                wx.showModal({
                    content:res.message || '请求失败，请重试',
                    showCancel: false,
                    success: res=>{
                        if (res.confirm || (!res.cancel && !res.confirm)) {
                            this.wxLogin();
                        }
                    }
                })
                wx.hideLoading();
            }
        }).catch(rej => {
            wx.showModal({
                content:'请求失败，请重试',
                showCancel: false,
                success: res=>{
                    if (res.confirm || (!res.cancel && !res.confirm)) {
                        this.wxLogin();
                    }
                }
            })
            wx.hideLoading();
        })
    }
})