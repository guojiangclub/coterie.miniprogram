import {config,getUrl,pageLogin,sandBox,cookieStorage} from '../../../lib/myapp.js';
Page({
    data:{
        id:'' ,// 圈子id
        questioner:'',
        content:'',
        img_list:[]

    },
    onLoad(e){
        this.setData({
            id:e.id
        })

    },
    onShow(){
        var questioner = cookieStorage.get('questioner');
        this.setData({
            questioner:questioner
        })

    },
    //跳到提问页面
    jumpManlist(){
        wx.navigateTo({
            url:'/pages/knowladge/manList/main?id='+this.data.id+'&type=question'
        })
    },
    //提问内容
    changevalue(e){
        this.setData({
            content:e.detail.value
        })
    },
    //上传图片
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
    //删除图片
    deleteImg(e){
        var index = e.currentTarget.dataset.index;
        var img_list = this.data.img_list;
        img_list.splice(index,1);
        this.setData({
            img_list:img_list
        })
    },
    //发表
    publish(){
        var message = '';
      if(!this.data.content){
          message = "提问内容不能为空"
      } else if(!this.data.questioner){
          message = "请选择你要提问的人"
      }
      if(message){
          wx.showModal({
              content:message,
              showCancel:false
          })
      } else {
          var answer_user_id = this.data.questioner.user_id;
          this.postQuestion(this.data.img_list,answer_user_id,this.data.id,this.data.content)
      }
    },
    //请求提问接口
    postQuestion(img_list,answer_user_id,coterie_id,content){
        wx.showLoading({
            title:'加载中',
            mask:'true'
        });
        var token = cookieStorage.get('user_token');
        sandBox.post({
            api:'api/question/store',
            data:{
                img_list:img_list || '',
                answer_user_id:answer_user_id || '',
                coterie_id:coterie_id,
                content:content
            },
            header:{
                Authorization:token
            }
        }).then(res=>{
            if(res.statusCode == 200){
                res = res.data;
                if(res.status){

                } else {
                    wx.showModal({
                        content: res.message || '加载失败',
                        showCancel: false
                    })
                }
            } else {
                wx.showModal({
                    content: res.message || '加载失败',
                    showCancel: false
                })
            }
            wx.hideLoading();
        }).catch(rej=>{
            wx.hideLoading();
            wx.showModal({
                content:'加载失败',
                showCancel: false
            })
        })
    }

})