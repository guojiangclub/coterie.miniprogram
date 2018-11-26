import {config,pageLogin,sandBox,getUrl,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        describe:'',
        img_list:[],
        is_show:false
    },
    onLoad(){

    },
    onShow(){

    },
    changeinput(e){
        this.setData({
            describe:e.detail.value
        })
    },
    //上传头像
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
            if (result.status) {
                var img_list = this.data.img_list;
                img_list.push(result.data.url);
                this.setData({
                    img_list:img_list
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
    //添加标签
    jumpTopic(){
        wx.navigateTo({
            url:'/pages/knowladge/topic/main'
        })
    },
    //显示链接
    changeLink(){
        this.setData({
            is_show:!this.data.is_show
        })
    },
    //@别人
    jumpAite(){
        wx.navigateTo({
            url:'/pages/knowladge/manList/main'
        })
    }



})