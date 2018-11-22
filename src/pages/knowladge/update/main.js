import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        knowObj:{
            avatar:"",//头像url
            name:"",//数据圈名称
            description:"",//数据圈简介
            cost_type: 'free'
        }
    },
    onShow(){
        this.getCoterie(3)
    },
    //数据圈名称
    changeName(e){
        /*console.log(e.detail.value);*/
        this.setData({
            'knowObj.name':e.detail.value
        })
    },
    //数据圈简介
    changeIntroduction(e){
        this.setData({
            'knowObj.description':e.detail.value
        })
    },
    //下一步
    sure(){
        var message = "";
        if(!this.data.knowObj.avatar){
            message = "请上传数据圈头像";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if(!this.data.knowObj.name){
            message = "请填写数据圈名称";
            wx.showModal({
                content:message,
                showCancel:false
            })

        }  else if(this.data.knowObj.name && this.data.knowObj.name.length > 20){
            message = "数据圈名称不能超过20个字";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if (!this.data.knowObj.description){
            message = "请填写数据圈简介";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if(this.data.knowObj.description && this.data.knowObj.description.length > 500){
            message = "数据圈简介不能超过500个字";
            wx.showModal({
                content:message,
                showCancel:false
            })

        } else {
            //请求修改圈子信息接口
            this.postUpdate(3,this.data.knowObj.name,this.data.knowObj.description,this.data.knowObj.avatar)
        }
    },
    // 上传头像
    changeImage() {
        wx.chooseImage({
            count:1,
            success: res => {
                this.upload(res.tempFilePaths)
            }
        })
    },
    upload(path) {
        wx.showLoading({
            content: '上传中',
            mask: true
        })
        var token=cookieStorage.get('user_token');
        sandBox.uploadFile({
            api: 'api/upload/image',
            filePath: path[0],
            header: {
                Authorization:token
            },
            name: 'image',
        }).then(res => {
            var result = JSON.parse(res.data);
            console.log(result);
            if (result.status) {
                this.setData({
                    'knowObj.avatar': result.data.url
                })
            } else {
                wx.showModal({
                    content: result.message || '上传失败',
                    showCancel: false
                })
            }
            wx.hideLoading();
        }).catch(err => {
            wx.showModal({
                content: '上传失败',
                showCancel: false
            })
            wx.hideLoading();
        })
    },
    //获取圈子头像名称头像
    getCoterie(coterie_id){
        var token = cookieStorage.get('user_token');
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        sandBox.get({
            api:'api/coterie/edit',
            data:{
                coterie_id:coterie_id
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if(res.status){
                    //获取到数据之后绑定
                    var data = res.data;
                    this.setData({
                        'knowObj.avatar':data.avatar,
                        'knowObj.name':data.name,
                        'knowObj.description':data.description
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
    },
    //请求修改圈子信息接口
    postUpdate(coterie_id,name,description,avatar){
        var token = cookieStorage.get('user_token');
        wx.showLoading({
            title:'加载中',
            mask:true
        });
        sandBox.post({
            api:'api/coterie/update',
            data:{
                coterie_id:coterie_id,
                name:name,
                description:description,
                avatar:avatar
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if (res.statusCode == 200){
                res = res.data;
                if(res.status){
                    wx.showToast({
                        title:'修改成功',
                        icon:'success',
                        mask:true
                    })
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/knowladge/detail/main?id=' + res.data.id
                        })
                    }, 1000)
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