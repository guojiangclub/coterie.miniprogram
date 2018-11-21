


import {is,config,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        codes:{
            total:60,
            access_token:null,
            codeText:"获取验证码"
        },
        tellphone:"",
        identifyingcode:"",
        sending:false,
        checked:false,
        orginUrl:"",
        showLoading: false,
        message:"",
        open_id: '',

        code: '',
        shop_id: '',
        unionInFo: '',
        openInFo: '',
        config: ''
    },
    changeChecked(e){
        // console.log(e);
        this.setData({
            checked:!this.data.checked
        })
    },
    changeCode(e){
        this.setData({
            tellphone: e.detail.value
        })
    },
    changeIdentifyCode(e){

        this.setData({
            identifyingcode: e.detail.value
        })
    },
    random(){
        return Math.random().toString(36).substr(2,24);
    },
    onLoad(e){
        // 第三方平台配置颜色
        var bgConfig = cookieStorage.get('globalConfig') || '';
        this.setData({
            config: bgConfig
        })
        if (e.url) {
            this.setData({
                orginUrl:decodeURIComponent(e.url)
            });
        }

        if (e.open_id) {
            this.setData({
                open_id: e.open_id
            })
        }
    },
    onShow() {
        var token=cookieStorage.get('user_token');
        this.setData({
            token:token
        });
        if(token){
            wx.switchTab({
                url: '/pages/user/index/main'
            })
        }

    },
    getCode(){
        if(this.data.sending) return;
        var randoms=this.random();
        this.setData({
            sending:true,
            'codes.codeText':"短信发送中",
            'codes.access_token':randoms
        });
        var fn;
        fn=this.getLoginCode;
        fn(()=>{
            var total =this.data.codes.total;
            this.setData({
                'codes.codeText':total+"秒后再发送"
            });
            var timer =setInterval(()=>{
                total--;
                this.setData({
                    'codes.codeText':total+"秒后再发送"
                });
                if(total<1){
                    this.setData({
                        sending:false,
                        'codes.codeText':"获取验证码"
                    });
                    clearInterval(timer);
                }
            },1000);
        },()=>{
            this.setData({
                sending:false,
                'codes.codeText':"获取验证码"
            });
        });
    },
    getLoginCode(resolve,reject){
        var message =null;
        if(!is.has(this.data.tellphone)){
            message = "请输入您的手机号";
        } else if(!is.mobile(this.data.tellphone)){
            message = '手机号格式不正确，请重新输入';
        }
        if(message){
            this.setData({
                message:message
            });
            reject();
            setTimeout(()=>{
                this.setData({
                    message:""
                });
            },3000)
            return
        }
        sandBox.post({
            api:"api/sms/verify-code",

            data:{
                mobile:this.data.tellphone,
                access_token:this.data.codes.access_token
            },
        }).then(res =>{
            if(res.data.success){
                resolve();
            }
            else{
                reject();
            }
        })
        // resolve();
    },
    submit(){
        var message=null;
        if(!is.has(this.data.tellphone)){
            message = "请输入您的手机号";
        } else if(!is.mobile(this.data.tellphone)){
            message = '手机号格式不正确，请重新输入';
        } else if(!is.has(this.data.identifyingcode)){
            message="请填写验证码";
        } else if(!is.has(this.data.checked)){
            message="请同意此协议";
        }
        if(message){
            this.setData({
                message:message
            });
            setTimeout(()=>{
                this.setData({
                    message:""
                });
            },3000)
            return
        }
        this.setData({
            showLoading: true
        })
        this.quickLogin();
    },
    quickLogin(){
        var that=this;
        var data={
            mobile:that.data.tellphone,
            code:that.data.identifyingcode,
            open_id: this.data.open_id
        };
        sandBox.post({
            api:"api/oauth/sms",
            data:data,
        }).then(res =>{
            if (res.statusCode == 200) {
                res = res.data;
                if (res.data.access_token) {
                    var result=res;
                    if(result.data.access_token){
                        result.data.access_token =result.data.token_type + ' ' + result.data.access_token;
                        var expires_in = result.data.expires_in || 315360000;
                        cookieStorage.set("user_token",result.access_token,expires_in);
                        // wx.setStorageSync("user_token",result.access_token);
                        if(this.data.orginUrl){
                            var path = [
                                'pages/index/index/index',
                                'pages/user/index/main'
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

                    }
                } else {
                    wx.showModal({
                        content: res.message || "验证码不正确",
                        showCancel: false
                    });
                }
            } else {
                wx.showModal({
                    content:  "请求失败",
                    showCancel: false
                });
            }
            this.setData({
                showLoading: false
            })
        }).catch(rej =>{
            wx.showModal({
                content:  "请求失败",
                showCancel: false
            });
            this.setData({
                showLoading: false
            })
        })
    },
    autoLogin(code) {
        sandBox.post({
            api: 'api/mini/program/login',
            data: {
                code: code
            },
        }).then(res =>{
            if (res.statusCode == 200) {
                res = res.data;
                if (res.data && res.data.open_id) {
                    this.setData({
                        open_id: res.data.open_id
                    })
                }
                if (res.access_token) {
                    var access_token = res.token_type + ' ' + res.access_token;
                    var expires_in = res.expires_in || 315360000;
                    cookieStorage.set("user_token",access_token,expires_in);
                    wx.switchTab({
                        url: '/pages/user/personal/main'
                    })
                }
            } else {

            }
        }).catch(rej =>{
            wx.showToast({
                title: '请求接口失败',
                image: '../../../assets/image/error.png'
            })
        })
    }

});
