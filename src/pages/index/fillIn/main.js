import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';

Page({
    data:{
        knowObj:{
            url:"dkvd",//头像url
            name:"",//数据圈名称
            introduction:"",//数据圈简介
            isPay:false//是否付费
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
            'knowObj.introduction':e.detail.value
        })
    },
    //下一步
    nextStep(){
        var message = "";
        if(!this.data.knowObj.url){
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
        } else if (!this.data.knowObj.introduction){
            message = "请填写数据圈简介";
            wx.showModal({
                content:message,
                showCancel:false
            })
        } else if(this.data.knowObj.introduction && this.data.knowObj.introduction.length > 500){
            message = "数据圈简介不能超过500个字";
            wx.showModal({
                content:message,
                showCancel:false
            })

        } else {
            cookieStorage.set('knowObj',this.data.knowObj);
            wx.navigateTo({
                url:'/pages/index/amount/main?is_pay='+ this.data.knowObj.isPay
            })
        }
    }

})