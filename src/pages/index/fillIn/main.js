import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        knowObj:{
            avatar:"",//头像url
            name:"",//果酱圈名称
            description:"",//果酱圈简介
            isPay: false,//是否付费
            cost_type: 'free',
            is_black:false
        }
    },
    onShow(){
        wx.getSystemInfo({
                success:res=>{

                    if(res.system.indexOf('iOS') != -1){
                        wx.showModal({
                            content:'十分抱歉，由于相关规范，暂不支持IOS。',
                            showCancel:false
                        })
                        this.setData({
                            is_black:true
                        })

                    }
                }
            }


        )

    },
    //是否选择付费
    changePay(){
        this.setData({
            'knowObj.isPay':!this.data.knowObj.isPay
        })
    },
    //果酱圈名称
    changeName(e){
        /*console.log(e.detail.value);*/
        this.setData({
            'knowObj.name':e.detail.value
        })
    },
    //果酱圈简介
    changeIntroduction(e){
        this.setData({
            'knowObj.description':e.detail.value
        })
    },
    //下一步
    nextStep(){
        var message = "";
        if(!this.data.knowObj.avatar){
            message = "请上传果酱圈头像";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if(!this.data.knowObj.name){
            message = "请填写果酱圈名称";
            wx.showModal({
                content:message,
                showCancel:false
            })

        }  else if(this.data.knowObj.name && this.data.knowObj.name.length > 20){
            message = "果酱圈名称不能超过20个字";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if (!this.data.knowObj.description){
            message = "请填写果酱圈简介";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if(this.data.knowObj.description && this.data.knowObj.description.length > 500){
            message = "果酱圈简介不能超过500个字";
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
            api: 'cdn/upload',
            filePath: path[0],
            header: {
                Authorization:token
            },
            name: 'upload_file',
        }).then(res => {
            var result = JSON.parse(res.data);
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