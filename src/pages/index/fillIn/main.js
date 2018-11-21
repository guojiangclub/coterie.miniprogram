import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        knowObj:{
            avatar:"",//头像url
            name:"",//数据圈名称
            description:"",//数据圈简介
            isPay: false,//是否付费
            cost_type: 'free'
        }
    },
    //是否选择付费
    changePay(){
        this.setData({
            'knowObj.isPay':!this.data.knowObj.isPay
        })
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
    nextStep(){
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
            if (this.data.knowObj.isPay) {
                this.setData({
                    'knowObj.cost_type': 'charge'
                })
            } else {
                this.setData({
                    'knowObj.cost_type': 'free'
                })
            }
            cookieStorage.set('knowObj',this.data.knowObj);
            wx.navigateTo({
                url:'/pages/index/amount/main?is_pay='+ this.data.knowObj.isPay
            })
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
    }
})